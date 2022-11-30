import React from 'react';
import { render } from '~/testUtils';
import withFeatureGate from './with-feature-gate';
import { store } from '../../redux/store';

jest.mock('../../redux/store', () => {
  const actualStore = jest.requireActual('../../redux/store');
  return {
    ...actualStore,
    store: {
      ...actualStore.store,
      getState: jest.fn(actualStore.store.getState),
    },
  };
});

const getStateMock = store.getState as jest.Mock;

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  test?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  allEnabledFeatures: any;
};

describe('with-feature-gate', () => {
  const MainComponent = (props: Props) => <div data-testid="main" />;
  const FallbackComponent = (props: Props) => <div data-testid="fallback" />;

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render spinner', async () => {
    const Component = withFeatureGate(MainComponent, 'unknown', FallbackComponent);
    const wrapped = render(<Component />);
    await wrapped.findByText('Loading...');
  });

  it('should render main component', async () => {
    const features = {
      test: true,
    };
    getStateMock.mockReturnValue({
      features,
    });
    const Component = withFeatureGate(MainComponent, 'test', FallbackComponent);
    const wrapped = render(<Component />);
    await wrapped.findByTestId('main');
  });

  it('should render fallback', async () => {
    const features = {
      test: false,
    };
    getStateMock.mockReturnValue({
      features,
    });
    const Component = withFeatureGate(MainComponent, 'test', FallbackComponent);
    const wrapped = render(<Component />);
    await wrapped.findByTestId('fallback');
  });

  it('should pass through props to main component', async () => {
    const features = {
      test: true,
    };
    getStateMock.mockReturnValue({
      features,
    });
    let passedInProps: any;
    const Component = withFeatureGate(
      (props: any) => {
        passedInProps = props;
        return null;
      },
      'test',
      FallbackComponent,
    );
    render(<Component test="foo" />);
    expect(passedInProps).toEqual({
      test: 'foo',
      allEnabledFeatures: features,
    });
  });

  it('should pass through props to fallback component', async () => {
    const features = {
      test: false,
    };
    getStateMock.mockReturnValue({
      features,
    });
    let passedInProps: any;
    const Component = withFeatureGate(MainComponent, 'test', (props: any) => {
      passedInProps = props;
      return null;
    });
    render(<Component test="bar" />);
    expect(passedInProps).toEqual({
      test: 'bar',
      allEnabledFeatures: features,
    });
  });
});
