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

import React, { ReactNode, useState } from 'react';

import useResizeObserver from '@react-hook/resize-observer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Router from './Router';

import './App.scss';

type Props = {
  children?: ReactNode | undefined;
};

const App = ({ children }: Props) => {
  const header = document.getElementsByTagName('header')[0];
  const [headerHeight, setHeaderHeight] = useState(header.getBoundingClientRect().height);

  useResizeObserver(header, (entry) => {
    const { contentRect } = entry;
    if (headerHeight !== contentRect.height) {
      setHeaderHeight(contentRect.height);
    }
  });

  const queryClient = new QueryClient();

  return (
    <div id="app-outer-div" style={{ height: `calc(100vh - ${headerHeight}px` }}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <ReactQueryDevtools initialIsOpen={false} position="bottom" buttonPosition="bottom-right" />
      </QueryClientProvider>
    </div>
  );
};

export default App;
