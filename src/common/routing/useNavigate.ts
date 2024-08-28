import { NavigateOptions, To, useNavigate as routerUseNavigate } from 'react-router-dom';

import { withBasename } from './getBaseName';

export interface NavigateFunction {
  (to: To, options?: NavigateOptions): void;
}

const useNavigate = () => {
  const navigate = routerUseNavigate();
  const wrapNavigate: NavigateFunction = (to, options) => {
    navigate(withBasename(to), options);
  };
  return wrapNavigate;
};

export default useNavigate;
