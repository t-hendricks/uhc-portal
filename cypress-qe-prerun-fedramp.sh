#!/bin/bash -e
# This script pre-configure some of the definitions for required QE test case runs.
if [ $# -eq 0 ]; then
    echo "Please provide required parameters.cypress.env.json is mandatory."
    exit 1
fi

# Reading and parsing cypress.env.json for CLI steps.
echo "Reading and parsing cypress.env.json file."
config_json=`cat cypress.env.json`
echo "cypress.env.json file contents : $config_json"
TEST_QE_AWS_ACCESS_KEY_ID=`echo "$config_json" | jq -r '.QE_AWS_ACCESS_KEY_ID'`
TEST_QE_AWS_ACCESS_KEY_SECRET=`echo "$config_json" | jq -r '.QE_AWS_ACCESS_KEY_SECRET'`
TEST_QE_AWS_REGION=`echo "$config_json" | jq -r '.QE_AWS_REGION'`
TEST_QE_AWS_ID=`echo "$config_json" | jq -r '.QE_AWS_ID'`
QE_ORGADMIN_OFFLINE_TOKEN=`echo "$config_json" | jq -r '.QE_ORGADMIN_OFFLINE_TOKEN'`
ENV_AUT=`echo "$config_json" | jq -r '.QE_ENV_AUT'`
GOV_CLOUD=`echo "$config_json" | jq -r '.GOV_CLOUD'`
AWS_REGION=`echo "$config_json" | jq -r '.QE_AWS_REGION'`
QE_ENV_PREFIX=`echo "$config_json" | jq -r '.QE_ENV_PREFIX'`
VPC_NAME=`echo "$config_json" | jq -r '.VPC_NAME'`

# Prefix string has a length limit
OCM_ROLE_PREFIX="qe-test-${QE_ENV_PREFIX}"
USER_ROLE_PREFIX="qe-test-${QE_ENV_PREFIX}"
ACOUNT_ROLE_PREFIX="qe-test-${QE_ENV_PREFIX}"

# Executing ROSA commands for pre-config step.
echo "Executing ROSA pre-config commands"
rosa version
aws configure set aws_access_key_id "${TEST_QE_AWS_ACCESS_KEY_ID}"
aws configure set aws_secret_access_key "${TEST_QE_AWS_ACCESS_KEY_SECRET}"
aws configure set region "${TEST_QE_AWS_REGION}"
aws configure set output "json"

# If ENV_AUT isn't set then assume production env
if [[ $ENV_AUT == "production" && $GOV_CLOUD == false ]]; then
  # Its production and not govcloud
  rosa login --token=$QE_ORGADMIN_OFFLINE_TOKEN
elif [[ $ENV_AUT == "production" && $GOV_CLOUD == true ]]; then
  #Its production and govcloud
  rosa login --govcloud --token=$QE_ORGADMIN_OFFLINE_TOKEN
elif [[ $ENV_AUT == "integration" && $GOV_CLOUD == false ]]; then
  # Its integration and not govcloud
  rosa login --env=$ENV_AUT --token=$QE_ORGADMIN_OFFLINE_TOKEN
elif [[ $ENV_AUT == "integration" && $GOV_CLOUD == true ]]; then
  # Its integration and govcloud
  rosa login --govcloud --env=$ENV_AUT --token=$QE_ORGADMIN_OFFLINE_TOKEN
elif [[ $ENV_AUT == "staging" && $GOV_CLOUD == false ]]; then
  # Its staging and not govcloud
  rosa login --env=$ENV_AUT --token=$QE_ORGADMIN_OFFLINE_TOKEN
elif [[ $ENV_AUT == "staging" && $GOV_CLOUD == true ]]; then
  # Its staging and govcloud
  rosa login --govcloud --env=$ENV_AUT --token=$QE_ORGADMIN_OFFLINE_TOKEN
fi

linked_ocmrole=$(rosa list ocm-roles | awk '$3 == "Yes" { print $2 }')
if [ ! -z $linked_ocmrole ];then
    rosa unlink ocm-role --role-arn $linked_ocmrole  -y && break
fi

linked_userrole=$(rosa list user-roles | awk '$3 == "Yes" { print $2 }')
if [ ! -z $linked_userrole ];then
  rosa unlink user-role --role-arn $linked_userrole  -y
fi
ocmroles_success_msg=$(rosa create ocm-role --prefix $OCM_ROLE_PREFIX --mode auto --admin -y 2>&1)
orphen_ocmroles=$(echo $ocmroles_success_msg |  grep "unlink" | sed -n -l4 "s/.*\(${QE_AWS_ARN_PREFIX}::${TEST_QE_AWS_ID}:.*[0-9]\).*/\1/p")
if [ ! -z $orphen_ocmroles ];then
  rosa unlink ocm-role --role-arn $orphen_ocmroles  -y
  ocmroles_success_msg=$(rosa create ocm-role --prefix $OCM_ROLE_PREFIX --mode auto --admin -y)
fi
echo $ocmroles_success_msg

userroles_success_msg=$(rosa create user-role --prefix $USER_ROLE_PREFIX --mode auto -y 2>&1)
orphen_userroles=$(echo $userroles_success_msg |  grep "unlink" | sed -n "s/.*\(${QE_AWS_ARN_PREFIX}::${TEST_QE_AWS_ID}:.*[0-9]\).*/\1/p")

if [ ! -z $orphen_userroles ];then
  rosa unlink user-role --role-arn $orphen_userroles  -y
  userroles_success_msg=$(rosa create user-role --prefix $USER_ROLE_PREFIX --mode auto -y)
fi
echo $userroles_success_msg
rosa create account-roles --prefix $ACOUNT_ROLE_PREFIX --mode auto -y

echo "Completed ROSA pre-config commands!"
