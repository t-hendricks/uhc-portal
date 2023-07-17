/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type HTPasswdUser = {
  /**
   * ID for a secondary user in the _HTPasswd_ data file.
   */
  id?: string;
  /**
   * HTPasswd Hashed Password for a user in the _HTPasswd_ data file.
   * The value of this field is set as-is in the _HTPasswd_ data file for the HTPasswd IDP
   */
  hashed_password?: string;
  /**
   * Password in plain-text for a  user in the _HTPasswd_ data file.
   * The value of this field is hashed before setting it in the  _HTPasswd_ data file for the HTPasswd IDP
   */
  password?: string;
  /**
   * Username for a secondary user in the _HTPasswd_ data file.
   */
  username?: string;
};
