import PropTypes from 'prop-types';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';

/**
 * Use this wrapper in class based components that you want to add tracking to.
 * Example:
 * <AnalyticsWrapper render={analytics => (
 *   <Button onClick={() => analytics.track('event_name', {})}>Button text</Button>
 * )} />
 *
 * In functional components, you can instead import and use the useChrome hook directly:
 * import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';
 * const FunctionalComponent = () => {
 *  const { analytics } = useChrome();
 *  return <Button onClick={() => analytics.track('event_name', {})}>Button text</Button>
 * }
 */
const AnalyticsWrapper = ({ render }) => {
  const { analytics } = useChrome();
  return render(analytics);
};

AnalyticsWrapper.propTypes = {
  render: PropTypes.func.isRequired,
};

export default AnalyticsWrapper;
