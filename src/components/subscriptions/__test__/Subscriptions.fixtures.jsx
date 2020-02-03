import React from 'react';
import { Link } from 'react-router-dom';

const fetchAccount = jest.fn();
const fetchSubscriptions = jest.fn();
const fetchQuotaSummary = jest.fn();

const organizationID = 'org-1';

const account = {
  error: false,
  errorDetails: null,
  errorMessage: '',
  fulfilled: true,
  pending: false,
  valid: true,
  data: {
    organization: {
      id: organizationID,
    },
  },
};

const subscriptions = {
  empty: false,
  error: false,
  errorMessage: '',
  fulfilled: true,
  pending: false,
  valid: true,
  items: [
    {
      entitlement_status: 'Ok',
      id: 'subscription-3',
    },
    {
      entitlement_status: 'InconsistentServices',
      id: 'subscription-1',
    },
    {
      entitlement_status: 'Overcommitted',
      id: 'subscription-2',
    },
    {
      entitlement_status: 'NotSubscribed',
      id: 'subscription-6',
    },
    {
      entitlement_status: 'SixtyDayEvaluation',
      id: 'subscription-7',
    },
  ],
};

const stats = {
  InconsistentServices: 1,
  Ok: 1,
  Overcommitted: 1,
  NotSubscribed: 1,
  SixtyDayEvaluation: 1,
};

const quotaSummary = {
  empty: false,
  error: false,
  errorDetails: null,
  errorMessage: '',
  fulfilled: true,
  pending: false,
  valid: true,
  items: [
    {
      resource_name: 'c5.4xlarge',
      resource_type: 'cluster.aws',
      availability_zone_type: 'multi',
      byoc: true,
      allowed: 15,
      reserved: 10,
    },
    {
      resource_name: 'm5.xlarge',
      resource_type: 'cluster.aws',
      availability_zone_type: 'multi',
      byoc: true,
      allowed: 15,
      reserved: 15,
    },
    {
      resource_name: 'c5.4xlarge',
      resource_type: 'compute.node.aws',
      availability_zone_type: 'multi',
      byoc: true,
      allowed: 4,
      reserved: 0,
    },
    {
      resource_name: 'dbaOperatorAddon',
      resource_type: 'addon',
      availability_zone_type: '',
      byoc: false,
      allowed: 5,
      reserved: 0,
    },
  ],
};

const categories = {
  nonEmpty: {
    labelText: 'full',
    labelIcon: <></>,
    labelClass: '',
    labelHint: '',
    items: [{
      link: <Link to="/">Link1</Link>,
    }, {
      link: <Link to="/">Link2</Link>,
    }],
  },
  empty: {
    labelText: 'full',
    labelIcon: <></>,
    labelClass: '',
    labelHint: '',
    items: [],
  },
};

const rows = [];

export {
  fetchAccount,
  fetchSubscriptions,
  fetchQuotaSummary,
  organizationID,
  account,
  subscriptions,
  quotaSummary,
  stats,
  categories,
  rows,
};
