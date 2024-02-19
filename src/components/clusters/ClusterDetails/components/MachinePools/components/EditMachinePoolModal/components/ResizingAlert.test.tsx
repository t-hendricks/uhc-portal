import * as React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { TestRouter, render, screen } from '~/testUtils';
import ResizingAlert from './ResizingAlert';
import { masterResizeThresholds } from './utils';

describe('<ResizingAlert />', () => {
  it('Does not show alert for no threshold', () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <ResizingAlert
            autoscalingEnabled={false}
            cluster={{}}
            machinePools={[
              {
                id: 'foo',
                replicas: 1,
              },
            ]}
            replicasValue={2}
            autoScaleMaxNodesValue={0}
            selectedMachinePoolID="foo"
          />
        </CompatRouter>
      </TestRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });
  it('Shows alert with medium threshold', () => {
    render(
      <TestRouter>
        <CompatRouter>
          <ResizingAlert
            autoscalingEnabled={false}
            cluster={{}}
            machinePools={[
              {
                id: 'foo',
                replicas: 1,
              },
            ]}
            replicasValue={30}
            autoScaleMaxNodesValue={0}
            selectedMachinePoolID="foo"
          />
        </CompatRouter>
      </TestRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: new RegExp(`${masterResizeThresholds.medium} nodes`, 'i'),
      }),
    ).toBeInTheDocument();
  });

  it('Shows alert with high threshold', () => {
    render(
      <TestRouter>
        <CompatRouter>
          <ResizingAlert
            autoscalingEnabled={false}
            cluster={{}}
            machinePools={[
              {
                id: 'foo',
                replicas: 1,
              },
            ]}
            replicasValue={150}
            autoScaleMaxNodesValue={0}
            selectedMachinePoolID="foo"
          />
        </CompatRouter>
      </TestRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: new RegExp(`${masterResizeThresholds.large} nodes`, 'i'),
      }),
    ).toBeInTheDocument();
  });
});
