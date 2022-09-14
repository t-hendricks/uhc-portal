/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Permission = {
    action?: Permission.action;
    resource?: string;
};

export namespace Permission {

    export enum action {
        GET = 'get',
        LIST = 'list',
        CREATE = 'create',
        DELETE = 'delete',
        UPDATE = 'update',
    }


}

