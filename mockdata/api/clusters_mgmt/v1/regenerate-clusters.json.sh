#!/bin/bash

cd "$(dirname "$0")"

(
  echo '
{
  "kind": "ClusterList",
  "page": 1,
  "size": 3,
  "total": 3,
  "items": [
'
  cat clusters/fake-installing-cluster.json
  echo ,
  cat clusters/1H1l4oRVxoh6qSTf4fSmvtaGaWy.json
  echo ,
  cat clusters/1GRoczjlSc54Rk7So1R8Vx3fW9y.json
  echo ,
  cat clusters/fakeclusterid.json
  echo '
  ]
}'
) | jq . > clusters.json
