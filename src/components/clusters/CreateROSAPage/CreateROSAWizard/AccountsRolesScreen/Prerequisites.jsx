import React from 'react';
import PropTypes from 'prop-types';
import {
  ExpandableSection, GridItem, Text, TextContent, TextVariants,
} from '@patternfly/react-core';
import ExternalLink from '../../../../common/ExternalLink';
import './AccountsRolesScreen.scss';

class Prerequisites extends React.Component {
  state = { isExpanded: false };

  componentDidMount() {
    const { initiallyExpanded } = this.props;
    this.setState({ isExpanded: initiallyExpanded });
  }

  componentDidUpdate(prevProps) {
    const { initiallyExpanded } = this.props;
    const prevInitiallyExpanded = prevProps.initiallyExpanded;
    if (initiallyExpanded !== prevInitiallyExpanded) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isExpanded: initiallyExpanded });
    }
  }

  onToggle = () => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  };

  render() {
    const { isExpanded } = this.state;
    return (
      <GridItem span={12}>
        <ExpandableSection className="prerequisites-expandable-section" isExpanded={isExpanded} onToggle={this.onToggle} toggleText="Prerequisites">
          <div className="prerequisites-section">
            <TextContent>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Before you continue, please make sure:
              </Text>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                You have completed the
                {' '}
                <ExternalLink noIcon href="">
                  AWS prerequisites for ROSA with STS.
                </ExternalLink>
                .
              </Text>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                You have available
                {' '}
                <ExternalLink noIcon href="">
                  AWS service quotas.
                </ExternalLink>
              </Text>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                You have
                {' '}
                <ExternalLink noIcon href="">
                  enabled the ROSA service in the AWS Console.
                </ExternalLink>
              </Text>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                You have installed and configured the latest
                {' '}
                <ExternalLink noIcon href="">
                  AWS
                </ExternalLink>
                ,
                <ExternalLink noIcon href="">
                  ROSA
                </ExternalLink>
                , and
                {' '}
                <ExternalLink noIcon href="">
                  oc
                </ExternalLink>
                {' '}
                CLIs on your installation workstation.
              </Text>
            </TextContent>
          </div>
        </ExpandableSection>
      </GridItem>
    );
  }
}

Prerequisites.propTypes = {
  initiallyExpanded: PropTypes.bool,
};

export default Prerequisites;
