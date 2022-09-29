import React from 'react';
import { Field } from 'redux-form';
import { GridItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import IDPBasicFields from './IDPBasicFields';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { required } from '../../../../../../../common/validators';

import CAUpload from '../CAUpload';

function GitlabFormRequired({ isPending, isEditForm, idpEdited }) {
  return (
    <>
      <IDPBasicFields />

      <GridItem span={8}>
        <Field
          component={ReduxVerticalFormGroup}
          name="gitlab_url"
          label="URL"
          type="text"
          validate={required}
          isRequired
          disabled={isPending}
          helpText="The URL of your GitLab provider.This would be https://gitlab.com/ if you do not have hosted GitLab."
        />
      </GridItem>

      <GridItem span={8}>
        <Field
          component={CAUpload}
          name="gitlab_ca"
          label="CA file"
          type="text"
          disabled={isPending}
          helpText="PEM encoded certificate bundle to use to validate server certificates for the configured Gitlab URL."
          certValue={isEditForm ? idpEdited.gitlab.ca : ''}
        />
      </GridItem>
    </>
  );
}

GitlabFormRequired.propTypes = {
  isPending: PropTypes.bool,
  isEditForm: PropTypes.bool,
  idpEdited: PropTypes.object,
};

GitlabFormRequired.defaultProps = {
  isPending: false,
};

export default GitlabFormRequired;
