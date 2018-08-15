import ClusterList from './components/clusters/ClusterList';

const routes = () => [
  {
    iconClass: 'fa fa-crosshairs',
    title: 'Clusters',
    to: '/clusters',
    redirect: true,
    component: ClusterList,
  },
];

export { routes };
