import React from 'react';
import {
  Spinner,
} from 'patternfly-react';
import {
  Button, GridItem, Grid, TextInput, Select, SelectOption, SelectVariant,
} from '@patternfly/react-core';

import PropTypes from 'prop-types';

class UserInputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: '',
      isSelectOpen: false,
    };
    this.updateCurrentValue = this.updateCurrentValue.bind(this);
    this.onSelectToggle = this.onSelectToggle.bind(this);
    this.save = this.save.bind(this);
  }

  onSelectToggle() {
    this.setState(state => ({ isSelectOpen: !state.isSelectOpen }));
  }

  updateCurrentValue(value) {
    this.setState({ currentValue: value });
  }

  save() {
    const { currentValue } = this.state;
    const { saveUser, clusterID } = this.props;
    this.setState({ currentValue: '' });
    saveUser(clusterID, 'dedicated-admins', currentValue);
  }

  render() {
    const { currentValue, isSelectOpen } = this.state;
    const { pending } = this.props;
    return (
      <Grid gutter="sm">
        <GridItem sm={2}>
          <TextInput
            aria-label="User name or ID"
            type="text"
            value={currentValue}
            placeholder="Enter a user name or user ID"
            onChange={this.updateCurrentValue}
            isDisabled={pending}
          />
        </GridItem>
        <GridItem sm={2}>
          <Select
            variant={SelectVariant.single}
            isDisabled={pending}
            onToggle={this.onSelectToggle}
            onSelect={() => { this.setState({ isSelectOpen: false }); }}
            isExpanded={isSelectOpen}
            aria-label="Group"
          >
            {[<SelectOption key="dedicated-admins" value="dedicated-admins" />]}
          </Select>
        </GridItem>
        <GridItem sm={1}>
          <Button onClick={this.save} isDisabled={pending || !currentValue.length}>
            Add
          </Button>
        </GridItem>
        {pending && (
          <GridItem sm={1}>
            <Spinner loading />
          </GridItem>
        )}
      </Grid>
    );
  }
}

UserInputForm.propTypes = {
  clusterID: PropTypes.string.isRequired,
  saveUser: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
};

export default UserInputForm;
