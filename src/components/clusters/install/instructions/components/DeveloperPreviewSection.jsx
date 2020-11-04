import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CodeIcon } from '@patternfly/react-icons';
import './DeveloperPreviewSection.scss';

const DeveloperPreviewSection = ({ isDevPreview = false }) => (
  <>
    <span className="pf-c-label pf-m-compact dev-preview-label">
      <CodeIcon />
      {' '}
      Developer Preview
    </span>
    {' '}
    <Link to="/install/pre-release">
      { isDevPreview ? 'About' : 'Download'}
      { ' ' }
      pre-release builds
    </Link>
  </>
);

DeveloperPreviewSection.propTypes = {
  isDevPreview: PropTypes.bool,
};

export default DeveloperPreviewSection;
