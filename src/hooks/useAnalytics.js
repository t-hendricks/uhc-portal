import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const useAnalytics = () => {
  const { analytics } = useChrome();
  return analytics;
};

export default useAnalytics;
