import ClusterList from './components/clusters/ClusterList';

const routes = () => [
  {
    iconClass: 'pficon pficon-cluster',
    title: 'Clusters',
    to: '/clusters',
    redirect: true,
    component: ClusterList,
  },
];

export default routes;
