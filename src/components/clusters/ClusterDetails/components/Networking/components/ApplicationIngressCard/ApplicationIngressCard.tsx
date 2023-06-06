import { Card, CardBody, CardTitle, FormGroup, Switch, Title } from '@patternfly/react-core';
import * as React from 'react';
import { clusterService } from '~/services';
import { useSelector } from 'react-redux';
import { GlobalState } from '~/redux/store';
import NetworkingSelector from '../../NetworkingSelector';

const ApplicationIngressCard = () => {
  const cluster: any = useSelector<GlobalState>((state) => state.clusters.details);
  const ingresses: any = useSelector<GlobalState>(NetworkingSelector);

  const enableNLB = async (checked: boolean) => {
    await clusterService.editIngress(cluster.id, ingresses.additional.routerID, {
      id: ingresses.additional.routerID,
      // @ts-ignore
      load_balancer: checked ? 'nlb' : 'classic',
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
              label="NLB"
              labelOff="Classic"
              isChecked={ingresses.additional.loadBalancer === 'nlb'}
              onChange={enableNLB}
            />
          </FormGroup>
        </CardBody>
      </Card>
    )
  );
};

export default ApplicationIngressCard;
