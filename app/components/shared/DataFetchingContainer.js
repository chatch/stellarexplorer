import React from 'react'
import PropTypes from 'prop-types'
import isFunction from 'lodash/isFunction'
import has from 'lodash/has'
import {withServer} from './HOCs'
import {handleFetchDataFailure} from '../../lib/utils'
import {HorizonServerHandleContext} from '../../contexts'

const propTypesContainer = {
  limit: PropTypes.number,
  page: PropTypes.number,
  usePaging: PropTypes.bool,
  refresh: PropTypes.bool,
  server: PropTypes.object,
}

const defaultProps = {
    limit: 5,
    page: 0,
    refresh: false,
    usePaging: false,
  }

  const horizonResponseToProps = (rsp) => {
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
    //   records: rsp.records.map(rspRecToPropsRecFn),
      cursor,
    }
  }

/**
 * Wrap a component with Horizon data fetching abilities.
 
 * @param fetchDataFn {Function => Promise} Function that makes a call to the 
 *          server requesting the required data. Returns a Promise resolving to 
 *          the result data.
 * @param rspRecToPropsRecFn {Function} Converts from server response record 
 *          format to some other format that the consuming container expects.
 */
export function DataFetchingContainer(
  fetchDataFn,
  rspRecToPropsRecFn,
) {
//   const [cursor, setCursor] = useState(0)
//   const [isLoading, setIsLoading] = useState(true)
//   const [records, setRecords] = useState([])

//   useEffect(() => {
//       this.fetchData(fetchDataFn(this.props))

//     componentDidUpdate(prevProps) {
//       // next / prev page - fetch new page data
//       if (this.props.page > prevProps.page) this.fetchData(this.state.next())
//       else if (this.props.page < prevProps.page)
//         this.fetchData(this.state.prev())

//       this.setState({isLoading: true, records: []})
//     }

    /*
     * One time data fetching - these functions pull the first page of data 
     *    when the component is first loaded
     */

    // fetchData(fetchDataPromise) {
    //   fetchDataPromise
    //     .then(r => this.responseToState(r))
    //     .then(newState => {
    //       this.setState(newState)
    //       return null
    //     })
    //     .catch(e => {
    //       handleFetchDataFailure()(e)
    //       setIsLoading(false)
    //     })
    // }


    // render() {
    //   return (
    //     <HorizonServerHandleContext.Consumer>
    //     {server => (
    //         <Component
    //         isLoading={this.state.isLoading}
    //         records={this.state.records}
    //         server={server}
    //         {...this.props}
    //         />
    //         )}
    //     </HorizonServerHandleContext.Consumer>
    //   )
    // }
  }
