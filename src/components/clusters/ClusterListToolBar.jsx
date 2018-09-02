import React from 'react';
import {
  Filter, FormControl, Toolbar, Sort, Button,
} from 'patternfly-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as viewActions from '../../redux/actions/viewOptionsActions';
import { viewConstants } from '../../redux/constants';

const sortFields = [
  {
    id: 'name',
    title: 'Name',
    isNumeric: false,
  },
  {
    id: 'region',
    title: 'Region',
    isNumeric: false,
  },
];

const filterFields = [
  {
    id: 'name',
    title: 'Name',
    placeholder: 'Filter by Name',
    filterType: 'text',
  },
  {
    id: 'region',
    title: 'Region',
    placeholder: 'Filter by AWS Region',
    filterType: 'select',
    filterValues: [
      { title: 'us-east-1', id: 'us-east-1' },
      { title: 'eu-west-1', id: 'eu-west-1' },
    ],
  },
];


class ClusterListToolBar extends React.Component {
    state = {
      // The current filter type and value are only relevant internally, so it shouldn't be in redux
      currentFilterType: filterFields[0],
      currentValue: '',
      filterCategory: undefined,
      categoryValue: undefined,
    };

    onValueKeyPress = (keyEvent) => {
      const { currentValue, currentFilterType } = this.state;

      if (keyEvent.key === 'Enter' && currentValue && currentValue.length > 0) {
        this.setState({ currentValue: '' });
        this.filterAdded(currentFilterType, currentValue);
        keyEvent.stopPropagation();
        keyEvent.preventDefault();
      }
    }


  filterAdded = (field, value) => {
    let filterText = '';
    if (field.title) {
      filterText = field.title;
    } else {
      filterText = field;
    }
    filterText += ': ';

    if (value.filterCategory) {
      filterText += `${value.filterCategory.title || value.filterCategory}-${value.filterValue.title || value.filterValue}`;
    } else if (value.title) {
      filterText += value.title;
    } else {
      filterText += value;
    }

    const { addFilter } = this.props;
    addFilter({ label: filterText, type: field.id });
  };

  selectFilterType = (filterType) => {
    const { currentFilterType } = this.state;
    if (currentFilterType !== filterType) {
      this.setState(prevState => ({
        currentValue: '',
        currentFilterType: filterType,
        filterCategory:
            filterType.filterType === 'complex-select'
              ? undefined
              : prevState.filterCategory,
        categoryValue:
            filterType.filterType === 'complex-select'
              ? ''
              : prevState.categoryValue,
      }));
    }
  }

  filterValueSelected = (filterValue) => {
    const { currentFilterType, currentValue } = this.state;

    if (filterValue !== currentValue) {
      this.setState({ currentValue: filterValue });
      if (filterValue) {
        this.filterAdded(currentFilterType, filterValue);
      }
    }
  }

  filterCategorySelected = (category) => {
    const { filterCategory } = this.state;
    if (filterCategory !== category) {
      this.setState({ filterCategory: category, currentValue: '' });
    }
  }

  categoryValueSelected = (value) => {
    const { currentValue, currentFilterType, filterCategory } = this.state;

    if (filterCategory && currentValue !== value) {
      this.setState({ currentValue: value });
      if (value) {
        const filterValue = {
          filterCategory,
          filterValue: value,
        };
        this.filterAdded(currentFilterType, filterValue);
      }
    }
  }

  updateCurrentValue = (event) => {
    this.setState({ currentValue: event.target.value });
  }

  removeFilter = (filter) => {
    const { removeFilter } = this.props;
    removeFilter(filter);
  }

  clearFilters = () => {
    const { clearFilters } = this.props;
    clearFilters();
  }

  changeSortType = (newSorting) => {
    const { setSorting, sorting } = this.props;
    setSorting(Object.assign({}, sorting, newSorting));
  }

  changeSortDirection = () => {
    const { setSorting, sorting } = this.props;
    setSorting(Object.assign({}, sorting, { isSortAscending: !sorting.isSortAscending }));
  }

  renderInput() {
    const { currentFilterType, currentValue, filterCategory } = this.state;
    if (!currentFilterType) {
      return null;
    }

    if (currentFilterType.filterType === 'select') {
      return (
        <Filter.ValueSelector
          filterValues={currentFilterType.filterValues}
          placeholder={currentFilterType.placeholder}
          currentValue={currentValue}
          onFilterValueSelected={this.filterValueSelected}
        />
      );
    } if (currentFilterType.filterType === 'complex-select') {
      return (
        <Filter.CategorySelector
          filterCategories={currentFilterType.filterCategories}
          currentCategory={filterCategory}
          placeholder={currentFilterType.placeholder}
          onFilterCategorySelected={this.filterCategorySelected}
        >
          <Filter.CategoryValueSelector
            categoryValues={filterCategory && filterCategory.filterValues}
            currentValue={currentValue}
            placeholder={currentFilterType.filterCategoriesPlaceholder}
            onCategoryValueSelected={this.categoryValueSelected}
          />
        </Filter.CategorySelector>
      );
    }
    return (
      <FormControl
        type={currentFilterType.filterType}
        value={currentValue}
        placeholder={currentFilterType.placeholder}
        onChange={e => this.updateCurrentValue(e)}
        onKeyPress={e => this.onValueKeyPress(e)}
      />
    );
  }

  render() {
    const { activeFilters, sorting, children } = this.props;
    const { currentFilterType } = this.state;

    return (
      <Toolbar>
        <div style={{ width: 300 }}>
          <Filter>
            <Filter.TypeSelector
              filterTypes={filterFields}
              currentFilterType={currentFilterType}
              onFilterTypeSelected={this.selectFilterType}
            />
            {this.renderInput()}
          </Filter>
        </div>
        <Sort>
          <Sort.TypeSelector
            sortTypes={sortFields}
            currentSortType={sorting}
            onSortTypeSelected={this.changeSortType}
          />
          <Sort.DirectionSelector
            isNumeric={sorting.isNumeric}
            isAscending={sorting.isSortAscending}
            onClick={this.changeSortDirection}
          />
        </Sort>
        <div className="form-group">
          {children}
        </div>
        {activeFilters
          && activeFilters.length > 0 && (
            <Toolbar.Results>
              <Filter.ActiveLabel>
                Active Filters:
              </Filter.ActiveLabel>
              <Filter.List>
                {activeFilters.map((item, index) => (
                  <Filter.Item
                    key={index} // not sure what should be the key
                    onRemove={this.removeFilter}
                    filterData={item}
                  >
                    {item.label}
                  </Filter.Item>
                ))}
              </Filter.List>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.clearFilters();
                }}
              >
                Clear All Filters
              </a>
            </Toolbar.Results>
        )}
      </Toolbar>
    );
  }
}

ClusterListToolBar.propTypes = {
  activeFilters: PropTypes.array.isRequired,
  sorting: PropTypes.object.isRequired,
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  setSorting: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  activeFilters: state.viewOptions[viewConstants.CLUSTERS_VIEW].filter,
  sorting: state.viewOptions[viewConstants.CLUSTERS_VIEW].sorting,
});

const mapDispatchToProps = {
  addFilter: filter => viewActions.onListFilterAdded(filter, viewConstants.CLUSTERS_VIEW),
  removeFilter: filter => viewActions.onListFilterRemoved(filter, viewConstants.CLUSTERS_VIEW),
  clearFilters: () => viewActions.onListFilterCleared(viewConstants.CLUSTERS_VIEW),
  setSorting: sorting => viewActions.onListSortBy(sorting, viewConstants.CLUSTERS_VIEW),
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterListToolBar);
