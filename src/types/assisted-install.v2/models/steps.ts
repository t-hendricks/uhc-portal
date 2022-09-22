/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { step } from './step';

export type steps = {
    instructions?: Array<step>;
    next_instruction_seconds?: number;
    /**
     * What to do after finishing to run step instructions
     */
    post_step_action?: steps.post_step_action;
};

export namespace steps {

    /**
     * What to do after finishing to run step instructions
     */
    export enum post_step_action {
        EXIT = 'exit',
        CONTINUE = 'continue',
    }


}

