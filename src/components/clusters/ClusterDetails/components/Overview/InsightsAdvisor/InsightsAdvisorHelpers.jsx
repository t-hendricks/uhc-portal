import React from 'react';
import { PropTypes } from 'prop-types';
import { AngleDoubleDownIcon, AngleDoubleUpIcon, EqualsIcon } from '@patternfly/react-icons';
import { global_palette_blue_50 as blue50 } from '@patternfly/react-tokens/dist/js/global_palette_blue_50';
import { global_palette_blue_300 as blue300 } from '@patternfly/react-tokens/dist/js/global_palette_blue_300';
import { global_palette_gold_400 as gold400 } from '@patternfly/react-tokens/dist/js/global_palette_gold_400';
import { global_palette_orange_300 as orange300 } from '@patternfly/react-tokens/dist/js/global_palette_orange_300';
import { global_palette_red_200 as red200 } from '@patternfly/react-tokens/dist/js/global_palette_red_200';
import { ChartLabel } from '@patternfly/react-charts';

import CriticalIcon from './CriticalIcon';

const riskLabels = {
  1: 'Low',
  2: 'Moderate',
  3: 'Important',
  4: 'Critical',
};

const riskIcons = {
  1: AngleDoubleDownIcon,
  2: EqualsIcon,
  3: AngleDoubleUpIcon,
  4: CriticalIcon,
};

const legendColorScale = {
  1: blue300.value,
  2: gold400.value,
  3: orange300.value,
  4: red200.value,
};

const chartColorScale = [red200.value, orange300.value, gold400.value, blue50.value];

const InsightsTitleComponent = ({ style, ...props }) => (
  <ChartLabel {...props} style={{ ...style, fontSize: 30, fontWeight: 'bold' }} />
);

const InsightsLabelComponent = ({ style, ...props }) => {
  const { datum, externalId } = props;
  const link = `${window.location.origin}/${
    APP_BETA ? 'beta/' : ''
  }openshift/insights/advisor/clusters/${externalId}?total_risk=${datum.id}`;

  return (
    <a href={link}>
      <ChartLabel
        {...props}
        style={{ ...style, fontSize: 15 }}
        className={
          externalId && datum.value > 0
            ? 'ocm-c-overview-advisor--enabled-link'
            : 'ocm-c-overview-advisor--disabled-link'
        }
      />
    </a>
  );
};

const InsightsLegendIconComponent = ({ x, y, datum }) => {
  const Icon = riskIcons[datum.id];

  return <Icon x={x - 5} y={y - 7} fill={legendColorScale[datum.id]} />;
};

const InsightsSubtitleComponent = ({ externalId, style, ...props }) => {
  const link = `${window.location.origin}/${
    APP_BETA ? 'beta/' : ''
  }openshift/insights/advisor/clusters/${externalId}`;

  return (
    <a href={link}>
      <ChartLabel
        {...props}
        style={{ ...style, fontSize: 15 }}
        dy={5}
        className="ocm-c-overview-advisor--enabled-link"
      />
    </a>
  );
};

InsightsSubtitleComponent.propTypes = {
  externalId: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
};

InsightsLabelComponent.propTypes = {
  datum: PropTypes.shape({ value: PropTypes.number, id: PropTypes.string }).isRequired,
  externalId: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
};

InsightsTitleComponent.propTypes = {
  style: PropTypes.object.isRequired,
};

InsightsLegendIconComponent.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  datum: PropTypes.shape({ id: PropTypes.string }),
};

export {
  riskLabels,
  riskIcons,
  legendColorScale,
  chartColorScale,
  InsightsLegendIconComponent,
  InsightsTitleComponent,
  InsightsLabelComponent,
  InsightsSubtitleComponent,
};
