import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Label,
  Split,
  SplitItem,
  Button,
} from '@patternfly/react-core';
import { StarIcon } from '@patternfly/react-icons';
import { versionRegEx } from '../../../../../../common/versionComparator';
import ExternalLink from '../../../../../common/ExternalLink';

const getReleaseNotesLink = (version) => {
  const { groups: parts } = versionRegEx.exec(version);
  const {
    major, minor, revision, patch,
  } = parts;
  if (major !== '4' || patch !== undefined) {
    return null;
  }
  const docURL = `https://docs.openshift.com/container-platform/${major}.${minor}/release_notes/ocp-${major}-${minor}-release-notes.html#ocp-${major}-${minor}-${revision}`;
  return (
    <Button variant="link" className="card-footer-button">
      <ExternalLink href={docURL}>
        View release notes
      </ExternalLink>
    </Button>
  );
};

const VersionCard = (props) => {
  const {
    isSelected,
    isRecommended,
    version,
    onKeyDown,
    onClick,
    children,
  } = props;
  return (
    <Card
      className="version-card"
      id={version}
      onKeyDown={onKeyDown}
      onClick={onClick}
      isSelectable
      isCompact
      isSelected={isSelected}
    >
      <CardTitle>
        <Split>
          <SplitItem>
            {version}
          </SplitItem>
          <SplitItem isFilled />
          {isRecommended && (
          <SplitItem>
            <Label color="blue" icon={<StarIcon />}>
              Recommended
            </Label>
          </SplitItem>
          )}
        </Split>
      </CardTitle>
      {children && (
      <CardBody>
        {children}
      </CardBody>
      )}
      <CardFooter>
        {getReleaseNotesLink(version)}
      </CardFooter>
    </Card>
  );
};

VersionCard.propTypes = {
  isSelected: PropTypes.bool,
  isRecommended: PropTypes.bool,
  version: PropTypes.string.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
};

VersionCard.defaultProps = {
  isRecommended: false,
};

export default VersionCard;
