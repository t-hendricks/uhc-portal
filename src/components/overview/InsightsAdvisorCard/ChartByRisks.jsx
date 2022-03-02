import React from 'react';
import PropTypes from 'prop-types';
import { Title, Flex, FlexItem } from '@patternfly/react-core';

import InfoPopover from './InfoPopover';
import { getSeverityName } from '../overviewHelpers';

function ChartByRisks({ riskHits }) {
  return (
    <Flex className="ocm-insights--risk-chart" direction={{ default: 'column' }}>
      <FlexItem spacer={{ default: 'spacerLg' }}>
        <Title className="ocm-insights--risk-chart__title" size="lg" headingLevel="h2">
          Advisor recommendations by severity
        </Title>
        <InfoPopover />
      </FlexItem>
      <FlexItem className="ocm-insights--risk-chart__items" spacer={{ default: 'spacerLg' }}>
        <Flex
          justifyContent={{ default: 'justifyContentFlexStart' }}
          fullWidth={{ default: '50%' }}
          spaceItems={{
            sm: 'spaceItemsXl', md: 'spaceItemsLg', lg: 'spaceItems2xl', '2xl': 'spaceItems4xl',
          }}
        >
          {Object.entries({
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            ...riskHits,
          }).reverse().map(([riskNumber, count]) => (
            <FlexItem className="ocm-insights--items__risk-item" key={riskNumber}>
              <Flex
                direction={{ default: 'column' }}
                alignItems={{ default: 'alignItemsCenter' }}
                spaceItems={{ default: 'spaceItemsNone' }}
              >
                <FlexItem className="ocm-insights--risk-item__count">
                  <Title size="2xl" headingLevel="h1">
                    {
                      // TODO: Remove APP_BETA flag when OCP Advisor is in non-beta
                      APP_BETA
                        ? (
                          <a
                            href={`${window.location.origin}/${APP_BETA ? 'beta/' : ''}openshift/insights/advisor/recommendations?total_risk=${riskNumber}`}
                          >
                            {count}
                          </a>
                        )
                        : count
                    }
                  </Title>
                </FlexItem>
                <FlexItem className="ocm-insights--risk-item__label">
                  {getSeverityName(riskNumber)}
                </FlexItem>
              </Flex>
            </FlexItem>
          ))}
        </Flex>
      </FlexItem>
    </Flex>
  );
}

export default ChartByRisks;

ChartByRisks.propTypes = {
  riskHits: PropTypes.object.isRequired,
};
