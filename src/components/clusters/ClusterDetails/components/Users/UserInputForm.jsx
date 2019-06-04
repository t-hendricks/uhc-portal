import React from 'react';
import {
  Spinner, Col, FormControl, Button,
} from 'patternfly-react';
import PropTypes from 'prop-types';

class UserInputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: '',
    };
    this.updateCurrentValue = this.updateCurrentValue.bind(this);
    this.save = this.save.bind(this);
  }

  updateCurrentValue(e) {
    this.setState({ currentValue: e.target.value });
  }

  save() {
    const { currentValue } = this.state;
    const { saveUser, clusterID } = this.props;
    this.setState({ currentValue: '' });
    saveUser(clusterID, 'dedicated-admins', currentValue);
  }

  render() {
    const { currentValue } = this.state;
    const { pending } = this.props;
    return (
      <React.Fragment>
        <Col sm={2}>
          <FormControl
            type="text"
            value={currentValue}
            placeholder="Enter a user name or user ID"
            onChange={e => this.updateCurrentValue(e)}
            disabled={pending}
          />
        </Col>
        <Col sm={2}>
          <FormControl componentClass="select" disabled={pending}>
            <option>
              dedicated-admins
            </option>
          </FormControl>
        </Col>
        <Col sm={1}>
          <Button onClick={this.save} disabled={pending || !currentValue.length}>
            Add
          </Button>
        </Col>
        {pending && (
          <Col sm={1}>
            <Spinner loading />
          </Col>
        )}
      </React.Fragment>
    );
  }
}

UserInputForm.propTypes = {
  clusterID: PropTypes.string.isRequired,
  saveUser: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
};

export default UserInputForm;
