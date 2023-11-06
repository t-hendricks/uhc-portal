#!/bin/bash -e
# This script pre-configure some of the definitions for required QE test case runs.
# Writing env variables used for QE cypress tests to cypress.env.json.
cat > cypress.env.json << EOF
{
"CYPRESS_BASE_URL": "${CYPRESS_BASE_URL}",
"CYPRESS_grepTags": "${CYPRESS_grepTags}",
"BROWSER": "${BROWSER:-electron}",
"TEST_WITHQUOTA_USER": "${TEST_CYPRESS_QE_ORGADMIN_USER}",
"TEST_WITHQUOTA_PASSWORD": "${TEST_CYPRESS_QE_ORGADMIN_PASSWORD}",
"QE_ORGADMIN_USER": "${TEST_CYPRESS_QE_ORGADMIN_USER}",
"QE_ORGADMIN_PASSWORD": "${TEST_CYPRESS_QE_ORGADMIN_PASSWORD}",
"QE_ORGADMIN_OFFLINE_TOKEN": "${TEST_CYPRESS_QE_ORGADMIN_OFFLINE_TOKEN}",
"QE_AWS_ACCESS_KEY_ID": "${TEST_QE_AWS_ACCESS_KEY_ID}",
"QE_AWS_ARN_PREFIX": "${TEST_AWS_ARN_PREFIX}",
"QE_AWS_ACCESS_KEY_SECRET": "${TEST_QE_AWS_ACCESS_KEY_SECRET}",
"QE_AWS_REGION": "${TEST_QE_AWS_REGION}",
"QE_AWS_ID": "${TEST_QE_AWS_ID}",
"QE_ENV_AUT" : "${QE_ENV_AUT:-integration}",
"QE_ENV_PREFIX": "${QE_ENV_PREFIX:-gov-int}",
"QE_CLUSTER_NAME_PREFIX": "${QE_CLUSTER_NAME_PREFIX}",
"GOV_CLOUD": ${GOV_CLOUD:-true},
"QE_AWS_REGION_AND_LOCATION": "${QE_AWS_REGION_AND_LOCATION}",
"ROLE_PREFIX": "${ROLE_PREFIX:-cypress-account-roles}", 
"CLUSTER_VERSION": "${CLUSTER_VERSION:-4.12.25}",
"COMPUTE_NODE_TYPE": "${COMPUTE_NODE_TYPE:-m5a.xlarge}",
"COMPUTE_NODE_COUNT": "${COMPUTE_NODE_COUNT:-4}",
"USE_NON_DEFAULT_CIDR": ${USE_NON_DEFAULT_CIDR:-false},
"MACHINE_CIDR": "${MACHINE_CIDR:-10.0.0.0/16}",
"SERVICE_CIDR": "${SERVICE_CIDR:-172.30.0.0/16}",
"POD_CIDR": "${POD_CIDR:-10.128.0.0/16}",
"HOST_PREFIX": "${HOST_PREFIX:-/23}",
"ROLE_PROVIDER_MODE": "${ROLE_PROVIDER_MODE:-Auto}",
"UPDATE_STRATEGY": "${UPDATE_STRATEGY:-Individual updates}",
"CLUSTER_AVAILABILITY": "${CLUSTER_AVAILABILITY:-Single zone}",
"ENCRYPT_VOLUMES_WITH_CUSTOMER_KEYS": "${ENCRYPT_VOLUMES_WITH_CUSTOMER_KEYS:-Disabled}",
"KMS_CUSTOM_KEY_ARN": "${KMS_CUSTOM_KEY_ARN}",
"ADDITIONAL_ETCD_ENCRYPTION": "${ADDITIONAL_ETCD_ENCRYPTION:-Disabled}",
"FIPS_CRYPTOGRAPHY": "${FIPS_CRYPTOGRAPHY:-Disabled}",
"AUTO_SCALING": "${AUTO_SCALING:-Disabled}",
"MIN_NODE_COUNT": "${MIN_NODE_COUNT}",
"MAX_NODE_COUNT": "${MAX_NODE_COUNT}",
"INSTALL_INTO_EXISTING_VPC": "${INSTALL_INTO_EXISTING_VPC:-Enabled}",
"CONFIGURE_CLUSTER_WIDE_PROXY": "${CONFIGURE_CLUSTER_WIDE_PROXY}",
"INSTANCE_METADATA_SERVICE": "${INSTANCE_METADATA_SERVICE:-IMDSv1 and IMDSv2}",
"ROOT_DISK_SIZE": "${ROOT_DISK_SIZE:-300}",
"ADD_NODE_LABELS": ${ADD_NODE_LABELS:-false},
"NODE_LABEL_KVS": ${NODE_LABEL_KVS:-[]},
"CLUSTER_PRIVACY_VALIDATION": "${CLUSTER_PRIVACY_VALIDATION:-Private}",
"CLUSTER_PRIVACY": "${CLUSTER_PRIVACY:-public}",
"ROLE_PROVIDER_MODE_VALIDATION": "${ROLE_PROVIDER_MODE_VALIDATION:-auto}",
"VPC_NAME": "${VPC_NAME}",
"SUBNET_ID": "${SUBNET_ID}",
"INSTALL_INTO_AWS_SHARED_VPC": ${INSTALL_INTO_AWS_SHARED_VPC:-false},
"SHARED_VPC_BASE_DNS_DOMAIN": "${SHARED_VPC_BASE_DNS_DOMAIN}",
"AVAILABILITY_ZONE_REGION": "${AVAILABILITY_ZONE_REGION}",
"HTTP_PROXY": "${HTTP_PROXY}",
"HTTPS_PROXY": "${HTTP_PROXY}",
"TEARDOWN": ${TEARDOWN}
}
EOF

