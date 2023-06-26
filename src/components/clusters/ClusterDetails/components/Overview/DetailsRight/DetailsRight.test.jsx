import React from 'react';
import DetailsRight from './DetailsRight';
import fixtures from '../../../__test__/ClusterDetails.fixtures';
import { subscriptionStatuses } from '~/common/subscriptionTypes';
import { screen, render, within, axe } from '~/testUtils';

const defaultProps = {
  cluster: fixtures.clusterDetails.cluster,
  cloudProviders: fixtures.cloudProviders,
};

const componentText = {
  STATUS: { label: 'Status', limitedSupport: '- Limited support' },
  STATUS_ERROR: { label: 'Details:' },
  VCPU: { label: 'Total vCPU', unit: 'vCPU' },
  TOTAL_MEMORY: { label: 'Total memory' },
  AWS_INFRA_ACCOUNT: { label: 'Infrastructure AWS account' },
  AWS_BILLING_ACCOUNT: { label: 'Billing marketplace account' },
  LOAD_BALANCERS: { label: 'Load balancers', NA: 'N/A' },
  PERSISTENT_STORAGE: { label: 'Persistent storage', NA: 'N/A' },
  NODES: {
    label: 'Nodes',
    CONTROL: 'Control plane:',
    INFRA: 'Infra:',
    COMPUTE: 'Compute:',
    NA: 'N/A',
  },
  CREATED_AT: { label: 'Created at', NA: 'N/A' },
  OWNER: { label: 'Owner', NA: 'N/A' },
  AUTOSCALE: { label: 'Autoscale', ENABLED: 'Enabled', MIN: 'Min:', MAX: 'Max:' },
  OIDC: {
    label: 'OIDC Configuration',
    TYPE: 'Type:',
    MANAGED: 'Red Hat managed',
    SELF: 'Self-managed',
    ID: 'ID:',
  },
};

const checkForValue = (label, value, testId) => {
  // NOTE testID is used when there isn't an ARIA role to isolate parent container
  const container = testId ? within(screen.getByTestId(testId)) : screen;
  expect(container.getByText(label)).toBeInTheDocument();
  if (value) {
    expect(container.getByText(value)).toBeInTheDocument();

    // Verify that the value is below the label
    // Cannot use roles of "term" and "definition" because there are children elements
    const labelObj = container.getByText(label);
    expect(labelObj.closest('div').querySelector('dd')).toHaveTextContent(value);
  }
};

const checkForValueAbsence = (label, value, testId) => {
  // NOTE testID is used when there isn't an ARIA role to isolate parent container
  const container = testId ? within(screen.getByTestId(testId)) : screen;
  expect(container.queryByText(label)).not.toBeInTheDocument();
  if (value) {
    expect(container.queryByText(value)).not.toBeInTheDocument();
  }
};

global.insights = {
  chrome: {
    on: () => () => {},
    auth: {
      getUser: () => Promise.resolve({ data: {} }),
      getToken: () => Promise.resolve(),
    },
  },
};

