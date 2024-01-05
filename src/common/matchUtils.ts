// Used for matching any in various fields of quota cost related resources
const ANY = 'any';

/**
 * Compares two values, allowing 'ANY' on either side.
 */
const match = (a: string | undefined, b: string | undefined): boolean =>
  a === b || a === ANY || b === ANY;

/**
 * Compares two values, case-insensitively, allowing 'ANY' on either side.
 * (covers rhinfra vs rhInfra, any vs ANY)
 */
const matchCaseInsensitively = (a: string | undefined, b: string | undefined): boolean =>
  match(a ? a.toLowerCase() : undefined, b ? b.toLowerCase() : undefined);

export { ANY, match, matchCaseInsensitively };