# Get token from UI
npx cypress run --config baseUrl=$CYPRESS_BASE_URL --spec cypress/e2e/rosa/RosaGetTokenFedRamp.js
TOKEN=$(cat ${PWD}/rosa-login-token.sh)
if [ ! -z "${TOKEN}" ]; then
  jq ".QE_ORGADMIN_OFFLINE_TOKEN = $TOKEN" cypress.env.json > tmp.json && mv tmp.json cypress.env.json
fi

aws configure set aws_access_key_id "${TEST_QE_AWS_ACCESS_KEY_ID}"
aws configure set aws_secret_access_key "${TEST_QE_AWS_ACCESS_KEY_SECRET}"
aws configure set region "${TEST_QE_AWS_REGION}"
aws configure set output "json"

# Get subnet ID of VPC using VPC_NAME
if [ ! -z "${VPC_NAME}" ]; then
  VPC_ID=$(aws ec2 describe-vpcs --region "${TEST_QE_AWS_REGION}" --filters "Name=tag:Name,Values=${VPC_NAME}" | jq -r .Vpcs[].VpcId)
  echo "VPC_ID is ${VPC_ID}"
  SUBNET_ID=$(aws ec2 describe-subnets --region "${TEST_QE_AWS_REGION}" --filters "Name=tag:Name,Values=*private*" --query "Subnets[?VpcId=='${VPC_ID}'].SubnetId" --output text)
  jq ".SUBNET_ID = \"$SUBNET_ID\"" cypress.env.json > tmp.json && mv tmp.json cypress.env.json
fi

if [ "${FIPS_CRYPTOGRAPHY}" = "Enabled" ]; then
  FIPS_CRYPTOGRAPHY_VALIDATION="FIPS Cryptography enabled"
  jq ".FIPS_CRYPTOGRAPHY_VALIDATION = \"$FIPS_CRYPTOGRAPHY_VALIDATION\"" cypress.env.json > tmp.json && mv tmp.json cypress.env.json
fi

# writing all vars to env-file for easy passing to container
> cypress.env.list
jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' cypress.env.json | while IFS="=" read -r key value
do
    echo "Writing env var: $key=$value to env-file"
    if [ "${value}" = "true" ] || [ "${value}" = "false" ]; then
      echo "$key=$value" >> cypress.env.list
    else
      echo "$key=\"$value\"" >> cypress.env.list
    fi
done
