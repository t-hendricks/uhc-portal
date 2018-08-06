import React, { Component } from 'react';
import { DonutChart, UtilizationCard, UtilizationCardDetails, UtilizationCardDetailsCount, UtilizationCardDetailsDesc,
         UtilizationCardDetailsLine1, UtilizationCardDetailsLine2 } from 'patternfly-react'

import PropTypes from 'prop-types'
import { CardBody, CardTitle } from 'patternfly-react/dist/js/components/Cards';

export class ClusterUtilizationCard extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        used: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
        donut_id: PropTypes.string.isRequired,
      }
    
    render() {
        const {title, used, total, unit, donut_id} = this.props
        const available = total - used;
        const usedColumnTitle = this.props.unit + ' used';
        const availableColumnTitle = this.props.unit + ' available';
        return (
            <UtilizationCard>
                <CardTitle>
                    {title}
                </CardTitle>
                <CardBody>
                  <UtilizationCardDetails>
                      <UtilizationCardDetailsCount>
                        {available}
                      </UtilizationCardDetailsCount>
                      <UtilizationCardDetailsDesc>
                        <UtilizationCardDetailsLine1>
                          Available
                        </UtilizationCardDetailsLine1>
                        <UtilizationCardDetailsLine2>
                          of {total}
                        </UtilizationCardDetailsLine2>
                      </UtilizationCardDetailsDesc>
                  </UtilizationCardDetails>
                  <DonutChart id={donut_id} size={{width: 210,height: 210}}
                              data={{columns: [[usedColumnTitle, this.props.used],[availableColumnTitle, available]],
                                     groups: [[usedColumnTitle, availableColumnTitle]],
                                     order: null,
                                    }}
                              title={{type: 'max'}} />
                </CardBody>
            </UtilizationCard>);
      }
}

export default ClusterUtilizationCard