describe('<DetailsRight />', () => {
  it('is accessible on initial render', async () => {
    // Arrange
    const newProps = { ...defaultProps };
    const { container } = render(<DetailsRight {...newProps} />);

    // Assert
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('status', () => {
    it('shows ai cluster status if ai subscription without metrics', () => {
      // Arrange
      const AIClusterFixture = {
        ...fixtures.AIClusterDetails.cluster,
        subscription: { ...fixtures.AIClusterDetails.cluster.subscription, metrics: [] },
      };
      const newProps = { ...defaultProps, cluster: AIClusterFixture };
      render(<DetailsRight {...newProps} />);

      // Assert
      // NOTE there isn't an ARIA role to isolate parent container
      expect(screen.getByTestId('aiSubscriptionWithoutMetric')).toBeInTheDocument();
    });

    it('does not show ai cluster status if  ai subscription with metrics', () => {
      // Arrange
      const AIClusterFixture = fixtures.AIClusterDetails.cluster;
      expect(AIClusterFixture.subscription.metrics.length).toBeGreaterThan(0);

      const newProps = { ...defaultProps, cluster: AIClusterFixture };
      render(<DetailsRight {...newProps} />);

      // Assert
      // NOTE there isn't an ARIA role to isolate parent container
      expect(screen.queryByTestId('aiSubscriptionWithoutMetric')).not.toBeInTheDocument();
    });

    it('shows limited support if cluster is in limited support', () => {
      // Arrange
      const newProps = { ...defaultProps, limitedSupport: true };
      render(<DetailsRight {...newProps} />);

      // Assert
      expect(screen.getByText(componentText.STATUS.limitedSupport)).toBeInTheDocument();
    });

    it('hides limited support if cluster is not in limited support', () => {
      // Arrange
      const newProps = { ...defaultProps, limitedSupport: false };
      render(<DetailsRight {...newProps} />);

      // Assert
      expect(screen.queryByText(componentText.STATUS.limitedSupport)).not.toBeInTheDocument();
    });

    it('shows error if cluster has a provision error', () => {
      // Arrange
      const clusterErrorFixture = {
        ...fixtures.clusterDetails.cluster,
        status: {
          ...fixtures.clusterDetails.cluster.status,
          provision_error_code: '1234',
          provision_error_message: 'this is an error',
        },
      };
      const newProps = { ...defaultProps, cluster: clusterErrorFixture };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.STATUS_ERROR.label, '1234 this is an error');
    });

    it('hides error if cluster does not have a provision error', () => {
      // Arrange
      expect(defaultProps.cluster.status.provision_error_code).toBeFalsy();
      render(<DetailsRight {...defaultProps} />);

      // Assert
      checkForValueAbsence(componentText.STATUS_ERROR.label);
    });
  });

  describe('virtual CPU', () => {
    it('shows total VPC if cluster is not disconnected and does not have sockets', () => {
      // Arrange
      expect(defaultProps.cluster.subscription.status).not.toEqual(
        subscriptionStatuses.DISCONNECTED,
      );
      expect(defaultProps.cluster.metrics.sockets.total.value).toBeFalsy();

      const numberOfVCPU = 36;
      expect(defaultProps.cluster.metrics.cpu.total.value).toEqual(numberOfVCPU);

      render(<DetailsRight {...defaultProps} />);

      // Assert
      checkForValue(componentText.VCPU.label, `${numberOfVCPU} ${componentText.VCPU.unit}`);
    });

    it('hides VPC if cluster is disconnected', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;
      expect(clusterFixture.metrics.sockets.total.value).toBeFalsy();

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          subscription: {
            ...clusterFixture.subscription,
            status: subscriptionStatuses.DISCONNECTED,
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValueAbsence(componentText.VCPU.label);
    });

    it('does not show vpc if number of sockets is greater than 0', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;
      expect(clusterFixture.subscription.status).not.toEqual(subscriptionStatuses.DISCONNECTED);

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          metrics: {
            ...clusterFixture.metrics,
            sockets: {
              ...clusterFixture.metrics.sockets,
              total: { value: 100 },
            },
          },
        },
      };
      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValueAbsence(componentText.VCPU.label);
    });
  });

  describe('total memory', () => {
    it('hides total memory  if cluster is disconnected', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          subscription: {
            ...clusterFixture.subscription,
            status: subscriptionStatuses.DISCONNECTED,
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValueAbsence(componentText.TOTAL_MEMORY.label);
    });

    it('shows total memory label if cluster is not disconnected', () => {
      // Arrange
      expect(defaultProps.cluster.subscription.status).not.toEqual(
        subscriptionStatuses.DISCONNECTED,
      );
      const memory = defaultProps.cluster.metrics.memory.total;
      expect(memory.value).toEqual(147469647872);
      expect(memory.unit).toEqual('B');
      render(<DetailsRight {...defaultProps} />);

      // Assert
      checkForValue(componentText.TOTAL_MEMORY.label, '137.34 GiB');
    });
  });

  describe('aws infrastructure account', () => {
    it('shows aws infrastructure account if aws account is known', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          subscription: {
            ...clusterFixture.subscription,
            cloud_account_id: '987654321012',
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.AWS_INFRA_ACCOUNT.label, '987654321012');
    });

    it('hides aws infrastructure account if aws account is not known', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          subscription: {
            ...clusterFixture.subscription,
            cloud_account_id: undefined,
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValueAbsence(componentText.AWS_INFRA_ACCOUNT.label);
    });
  });

  describe('aws billing account', () => {
    it('shows aws billing account if aws account is known', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          subscription: {
            ...clusterFixture.subscription,
            billing_marketplace_account: '1234567890',
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.AWS_BILLING_ACCOUNT.label, '1234567890');
    });

    it('hides aws billing account if aws account is not known', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          subscription: {
            ...clusterFixture.subscription,
            billing_marketplace_account: undefined,
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValueAbsence(componentText.AWS_BILLING_ACCOUNT.label);
    });
  });

  describe('Load balancers and storage', () => {
    it('hides load balancers and storage if cluster is not managed', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          managed: false,
          ccs: { enabled: false },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValueAbsence(componentText.LOAD_BALANCERS.label);
      checkForValueAbsence(componentText.PERSISTENT_STORAGE.label);
    });

    it('hides load balancers and storage if cluster  does has ccs enabled', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          managed: true,
          ccs: { enabled: true },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValueAbsence(componentText.LOAD_BALANCERS.label);
      checkForValueAbsence(componentText.PERSISTENT_STORAGE.label);
    });

    it('shows load balancer quota when known', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          managed: true,
          ccs: { enabled: false },
          load_balancer_quota: '100',
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.LOAD_BALANCERS.label, '100');
      checkForValue(componentText.PERSISTENT_STORAGE.label);
    });

    it('shows load balancer quota as "NA" if it is not known', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          managed: true,
          ccs: { enabled: false },
          load_balancer_quota: undefined,
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.LOAD_BALANCERS.label, componentText.LOAD_BALANCERS.NA);
      checkForValue(componentText.PERSISTENT_STORAGE.label);
    });

    it('shows persistent storage when it is known', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          managed: true,
          ccs: { enabled: false },
          storage_quota: {
            value: 107374182400,
            unit: 'B',
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.LOAD_BALANCERS.label);
      checkForValue(componentText.PERSISTENT_STORAGE.label, '100 GiB');
    });

    it('shows persistent storage quota as "NA" if it is not known', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          managed: true,
          ccs: { enabled: false },
          load_balancer_quota: '100',
          storage_quota: undefined,
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.LOAD_BALANCERS.label);
      checkForValue(componentText.PERSISTENT_STORAGE.label, componentText.PERSISTENT_STORAGE.NA);
    });
  });

  describe('Nodes', () => {
    describe('Is not autoscaled and is managed', () => {
      describe('Control plane', () => {
        it('hides header if hypershift', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: true },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          expect(screen.queryByTestId('controlPlaneNodesCountContainer')).not.toBeInTheDocument();
        });

        it('shows  actual counts if not hypershift and actual nodes  is known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
              nodes: { master: undefined },
              metrics: { ...clusterFixture.metrics, nodes: { master: 12 } },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.CONTROL, '12/-', 'controlPlaneNodesCountContainer');
        });

        it('shows  desired  counts if not hypershift and  desired nodes is known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
              nodes: { master: 34 },
              metrics: { ...clusterFixture.metrics, nodes: { master: undefined } },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.CONTROL, '-/34', 'controlPlaneNodesCountContainer');
        });

        it('shows both desired and actual counts if not hypershift and both are known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
              nodes: { master: 34 },
              metrics: { ...clusterFixture.metrics, nodes: { master: 12 } },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.CONTROL, '12/34', 'controlPlaneNodesCountContainer');
        });

        it('shows "NA" if not hypershift and actual nodes and desired nodes are not known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
              nodes: { master: undefined },
              metrics: { ...clusterFixture.metrics, nodes: { master: undefined } },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(
            componentText.NODES.CONTROL,
            componentText.NODES.NA,
            'controlPlaneNodesCountContainer',
          );
        });
      });

      describe('Infra nodes', () => {
        it('hides  header if hypershift', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: true },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          expect(screen.queryByTestId('InfraNodesCountContainer')).not.toBeInTheDocument();
        });

        it('hides  header if infra nodes is equal to 0', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
              nodes: { infra: 0 },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          expect(screen.queryByTestId('InfraNodesCountContainer')).not.toBeInTheDocument();
        });

        it('shows header if infra nodes is known and larger than 0', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
              nodes: { infra: 111 },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.INFRA, undefined, 'InfraNodesCountContainer');
        });

        it('shows  desired  count  when  header is shown ', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
              nodes: { infra: 111 },
              metrics: { ...clusterFixture.metrics, nodes: { infra: undefined } },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.INFRA, '-/111', 'InfraNodesCountContainer');
        });

        it('shows infra node actual and desired count when infra header is shown and actual infra nodes is known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
              nodes: { infra: 111 },
              metrics: { ...clusterFixture.metrics, nodes: { infra: 222 } },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.INFRA, '222/111', 'InfraNodesCountContainer');
        });
      });

      describe('Compute nodes', () => {
        it('shows number  desired worker nodes if  desired count is known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            totalDesiredComputeNodes: 111,
            totalActualNodes: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.COMPUTE, '-/111');
        });

        it('shows number of actual worker nodes if  actual  count is known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            totalDesiredComputeNodes: undefined,
            totalActualNodes: 222,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.COMPUTE, '222/-');
        });

        it('shows both actual and desired worker nodes if both are known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            totalDesiredComputeNodes: 111,
            totalActualNodes: 222,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.COMPUTE, '222/111');
        });

        it('shows "NA" for worker nodes if both actual and desired count is not known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: false,
            totalDesiredComputeNodes: undefined,
            totalActualNodes: false,
            cluster: {
              ...clusterFixture,
              managed: true,
              hypershift: { enabled: false },
              ccs: { enabled: false },
              load_balancer_quota: '100',
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.COMPUTE, componentText.NODES.NA);
        });
      });
    });

    describe('Is autoscaled OR not managed', () => {
      describe('Control plane', () => {
        it('hides header if hypershift', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: true,
            cluster: {
              ...clusterFixture,
              hypershift: { enabled: true },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          expect(screen.queryByTestId('controlPlaneNodesCountContainer')).not.toBeInTheDocument();
        });

        it('shows count if not hypershift and  count is known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: true,
            cluster: {
              ...clusterFixture,
              hypershift: { enabled: false },
              metrics: { ...clusterFixture.metrics, nodes: { master: 111 } },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.CONTROL, '111', 'controlPlaneNodesCountContainer');
        });

        it('shows "NA" for control plane count if not hypershift and node count is unknown', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: true,
            cluster: {
              ...clusterFixture,
              hypershift: { enabled: false },
              metrics: { ...clusterFixture.metrics, nodes: { master: undefined } },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(
            componentText.NODES.CONTROL,
            componentText.NODES.NA,
            'controlPlaneNodesCountContainer',
          );
        });
      });

      describe('Infra nodes', () => {
        it('hides infra header if hypershift', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: true,
            cluster: {
              ...clusterFixture,
              hypershift: { enabled: true },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          expect(screen.queryByTestId('InfraNodesCountContainer')).not.toBeInTheDocument();
        });

        it('hides  header if infra nodes is equal to 0', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: true,
            cluster: {
              ...clusterFixture,

              hypershift: { enabled: false },
              nodes: { infra: 0 },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          expect(screen.queryByTestId('InfraNodesCountContainer')).not.toBeInTheDocument();
        });

        it('shows header if infra nodes is known and larger than 0', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: true,
            cluster: {
              ...clusterFixture,
              hypershift: { enabled: false },
              nodes: { infra: 111 },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.INFRA, undefined, 'InfraNodesCountContainer');
        });

        it('shows infra node count (via metrics) when infra header is shown and node count is known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: true,
            cluster: {
              ...clusterFixture,
              hypershift: { enabled: false },
              nodes: { infra: 111 },
              metrics: { ...clusterFixture.metrics, nodes: { infra: 222 } },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.INFRA, '222', 'InfraNodesCountContainer');
        });

        it('shows NA when infra header is shown and node count not known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: true,
            cluster: {
              ...clusterFixture,
              hypershift: { enabled: false },
              nodes: { infra: 111 },
              metrics: { ...clusterFixture.metrics, nodes: { infra: undefined } },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(
            componentText.NODES.INFRA,
            componentText.NODES.NA,
            'InfraNodesCountContainer',
          );
        });
      });

      describe('Compute nodes', () => {
        it('shows total compute nodes  if known', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: true,
            totalActualNodes: 123,
            cluster: {
              ...clusterFixture,
              hypershift: { enabled: false },
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.COMPUTE, '123');
        });

        it('shows "NA" for compute count if total account modes is not known ', () => {
          // Arrange
          const clusterFixture = defaultProps.cluster;

          const newProps = {
            ...defaultProps,
            autoscaleEnabled: true,
            totalActualNodes: false,
            cluster: {
              ...clusterFixture,
              hypershift: { enabled: false },
              ccs: { enabled: false },
              load_balancer_quota: '100',
            },
          };

          render(<DetailsRight {...newProps} />);

          // Assert
          checkForValue(componentText.NODES.COMPUTE, componentText.NODES.NA);
        });
      });
    });
  });

  describe('Created by and owner', () => {
    it('hides created at and owner headings if not an aiCluster', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          aiCluster: false,
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValueAbsence(componentText.CREATED_AT.label);
      checkForValueAbsence(componentText.OWNER.label);
    });

    it('shows created at heading if an aiCluster', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          aiCluster: true,
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.CREATED_AT.label);
    });

    it('shows creator name as the owner', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          aiCluster: true,
          subscription: { ...clusterFixture.subscription, creator: { name: 'myName' } },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.OWNER.label, 'myName');
    });

    it('shows creator username if name is not available as owner ', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          aiCluster: true,
          subscription: {
            ...clusterFixture.subscription,
            creator: { name: undefined, username: 'myUserName' },
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.OWNER.label, 'myUserName');
    });

    it('shows "N/A" as the owner if creator name and creator username are not available', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          managed: true,
          ccs: { enabled: false },
          load_balancer_quota: '100',
          aiCluster: true,
          subscription: {
            ...clusterFixture.subscription,
            creator: {},
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.OWNER.label, componentText.OWNER.NA);
    });
  });

  describe('autoscaling', () => {
    it('hides autoscaling header if not autoscale enabled', () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        autoscaleEnabled: false,
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValueAbsence(componentText.AUTOSCALE.label);
    });

    it('shows "enabled", min node count, and max node count if autoscale is enabled', () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        autoscaleEnabled: true,
        totalMinNodesCount: 12121212,
        totalMaxNodesCount: 34343434,
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.AUTOSCALE.label);
      expect(screen.getByText(componentText.AUTOSCALE.ENABLED)).toBeInTheDocument();
      expect(screen.getByText(/12121212/)).toHaveTextContent(
        `${componentText.AUTOSCALE.MIN} 12121212`,
      );
      expect(screen.getByText(/34343434/)).toHaveTextContent(
        `${componentText.AUTOSCALE.MAX} 34343434`,
      );
    });
  });

  describe('OIDC config', () => {
    it('hides "OIDC Configuration" heading if the oidcConfig does not exist', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          aws: {
            sts: { oidc_config: undefined },
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValueAbsence(componentText.OIDC.label);
    });

    it('shows OIDC config id if oidcConfig exists', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          aws: {
            sts: { oidc_config: { id: 'myID' } },
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.OIDC.label);
      checkForValue(componentText.OIDC.ID, 'myID');
    });

    it('shows "Red Hat managed" for type if oidcConfig exists and is managed', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          aws: {
            sts: { oidc_config: { managed: true } },
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.OIDC.label);
      checkForValue(componentText.OIDC.TYPE, componentText.OIDC.MANAGED);
    });

    it('shows "Self-managed" for type if oidcConfig exists and is not managed', () => {
      // Arrange
      const clusterFixture = defaultProps.cluster;

      const newProps = {
        ...defaultProps,
        cluster: {
          ...clusterFixture,
          aws: {
            sts: { oidc_config: { managed: undefined } },
          },
        },
      };

      render(<DetailsRight {...newProps} />);

      // Assert
      checkForValue(componentText.OIDC.label);
      checkForValue(componentText.OIDC.TYPE, componentText.OIDC.SELF);
    });
  });
});
