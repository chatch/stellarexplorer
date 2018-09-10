import React from 'react'
import PropTypes from 'prop-types'
import isFunction from 'lodash/isFunction'
import has from 'lodash/has'
import {withServer} from './HOCs'
import {handleFetchDataFailure} from '../../lib/utils'

// Timeout the streaming after 3 minutes. At least until the issue #40 is done
const STREAM_TIMEOUT = 3 * 60 * 1000

const propTypesContainer = {
  limit: PropTypes.number,
  page: PropTypes.number,
  usePaging: PropTypes.bool,
  refresh: PropTypes.bool,
  server: PropTypes.object,
}

/**
 * Wrap a component with Horizon data fetching abilities.
 
 * @param fetchDataFn {Function => Promise} Function that makes a call to the 
 *          server requesting the required data. Returns a Promise resolving to 
 *          the result data.
 * @param rspRecToPropsRecFn {Function} Converts from server response record 
 *          format to some other format that the consuming container expects.
 * @param callBuilderFn {Function => CallBuilder} Function that returns a 
 *          CallBuilder instance for the type of data being requested. This 
 *          CallBuilder is used to setup a stream() to receive updates.
 */
const withDataFetchingContainer = (
  fetchDataFn,
  rspRecToPropsRecFn,
  callBuilderFn
) => Component => {
  const dataFetchingContainerClass = class extends React.Component {
    static defaultProps = {
      limit: 5,
      page: 0,
      refresh: false,
      usePaging: false,
    }

    state = {
      cursor: 0,
      isLoading: true,
      records: [],
      streamCloseFn: undefined,
    }

    componentDidMount() {
      this.fetchData(fetchDataFn(this.props))
    }

    componentDidUpdate(prevProps) {
      // fetched data and page hasn't changed
      if (this.props.page === prevProps.page) {
        // setup new records stream if refresh on and stream hasn't yet been
        // initialised
        if (
          this.props.refresh === true &&
          this.props.usePaging === false &&
          !isFunction(this.state.streamCloseFn) &&
          isFunction(callBuilderFn)
        ) {
          this.createStream()
        }
        return
      }

      // next / prev page - fetch new page data
      if (this.props.page > prevProps.page) this.fetchData(this.state.next())
      else if (this.props.page < prevProps.page)
        this.fetchData(this.state.prev())

      this.setState({isLoading: true, records: []})
    }

    componentWillUnmount() {
      if (isFunction(this.state.streamCloseFn)) this.state.streamCloseFn()
    }

    /*
     * One time data fetching - these functions pull the first page of data 
     *    when the component is first loaded
     */

    fetchData(fetchDataPromise) {
      fetchDataPromise
        .then(r => this.responseToState(r))
        .then(newState => {
          this.setState(newState)
          return null
        })
        .catch(e => {
          handleFetchDataFailure()(e)
          this.setState({isLoading: false})
        })
    }

    responseToState(rsp) {
      const cursor =
        rsp.records.length > 0 && has(rsp.records[0], 'paging_token')
          ? rsp.records[0].paging_token
          : 0
      if (cursor === 0) {
        console.warn('no cursor')
      }
      return {
        isLoading: false,
        next: rsp.next,
        prev: rsp.prev,
        records: rsp.records.map(rspRecToPropsRecFn),
        cursor,
        parentRenderTimestamp: Date.now(),
      }
    }

    /*
     * Stream data fetching - these functions take over after the first initial 
     *    page of data is loaded above. Horizon server pushes events into 
     *    onStreamNewRecord below
     */

    createStream() {
      if (!isFunction(callBuilderFn) || this.state.cursor <= 0) return

      const streamCloseFn = callBuilderFn(this.props)
        .order('asc')
        .cursor(this.state.cursor)
        .stream({
          onmessage: this.onStreamNewRecord.bind(this),
          onerror: this.onStreamError.bind(this),
        })

      setTimeout(() => {
        this.state.streamCloseFn()
      }, STREAM_TIMEOUT)

      this.setState({streamCloseFn})
    }

    onStreamNewRecord(newRecordFromServer) {
      const newRecord = rspRecToPropsRecFn(newRecordFromServer)
      const records = [...this.state.records] // new array instead of mutating the existing one

      const insertIdx = records.findIndex(rec => rec.time < newRecord.time)
      records.splice(insertIdx, 0, newRecord)
      records.splice(-1, 1)

      this.setState({
        records,
        parentRenderTimestamp: Date.now(), // reset the latest render time
      })
    }

    // NOTE: errors stream in here regularly. see this issue in horizon:
    //       https://github.com/stellar/horizon/issues/119
    //       js-stellar-sdk reconnects each stream every 30 - 50 seconds or so
    //       so we see 1 or 2 each minute for each stream.
    onStreamError(error) {
      console.error('stream error (most likely horizon #119):')
      console.error(error)
    }

    render() {
      return (
        <Component
          isLoading={this.state.isLoading}
          records={this.state.records}
          parentRenderTimestamp={this.state.parentRenderTimestamp}
          {...this.props}
        />
      )
    }
  }

  dataFetchingContainerClass.propTypes = propTypesContainer

  return withServer(dataFetchingContainerClass)
}

export {withDataFetchingContainer}
