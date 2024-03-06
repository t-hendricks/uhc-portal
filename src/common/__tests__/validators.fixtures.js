const GCPServiceAccounts = [
  {
    testObj: {
      type: 'service_account',
      project_id: 'project-id',
      private_key_id: '6443d30d8043cdc86d4731f8375e048ead64ae42',
      private_key: '-----BEGIN PRIVATE KEY-----\nprivatekey\n-----END PRIVATE KEY-----\n',
      client_id: '106126956512256235119',
      client_email: 'osd-ccs-admin@exampleproj.iam.gserviceaccount.com',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/my-service-account%40exampleproj.iam.gserviceaccount.com',
    },
    expectedError: null,
  },
  {
    testObj: {
      type: 'service_accountyyy',
      project_id: 'project-id',
      private_key_id: '6443d30d8043cdc86d4731f8375e048ead64ae42',
      private_key: '-----BEGIN PRIVATE KEY-----\nprivatekey\n-----END PRIVATE KEY-----\n',
      client_id: '106126956512256235119',
      client_email: 'osd-ccs-admin@exampleproj.iam.gserviceaccount.com',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/my-service-account%40exampleproj.iam.gserviceaccount.com',
    },
    expectedError: {
      property: 'instance.type',
      message: 'does not exactly match expected constant: service_account',
    },
  },
  {
    testObj: {
      type: 'service_account',
      project_id: 'project-id',
      private_key_id: '6443d30d8043cdc86d4731f8375e048ead64ae42',
      private_key: 'privatekey',
      client_id: '106126956512256235119',
      client_email: 'osd-ccs-admin@exampleproj.iam.gserviceaccount.com',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/my-service-account%40exampleproj.iam.gserviceaccount.com',
    },
    expectedError: {
      property: 'instance.private_key',
      message:
        'does not match pattern "^-----BEGIN PRIVATE KEY-----\\n(.|\\n)*\\n-----END PRIVATE KEY-----\\n$"',
    },
  },
  {
    testObj: {
      type: 'service_account',
      project_id: 'sda-ccs-3',
      private_key_id: '6443d30d8043cdc86d4731f8375e048ead64ae42',
      private_key: '-----BEGIN PRIVATE KEY-----\nprivatekey\n-----END PRIVATE KEY-----\n',
      client_email: 'osd-ccs-admin@exampleproj.iam.gserviceaccount.com',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/my-service-account%40exampleproj.iam.gserviceaccount.com',
    },
    expectedError: {
      property: 'instance',
      message: 'requires property "client_id"',
    },
  },
  {
    testObj: {
      type: 'service_account',
      project_id: 'sda-ccs-3',
      private_key_id: '6443d30d8043cdc86d4731f8375e048ead64ae42',
      private_key: '-----BEGIN PRIVATE KEY-----\nprivatekey\n-----END PRIVATE KEY-----\n',
      client_email: 'sda-ccs-3-sa',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/my-service-account%40exampleproj.iam.gserviceaccount.com',
    },
    expectedError: {
      property: 'instance.client_email',
      message: 'does not conform to the "email" format',
    },
  },
  {
    testObj: {
      type: 'service_account',
      project_id: 'sda-ccs-3',
      private_key_id: '6443d30d8043cdc86d4731f8375e048ead64ae42',
      private_key: '-----BEGIN PRIVATE KEY-----\nprivatekey\n-----END PRIVATE KEY-----\n',
      client_email: 'invalid-account@exampleproj.iam.gserviceaccount.com',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/my-service-account%40exampleproj.iam.gserviceaccount.com',
    },
    expectedError: {
      property: 'instance.client_email',
      message:
        'does not match pattern "^osd-ccs-admin@([\\\\S]*)\\\\.iam\\\\.gserviceaccount\\\\.com$"',
    },
  },
  {
    testObj: {
      type: 'service_account',
      project_id: 'sda-ccs-3',
      private_key_id: '6443d30d8043cdc86d4731f8375e048ead64ae42',
      private_key: '-----BEGIN PRIVATE KEY-----\nprivatekey\n-----END PRIVATE KEY-----\n',
      client_email: 'osd-ccs-admin@exampleproj.iam.gserviceaccount.com',
      auth_uri: '://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/my-service-account%40exampleproj.iam.gserviceaccount.com',
    },
    expectedError: {
      property: 'instance.auth_uri',
      message:
        'does not exactly match expected constant: https://accounts.google.com/o/oauth2/auth',
    },
  },
  {
    testObj: {
      type: 'service_account',
      project_id: 'sda-ccs-3',
      private_key_id: '6443d30d8043cdc86d4731f8375e048ead64ae42',
      private_key: '-----BEGIN PRIVATE KEY-----\nprivatekey\n-----END PRIVATE KEY-----\n',
      client_id: '106126956512256235119',
      client_email: 'osd-ccs-admin@exampleproj.iam.gserviceaccount.com',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        '://www.googleapis.com/robot/v1/metadata/x509/my-service-account%40exampleproj.iam.gserviceaccount.com',
    },
    expectedError: {
      property: 'instance.client_x509_cert_url',
      message: 'does not conform to the "uri" format',
    },
  },
];

const selectedSubnets = [
  {
    cidr_block: '10.0.0.0/20',
    name: 'test-subnet-private-1',
    subnet_id: 'subnet-04e923b04ba921c7d',
  },
  {
    cidr_block: '10.0.16.0/20',
    name: 'test-subnet-private-2',
    subnet_id: 'subnet-03da14b7d2c7d73f0',
  },
  {
    cidr_block: '10.0.32.0/20',
    name: 'test-subnet-private-3',
    subnet_id: 'subnet-0fd96dead0c244673',
  },
  {
    cidr_block: '10.0.48.0/20',
    name: 'test-subnet-private-4',
    subnet_id: 'subnet-0d7e4b5ad15f8967b',
  },
  {
    cidr_block: '10.0.128.0/20',
    name: 'test-subnet-public-1',
    subnet_id: 'subnet-0ff6fbcf60020b712',
  },
  {
    cidr_block: '10.0.144.0/20',
    name: 'test-subnet-public-2',
    subnet_id: 'subnet-02442291e9f6c946c',
  },
  {
    cidr_block: '10.0.160.0/20',
    name: 'test-subnet-public-3',
    subnet_id: 'subnet-021c83eb7b7fcdbf8',
  },
  {
    cidr_block: '10.0.176.0/20',
    name: 'test-subnet-public-4',
    subnet_id: 'subnet-0a6130121fbb2077a',
  },
];

const fixtures = { GCPServiceAccounts, selectedSubnets };
export default fixtures;
