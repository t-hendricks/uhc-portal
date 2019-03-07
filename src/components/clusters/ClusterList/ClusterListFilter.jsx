import React from 'react';
import { Filter, FormControl } from 'patternfly-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { onListFilterSet } from '../../../redux/actions/viewOptionsActions';
import { viewConstants } from '../../../redux/constants';


class ClusterListFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // The current input value is in the local state, while the currently
      // set filter is in the redux state.
      // This is done to allow some delay between the user's input and
      // the actual filtering, to give them time to finish typing.
      currentValue: '',
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.inputTimeoutID = null;
  }

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

  updateCurrentValue(event) {
    if (this.inputTimeoutID !== null) {
      clearTimeout(this.inputTimeoutID);
    }
    this.setState({ currentValue: event.target.value });
    this.inputTimeoutID = setTimeout(this.updateFilter, 300);
  }

  render() {
    const { currentValue } = this.state;
    return (
      <Filter className="pull-right cluster-list-top">
        <FormControl
          type="text"
          value={currentValue}
          placeholder="Filter by name or ID..."
          onChange={e => this.updateCurrentValue(e)}
        />
      </Filter>);
  }
}

ClusterListFilter.propTypes = {
  currentFilter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentFilter: state.viewOptions[viewConstants.CLUSTERS_VIEW].filter,
});

const mapDispatchToProps = {
  setFilter: filter => onListFilterSet(filter, viewConstants.CLUSTERS_VIEW),
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterListFilter);
