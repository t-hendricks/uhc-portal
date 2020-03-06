import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
  Stack,
  StackItem,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';
import RuleFeedback from './RuleFeedback';
import './OCMReportDetails.css';
import ReactMarkdown from 'react-markdown';


const totalRiskMeta = [
  {
    label: 'low',
    description: 'low severity desc for total risk',
    iconComponent: Battery,
  },
  {
    label: 'moderate',
    description: 'moderate severity desc for total risk',
    iconComponent: Battery,
  },
  {
    label: 'important',
    description: 'important severity desc for total risk',
    iconComponent: Battery,
  },
  {
    label: 'critical',
    description: 'critical severity desc for total risk',
    iconComponent: Battery,
  },
];

const riskOfChangeMeta = [
  {
    label: 'low',
    description: 'low severity desc for risk of change',
    iconComponent: Battery,
  },
  {
    label: 'moderate',
    description: 'moderate severity desc for risk of change',
    iconComponent: Battery,
  },
  {
    label: 'important',
    description: 'important severity desc for risk of change',
    iconComponent: Battery,
  },
  {
    label: 'critical',
    description: 'critical severity desc for risk of change',
    iconComponent: Battery,
  },
];

const OCMReportDetails = ({
  details,
  ruleID,
  totalRisk,
  riskOfChange,
}) => {
  const LinkInDetails = ({ children, href }) => (
    <a href={href}>
      {children}
      <ExternalLinkAltIcon className="OCMReportDetailsExternalLinkIcon"/>
    </a>
  );

  return (
    <Grid gutter="md" className="OCMReportDetails">

      <GridItem span={7}>
        <Stack gutter="md">
          <StackItem>
            <div>
              <ReactMarkdown
                source={details}
                renderers={{
                  link: LinkInDetails,
                }}
              />
            </div>
          </StackItem>
          <StackItem>
            <RuleFeedback ruleID={ruleID}/>
          </StackItem>
        </Stack>
      </GridItem>

      <GridItem span={3}>
        <Stack gutter="md">
          <StackItem>
            <Stack>
              <StackItem>
                <Title className="riskTitle" size="md">Total risk</Title>
              </StackItem>
              <StackItem>
                <RiskDescription riskValue={totalRisk} riskMeta={totalRiskMeta}/>
              </StackItem>
            </Stack>
          </StackItem>
          <StackItem>
            <Stack>
              <StackItem>
                <Title className="riskTitle" size="md">Risk of change</Title>
              </StackItem>
              <StackItem>
                <RiskDescription riskValue={riskOfChange} riskMeta={riskOfChangeMeta}/>
              </StackItem>
            </Stack>
          </StackItem>
        </Stack>
      </GridItem>

    </Grid>
  );
};

OCMReportDetails.propTypes = {
  details: PropTypes.string,
  ruleID: PropTypes.number,
  totalRisk: PropTypes.number,
  riskOfChange: PropTypes.number,
};

const RiskDescription = ({ riskValue, riskMeta }) => {
  // riskValue ranges from 1 to ∞
  const risk = riskMeta[riskValue - 1];

  return (
    <div>
      <div>
        <risk.iconComponent label={risk.label} severity={riskValue}/>
      </div>
      <Text component={TextVariants.small}>
        {risk.description}
      </Text>
    </div>
  );
};

RiskDescription.propTypes = {
  riskValue: PropTypes.number,
  riskMeta: PropTypes.array,
};

export default OCMReportDetails;
