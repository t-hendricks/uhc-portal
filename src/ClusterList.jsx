/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Component } from 'react';
import classNames from 'classnames';
import {
  ListView, Button, Row, Col,
} from 'patternfly-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const renderAdditionalInfoItems = (itemProperties, state) => {
  const generateStateInfoItem = (clusterState) => {
    let text;
    let icon;
    switch (clusterState) {
      case 'Installing':
        [text, icon] = ['Installing...', 'warning-triangle-o'];
        break;
      case 'Error':
        [text, icon] = ['Error', 'error-circle-o'];
        break;
      default:
        [text, icon] = ['Ready', 'ok'];
    }
    return (
      <ListView.InfoItem key="clusterState">
        <ListView.Icon name={icon} type="pf" />
        <span>
          {text}
        </span>
      </ListView.InfoItem>
    );
  };

  const infoItems = [generateStateInfoItem(state)];

  return infoItems.concat(Object.keys(itemProperties).map((prop) => {
    const cssClassNames = classNames('pficon', {
      'pficon-flavor': prop === 'hosts',
      'pficon-cluster': prop === 'clusters',
      'pficon-container-node': prop === 'nodes',
      'pficon-image': prop === 'images',
    });
    return (
      <ListView.InfoItem key={prop}>
        <span className={cssClassNames} />
        <strong>
          {itemProperties[prop]}
        </strong>
        {' '}
        {prop}
      </ListView.InfoItem>
    );
  }));
};

class ClusterList extends Component {
  static propTypes = {
    clusters: PropTypes.array.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.clusters.length !== 0);
  }

  render() {
    const maintenanceIcon = <ListView.Icon name="maintenance" type="pf" className="maintenance" />;
    const clusterIcon = <ListView.Icon name="cluster" type="pf" />;
    return (
      <div>
        <ListView>
          {this.props.clusters.map(({
            properties, clusterID, title, description, state,
          }) => (
            <ListView.Item
              key={`cluster${clusterID}`}
              actions={(
                <Link to={`/cluster/${clusterID}`}>
                  <Button>
                        Details
                  </Button>
                </Link>
                  )}
              checkboxInput={<input type="checkbox" />}
              leftContent={state === 'Installing' ? maintenanceIcon : clusterIcon}
              additionalInfo={renderAdditionalInfoItems(properties, state)}
              heading={title}
              description={description}
              stacked={false}
              hideCloseIcon={false}
            />
          ))}
        </ListView>
      </div>
    );
  }
}

export { ClusterList };
