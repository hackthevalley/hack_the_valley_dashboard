/*
 * Copyright (c) Hack the Valley All Rights Reserved.
 * License granted under MIT.
 * Author(s):
 *  Jun Zheng - me at jackzh dot com
 *  Fredric Pun
 *  Omar Chehab
 */


export default function(err) {
  return err.graphQLErrors
    ? err.graphQLErrors.map(err => err.message)
    : err.errorCodes;
}
