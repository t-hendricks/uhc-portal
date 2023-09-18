import React from 'react';
import { TextInput } from '@patternfly/react-core';
import PropTypes from 'prop-types';

class ClusterListFilter extends React.Component {
  constructor(props) {
    super(props);
    this.updateFilter = this.updateFilter.bind(this);
    this.inputTimeoutID = null;
  }

  state = {
    // The current input value is in the local state, while the currently
    // set filter is in the redux state.
    // This is done to allow some delay between the user's input and
    // the actual filtering, to give them time to finish typing.
    currentValue: '',
  };

  componentDidMount() {
    const { currentFilter } = this.props;
    if (currentFilter) {
      this.setState({ currentValue: currentFilter });
    }
  }

  updateFilter() {
    const { setFilter } = this.props;
    const { currentValue } = this.state;
    setFilter(currentValue);
  }

  updateCurrentValue(value) {
    if (this.inputTimeoutID !== null) {
      clearTimeout(this.inputTimeoutID);
    }
    this.setState({ currentValue: value });
    this.inputTimeoutID = setTimeout(this.updateFilter, 300);
  }

  render() {
    const { currentValue } = this.state;
    const { isDisabled } = this.props;
    return (
      <TextInput
        type="text"
        aria-label="Filter"
        className="cluster-list-filter"
        value={currentValue}
        placeholder="Filter by name or ID..."
        data-testid="filterInputClusterList"
        onChange={(value) => this.updateCurrentValue(value)}
        isDisabled={isDisabled}
      />
    );
  }
}

ClusterListFilter.propTypes = {
  currentFilter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

export default ClusterListFilter;
