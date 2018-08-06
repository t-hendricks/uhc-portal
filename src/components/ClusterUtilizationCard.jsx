import React from 'react';
import {
  DonutChart, UtilizationCard, UtilizationCardDetails,
  UtilizationCardDetailsCount, UtilizationCardDetailsDesc,
  UtilizationCardDetailsLine1, UtilizationCardDetailsLine2,
} from 'patternfly-react';

import PropTypes from 'prop-types';
import { CardBody, CardTitle } from 'patternfly-react/dist/js/components/Cards';

function ClusterUtilizationCard(props) {
  const {
    title, used, total, unit, donutId,
  } = props;
  const available = total - used;
  const usedColumnTitle = `${unit} used`;
  const availableColumnTitle = `${unit} available`;
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
                          of
              {' '}
              {total}
            </UtilizationCardDetailsLine2>
          </UtilizationCardDetailsDesc>
        </UtilizationCardDetails>
        <DonutChart
          id={donutId}
          size={{ width: 210, height: 210 }}
          data={{
            columns: [[usedColumnTitle, used], [availableColumnTitle, available]],
            groups: [[usedColumnTitle, availableColumnTitle]],
            order: null,
          }}
          title={{ type: 'max' }}
        />
      </CardBody>
    </UtilizationCard>);
}

ClusterUtilizationCard.propTypes = {
  title: PropTypes.string.isRequired,
  used: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  donutId: PropTypes.string.isRequired,
};

export default ClusterUtilizationCard;
