import React from 'react';
import { Filter, FormControl } from 'patternfly-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as viewActions from '../../../redux/actions/viewOptionsActions';
import { viewConstants } from '../../../redux/constants';


class ClusterListFilter extends React.Component {
  state = {
    // The current filter value is only relevant internally, so it shouldn't be in redux
    currentValue: '',
  };

  updateCurrentValue(event) {
    const { setFilter } = this.props;
    this.setState({ currentValue: event.target.value });
    // The backend defers the complexity of this search to the UI...
    setFilter(`display_name like '%${event.target.value}%' or (display_name = '' and name like '%${event.target.value}%')`);
  }


  render() {
    const { currentValue } = this.state;
    return (
      <Filter className="pull-right cluster-list-top">
        <FormControl
          type="text"
          value={currentValue}
          placeholder="Filter by name..."
          onChange={e => this.updateCurrentValue(e)}
        />
      </Filter>);
  }
}

ClusterListFilter.propTypes = {
  setFilter: PropTypes.func.isRequired,
};


const mapDispatchToProps = {
  setFilter: filter => viewActions.onListFilterSet(filter, viewConstants.CLUSTERS_VIEW),
};

export default connect(null, mapDispatchToProps)(ClusterListFilter);
