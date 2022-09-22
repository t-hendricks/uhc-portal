/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { step_type } from './step_type';

export type step_reply = {
    error?: string;
    exit_code?: number;
    output?: string;
    step_id?: string;
    step_type?: step_type;
};

