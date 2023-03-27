import React from 'react';
import { FormGroup, GridItem, NumberInput, Alert } from '@patternfly/react-core';
import { Field } from 'redux-form';

import './CostSavings.scss';
import PropTypes from 'prop-types';
import ReduxCheckbox from '../../../../../../common/ReduxFormComponents/ReduxCheckbox';
import RadioButtons from '../../../../../../common/ReduxFormComponents/RadioButtons';
import ExternalLink from '../../../../../../common/ExternalLink';
import PopoverHint from '../../../../../../common/PopoverHint';
import links from '../../../../../../../common/installLinks.mjs';

class CostSavingsSection extends React.Component {
  state = {};

  onMaxHourlyPriceChange = (currentPrice, delta) =>
    Number((parseFloat(currentPrice) + delta).toFixed(2));

  render() {
    const { change, useSpotInstances, spotInstancePricing, spotInstanceMaxHourlyPrice } =
      this.props;
    return (
      <>
        <GridItem id="costsavings" md={12}>
          <FormGroup fieldId="costsavings" label="Cost saving" />
          <Field
            component={ReduxCheckbox}
            name="spot_instances"
            label="Use Amazon EC2 Spot Instances"
            description="You can save on costs by creating a machine pool running on AWS that deploys machines as
            non-guaranteed Spot Instances.  This cannot be changed after machine pool is created."
          />
        </GridItem>

        {useSpotInstances && (
          <>
            <GridItem>
              <Field
                component={RadioButtons}
                className="ocm-c-cost-savings-price-radios"
                name="spot_instance_pricing"
                options={[
                  {
                    value: 'onDemand',
                    label: 'Use On-Demand instance price',
                    description: (
                      <>The maximum price defaults to charge up to the On-Demand Instance price.</>
                    ),
                  },
                  {
                    value: 'maximum',
                    label: (
                      <>
                        Set maximum price{' '}
                        <PopoverHint
                          headerContent="Maximum hourly price for a Spot Instance"
                          hint="This value should be lower or equal to the On-Demand Instance price. This cannot be changed after the machine pool is created."
                        />
                      </>
                    ),
                    description: <>Specify the maximum hourly price for a Spot Instance.</>,
                    extraField: spotInstancePricing === 'maximum' && (
                      <Field
                        component={NumberInput}
                        className="ocm-c-cost-savings-max-price__number_input"
                        name="spot_instance_max_hourly_price"
                        inputName="spot_instance_max_hourly_price"
                        id="spot_instance_max_hourly_price"
                        props={{
                          value: parseFloat(spotInstanceMaxHourlyPrice).toFixed(2),
                          id: 'spot_instance_max_hourly_price',
                          min: 0.01,
                          onMinus: () => {
                            change(
                              'spot_instance_max_hourly_price',
                              this.onMaxHourlyPriceChange(spotInstanceMaxHourlyPrice, -0.01),
                            );
                          },
                          onPlus: () => {
                            change(
                              'spot_instance_max_hourly_price',
                              this.onMaxHourlyPriceChange(spotInstanceMaxHourlyPrice, 0.01),
                            );
                          },
                          onChange: (e) => {
                            const newHourlyMaxPriceNum = parseFloat(e.target.value);
                            change(
                              'spot_instance_max_hourly_price',
                              this.onMaxHourlyPriceChange(newHourlyMaxPriceNum, 0),
                            );
                          },
                          widthChars: '8',
                          unit: '$ Hourly',
                          isDisabled: false,
                        }}
                      />
                    ),
                  },
                ]}
                defaultValue="onDemand"
              />
            </GridItem>
            <GridItem lg={6} />
            <GridItem>
              <Alert
                className="bottom-alert"
                variant="warning"
                title="Your Spot Instance may be interrupted at any time. Use Spot Instances for workloads that can tolerate interruptions."
                isInline
              >
                <ExternalLink href={links.AWS_SPOT_INSTANCES}>
                  Learn more about Spot instances
                </ExternalLink>
              </Alert>
            </GridItem>
          </>
        )}
      </>
    );
  }
}

CostSavingsSection.propTypes = {
  change: PropTypes.func.isRequired,
  useSpotInstances: PropTypes.bool,
  spotInstancePricing: PropTypes.string,
  spotInstanceMaxHourlyPrice: PropTypes.number,
};

CostSavingsSection.defaultProps = {
  useSpotInstances: false,
  spotInstancePricing: 'onDemand',
  spotInstanceMaxHourlyPrice: 0.01,
};

export default CostSavingsSection;
