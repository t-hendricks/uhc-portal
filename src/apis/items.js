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

/* eslint-disable-next-line */

export const fetchItems = (params) => {
  console.log(params)
  const options = {
    headers: { 'Authorization': "Bearer " + sessionStorage.getItem('kctoken') }
  }
  const createPromise = response => new Promise((resolve, reject) => {
    return fetch('/api/clusters_mgmt/v1/clusters?page='+params.page+'&size='+params.limit, options)
      .then(response => {  
        if (response.ok) {
          return response;
        } else {
          reject(new Error('error'))
        }
      }, error => {
        reject(new Error(error.message))
      }).then(response => response.json())
      .then(json => {
        console.log(json)
        resolve(json)
      }).catch(function(error) {
        console.log(error);
    });
  })

  const { limit } = params;
  const offset = params.offset !== undefined ? params.offset : 0;
  const defaultResponse = {
    count: 0,
    results: [],
  };
  return createPromise(defaultResponse);
};
