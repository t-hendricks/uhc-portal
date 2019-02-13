import PropTypes from 'prop-types';
import React from 'react';

import { PaginationRow } from 'patternfly-react';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions/viewOptionsActions';

const ViewPaginationRow = ({
  currentPage, pageSize, totalCount, totalPages, onFirstPage,
  onLastPage, onPreviousPage, onNextPage, onPageInput, onPerPageSelect,
}) => totalCount > pageSize && (
  <PaginationRow
    viewType="list"
    pagination={{
      page: currentPage,
      perPage: pageSize,
      perPageOptions: [5, 10, 25, 50, 100],
    }}
    amountOfPages={totalPages}
    pageInputValue={currentPage}
    itemCount={totalCount}
    itemsStart={(currentPage - 1) * pageSize + 1}
    itemsEnd={Math.min(currentPage * pageSize, totalCount)}
    onFirstPage={onFirstPage}
    onLastPage={onLastPage}
    onPreviousPage={onPreviousPage}
    onNextPage={onNextPage}
    onPageInput={onPageInput}
    onPerPageSelect={onPerPageSelect}
  />
);

ViewPaginationRow.propTypes = {
  // viewType *is* used, in mapDispatchToProps.
  // The linter is not smart enough to figure it out, therefor:
  // eslint-disable-next-line react/no-unused-prop-types
  viewType: PropTypes.string, // Check viewOptionsReducer to see how this works.
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  totalCount: PropTypes.number,
  totalPages: PropTypes.number,
  onFirstPage: PropTypes.func,
  onLastPage: PropTypes.func,
  onNextPage: PropTypes.func,
  onPreviousPage: PropTypes.func,
  onPageInput: PropTypes.func,
  onPerPageSelect: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFirstPage: () => dispatch(actions.onFirstPage(ownProps.viewType)),
  onLastPage: () => dispatch(actions.onLastPage(ownProps.viewType)),
  onNextPage: () => dispatch(actions.onNextPage(ownProps.viewType)),
  onPreviousPage: () => dispatch(actions.onPreviousPage(ownProps.viewType)),
  onPageInput: (event) => {
    const pageIndex = parseInt(event.target.value, 10);
    dispatch(actions.onPageInput(pageIndex, ownProps.viewType));
  },
  onPerPageSelect: pageSize => dispatch(actions.onPerPageSelect(pageSize, ownProps.viewType)),
});

export default connect(
  null,
  mapDispatchToProps,
)(ViewPaginationRow);
