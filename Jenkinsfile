/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

pipeline {

  agent any

  stages {

    stage('build') {
      steps {
        sh '''
          # Build the image:
          make version=${GIT_COMMIT} tar
        '''
      }
    }

    stage('deploy') {
      steps {
        sshagent(['sandbox-admin-key']) {
          sh '''
            # Set the target user and host:
            SSH_USER="admin"
            SSH_HOST="sandbox-0.private"
            SSH_TARGET="${SSH_USER}@${SSH_HOST}"

            # Calculate the args for 'ssh' and 'scp':
            SSH_ARGS="-o StrictHostKeyChecking=no"

            # Copy the 'oc' command and configuration file:
            scp ${SSH_ARGS} ${SSH_TARGET}:/usr/bin/oc oc
            scp ${SSH_ARGS} ${SSH_TARGET}:.kube/config kubeconfig

            # Calculate the args for 'oc':
            OC_ARGS="--config=kubeconfig"

            # Load the new image:
            scp ${SSH_ARGS} *.tar ${SSH_TARGET}:.
            ssh ${SSH_ARGS} ${SSH_TARGET} docker load -i *.tar

            # Deploy the application:
            oc ${OC_ARGS} new-project unified-hybrid-cloud || oc ${OC_ARGS} project unified-hybrid-cloud || true
            oc ${OC_ARGS} process \
              --filename=template.yml \
              --param=NAMESPACE=dedicated-portal \
              --param=VERSION=${GIT_COMMIT} \
              --param=DOMAIN=${SSH_HOST} \
            | \
            oc ${OC_ARGS} apply \
              --filename=-
          '''
        }
      }
    }

  }

  post {
    failure {
      slackSend color: "danger", message: "Deployment pipeline failed, see the details <${env.BUILD_URL}|here>."
    }

    always {
      cleanWs()
    }
  }

}
