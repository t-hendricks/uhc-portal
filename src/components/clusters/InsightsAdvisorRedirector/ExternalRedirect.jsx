import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { Bullseye } from '@patternfly/react-core';

class ExternalRedirect extends React.Component {
  componentDidMount() {
    const { url } = this.props;
    window.location.replace(url);
  }

  render() {
    return (
      <Bullseye>
        <Spinner size="lg" centered />
      </Bullseye>
    );
  }
}

ExternalRedirect.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ExternalRedirect;
