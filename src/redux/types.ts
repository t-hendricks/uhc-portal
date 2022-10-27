import { RouterState } from 'connected-react-router';

export interface ApiRequest {
  details: string;
  error: boolean;
  errorDetails: string;
  errorMessage: string;
  fulfilled: boolean;
  pending: boolean;
}

export interface QuotaList {
  items: any[];
}

export interface Organization extends ApiRequest {
  quotaList: QuotaList;
}

export interface UserProfile {
  organization: Organization;
}

export interface Modal {
  data: any;
}

export interface RosaApi {
  getAWSAccountIDsResponse: {
    data: any[];
  };
}

export interface CcsCredentialsValidity extends ApiRequest {
  cloudProvider: string;
  credentials: any;
}

export interface CcsInquiries {
  ccsCredentialsValidity: CcsCredentialsValidity;
}

export interface GlobalState {
  modal: Modal;
  rosaReducer: RosaApi;
  features: Record<string, boolean>;
  userProfile: UserProfile;
  router: RouterState;
  ccsInquiries: CcsInquiries;
}
