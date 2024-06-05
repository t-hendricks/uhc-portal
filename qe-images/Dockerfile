FROM registry.ci.openshift.org/ci/rosa-aws-cli:latest AS builder
WORKDIR /usr/bin

FROM quay.io/openshifttest/cypress-included:13.6.4

COPY --from=builder /usr/bin/ocm /usr/bin/ocm
COPY --from=builder /usr/bin/rosa /usr/bin/rosa

ENV AWS_ACCESS_KEY_ID=""
ENV AWS_SECRET_ACCESS_KEY=""
ENV REGION=""

CMD aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}
CMD aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}
CMD aws configure set region ${REGION}


