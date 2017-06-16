import React from 'react'
import {Pager} from 'react-bootstrap'

const PagingControls = ({handleClickNext, handleClickPrev}) => <Pager>
  <Pager.Item previous onClick={handleClickPrev} href="#">&larr; Previous Page</Pager.Item>
  <Pager.Item next onClick={handleClickNext} href="#">Next Page &rarr;</Pager.Item>
</Pager>

export default PagingControls
