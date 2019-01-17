import React from 'react';
import PropTypes from 'prop-types';
import { Modal as PfModal, Button, Icon } from 'patternfly-react';
import { noop } from '../../../common/helpers';

function ModalHeader(props) {
  const { title, onClose } = props;

  return (
    <React.Fragment>
      <Button type="button" className="close" aria-hidden="true" aria-label="Close" onClick={onClose}>
        <Icon type="pf" name="close" />
      </Button>
      <PfModal.Title>
        {title}
      </PfModal.Title>
    </React.Fragment>);
}

ModalHeader.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
};

ModalHeader.defaultProps = {
  title: '',
  onClose: noop,
};

export default ModalHeader;
