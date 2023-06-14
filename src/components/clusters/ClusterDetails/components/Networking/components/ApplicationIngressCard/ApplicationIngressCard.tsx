import * as React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, CardTitle, FormGroup, Switch, Title } from '@patternfly/react-core';
import { clusterService } from '~/services';
import { GlobalState } from '~/redux/store';
import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1';
import NetworkingSelector from '../../NetworkingSelector';
import { LoadBalancerFlavorLabel } from '../constants';

const ApplicationIngressCard = () => {
  const cluster: any = useSelector<GlobalState>((state) => state.clusters.details);
  const ingresses: any = useSelector<GlobalState>(NetworkingSelector);

  const enableNLB = async (checked: boolean) => {
    await clusterService.editIngress(cluster.id, ingresses.additional.routerID, {
      id: ingresses.additional.routerID,
      load_balancer_type: checked ? LoadBalancerFlavor.NLB : LoadBalancerFlavor.CLASSIC,
    });
  };

  return (
    !!ingresses?.additional && (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" className="card-title">
            Application ingress
          </Title>
        </CardTitle>
        <CardBody>
          <FormGroup fieldId="load_balancer" label="Load balancer type" isStack>
            <Switch
              label={LoadBalancerFlavorLabel[LoadBalancerFlavor.NLB]}
              labelOff={LoadBalancerFlavorLabel[LoadBalancerFlavor.CLASSIC]}
              isChecked={ingresses.additional.loadBalancer === LoadBalancerFlavor.NLB}
              onChange={enableNLB}
            />
          </FormGroup>
        </CardBody>
      </Card>
    )
  );
};

export default ApplicationIngressCard;
