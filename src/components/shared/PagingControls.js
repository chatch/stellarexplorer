import React from 'react'
import Pager from 'react-bootstrap/lib/Pager'
import {FormattedMessage} from 'react-intl'

const PagingControls = ({handleClickNext, handleClickPrev, hidePrev}) =>
  <Pager>
    {!hidePrev &&
      <Pager.Item previous onClick={handleClickPrev} href="#">
        &larr; <FormattedMessage id="paging.prev" />
      </Pager.Item>}
    <Pager.Item next onClick={handleClickNext} href="#">
      <FormattedMessage id="paging.next" /> &rarr;
    </Pager.Item>
  </Pager>

export default PagingControls
