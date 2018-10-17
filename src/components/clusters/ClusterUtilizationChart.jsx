import React from 'react';
import {
  DonutChart,
} from 'patternfly-react';

import PropTypes from 'prop-types';

function ClusterUtilizationChart(props) {
  const {
    title, used, total, unit, donutId,
  } = props;
  let fakeTotal = total;
  if (total === 0) {
    fakeTotal = 1;
  }
  const available = fakeTotal - used;
  const usedColumnTitle = `${unit} used`;
  const availableColumnTitle = `${unit} available`;
  return (
    <div>
      <h4 className="center">
        {title}
      </h4>
      <div className="center">
        <DonutChart
          id={donutId}
          size={{ width: 180, height: 180 }}
          data={{
            columns: [[usedColumnTitle, used], [availableColumnTitle, available]],
            groups: [[usedColumnTitle, availableColumnTitle]],
            order: null,
          }}
          title={{ type: 'max' }}
        />
      </div>
    </div>);
}

ClusterUtilizationChart.propTypes = {
  title: PropTypes.string.isRequired,
  used: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  donutId: PropTypes.string.isRequired,
};

export default ClusterUtilizationChart;
