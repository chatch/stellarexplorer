import Pagination from "react-bootstrap/Pagination";
import { FormattedMessage } from "react-intl";

const PagingControls = ({ handleClickNext, handleClickPrev, hidePrev }) => (
  <Pagination>
    {!hidePrev && (
      <Pagination.Prev onClick={handleClickPrev} href="#">
        &larr; <FormattedMessage id="paging.prev" />
      </Pagination.Prev>
    )}
    <Pagination.Next next onClick={handleClickNext} href="#">
      <FormattedMessage id="paging.next" /> &rarr;
    </Pagination.Next>
  </Pagination>
);

export default PagingControls;
