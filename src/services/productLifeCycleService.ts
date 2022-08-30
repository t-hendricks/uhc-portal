// this file uses axios directly because it talks to an unauthenticated public API
import axios from 'axios';

const API_URL = 'https://access.redhat.com/product-life-cycles/api/v1/products';

const getOCPLifeCycleStatus = () => axios.get(
  API_URL,
  {
    params: {
      name: 'Openshift Container Platform 4',
    },
  },
);

export default getOCPLifeCycleStatus;
