import React from 'react';
import {
  Spinner,
} from '@redhat-cloud-services/frontend-components';
import {
  Button, GridItem, Grid, TextInput, Select, SelectOption, SelectVariant, FormGroup,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

import { checkUserID } from '../../../../../../common/validators';

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
    if (!checkUserID(currentValue)) {
      this.setState({ currentValue: '' });
      saveUser(clusterID, 'dedicated-admins', currentValue);
    }
  }

  render() {
    const { currentValue, isSelectOpen } = this.state;
    const { pending } = this.props;
    const validationMessage = checkUserID(currentValue);
    return (
      <Grid gutter="sm">
        <GridItem sm={2}>
          <FormGroup
            helperTextInvalid={validationMessage}
            isValid={!validationMessage}
            fieldId="edit-user-id-input"
          >
            <TextInput
              aria-label="User name or ID"
              type="text"
              value={currentValue}
              isValid={!validationMessage}
              placeholder="Enter a user name or user ID"
              onChange={this.updateCurrentValue}
              isDisabled={pending}
              id="edit-user-id-input"
            />
          </FormGroup>
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
          <Button
            onClick={this.save}
            isDisabled={pending || !currentValue.length || !!validationMessage}
          >
            Add
          </Button>
        </GridItem>
        {pending && (
          <GridItem sm={1}>
            <Spinner className="cluster-user-form-spinner" />
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
