import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect, FormSelectOption,
} from '@patternfly/react-core';

class KMSKeyLocationComboBox extends React.Component {
  componentDidMount() {
    const { selectedRegion, input } = this.props;
    input.onChange(selectedRegion);
  }

  componentDidUpdate(prevProps) {
    const { selectedRegion, input } = this.props;
    if (prevProps.selectedRegion !== selectedRegion) {
      input.onChange(selectedRegion);
    }
  }

  render() {
    const { kmsRegionsArray, input } = this.props;
    return (
      <FormSelect
        aria-label="KMS location"
        {...input}
      >
        {kmsRegionsArray.map(location => (
          <FormSelectOption
            key={location}
            value={location}
            label={location}
          />
        ))}
      </FormSelect>
    );
  }
}
KMSKeyLocationComboBox.propTypes = {
  input: PropTypes.object.isRequired,
  kmsRegionsArray: PropTypes.array,
  selectedRegion: PropTypes.string,
};

export default KMSKeyLocationComboBox;
