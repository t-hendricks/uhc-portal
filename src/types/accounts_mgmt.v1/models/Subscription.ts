/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Account } from './Account';
import type { AccountReference } from './AccountReference';
import type { Capability } from './Capability';
import type { Label } from './Label';
import type { OneMetric } from './OneMetric';
import type { Plan } from './Plan';
import type { SubscriptionCommonFields } from './SubscriptionCommonFields';

export type Subscription = (SubscriptionCommonFields & {
    capabilities?: Array<Capability>;
    created_at?: string;
    creator?: AccountReference;
    /**
     * Calulated as the subscription created date + 60 days
     */
    eval_expiration_date?: string;
    labels?: Array<Label>;
    metrics?: Array<OneMetric>;
    notification_contacts?: Array<Account>;
    plan?: Plan;
    updated_at?: string;
});

