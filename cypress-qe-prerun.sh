#!/bin/bash -e
# This script pre-configure some of the definitions for required QE test case runs.
if [ $# -eq 0 ]; then
    echo "Please provide required parameters.cypress.env.json is mandatory."
    exit 1
fi

# Reading and parsing cypress.env.json for CLI steps.
echo "Reading and parsing $1 file."
config_json=`cat $1`
echo "cypress.env.json file contents : $config_json"
TEST_QE_AWS_ACCESS_KEY_ID=`echo "$config_json" | jq '.QE_AWS_ACCESS_KEY_ID'`
TEST_QE_AWS_ACCESS_KEY_SECRET=`echo "$config_json" | jq '.QE_AWS_ACCESS_KEY_SECRET'`
TEST_QE_AWS_REGION=`echo "$config_json" | jq '.QE_AWS_REGION'`
TEST_QE_AWS_ID=`echo "$config_json" | jq -r '.QE_AWS_ID'`
QE_ORGADMIN_OFFLINE_TOKEN=`echo "$config_json" | jq -r '.QE_ORGADMIN_OFFLINE_TOKEN'`
ENV_AUT=`echo "$config_json" | jq -r '.QE_ENV_AUT'`


# Executing ROSA commands for pre-config step.
echo "Executing ROSA pre-config commands"
rosa version
aws configure set aws_access_key_id "${TEST_QE_AWS_ACCESS_KEY_ID}"
aws configure set aws_secret_access_key "${TEST_QE_AWS_ACCESS_KEY_SECRET}"
aws configure set region "${TEST_QE_AWS_REGION}"
aws configure set output "json"
rosa login --token $QE_ORGADMIN_OFFLINE_TOKEN --env $ENV_AUT
linked_ocmrole=$(rosa list ocm-roles | awk '$3 == "Yes" { print $2 }')
if [ ! -z $linked_ocmrole ];then
  rosa unlink ocm-role --role-arn $linked_ocmrole  -y
fi

linked_userrole=$(rosa list user-roles | awk '$3 == "Yes" { print $2 }')
if [ ! -z $linked_userrole ];then
  rosa unlink user-role --role-arn $linked_userrole  -y
fi
ocmroles_success_msg=$(rosa create ocm-role --prefix cypress-ocm-role --mode auto --admin -y 2>&1)
orphen_ocmroles=$(echo $ocmroles_success_msg |  grep "unlink" | sed -n -l4 "s/.*\(arn:aws:iam::${TEST_QE_AWS_ID}:.*[0-9]\).*/\1/p")
if [ ! -z $orphen_ocmroles ];then
  rosa unlink ocm-role --role-arn $orphen_ocmroles  -y
  ocmroles_success_msg=$(rosa create ocm-role --prefix cypress-ocm-role --mode auto --admin -y)
fi
echo $ocmroles_success_msg

userroles_success_msg=$(rosa create user-role --prefix cypress-user-role --mode auto -y 2>&1)
orphen_userroles=$(echo $userroles_success_msg |  grep "unlink" | sed -n "s/.*\(arn:aws:iam::${TEST_QE_AWS_ID}:.*[0-9]\).*/\1/p")

if [ ! -z $orphen_userroles ];then
  rosa unlink user-role --role-arn $orphen_userroles  -y
  userroles_success_msg=$(rosa create user-role --prefix cypress-user-role --mode auto -y)
fi
echo $ocmroles_success_msg
rosa create account-roles --prefix cypress-account-roles --mode auto -y

echo "Completed ROSA pre-config commands!"