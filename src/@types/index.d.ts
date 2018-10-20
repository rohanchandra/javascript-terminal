declare module 'minimatch-capture' {
  function capture(path: string, pattern: string, options: object): string;
  export default capture;
}
declare module 'get-options' {
  // Import the function like
// import getOpts  = require('get-options');
// If you need the types you can import them like normal
// import { Options } from 'get-options';

  /**
   * Extract command-line options from a list of strings.
   */
  function getOpts(
    input: any[],
    optdef?: string | { [key: string]: string },
    config?: getOpts.Config
  ): getOpts.Options;

  export = getOpts;

  namespace getOpts {
    export type Options = { options: any; argv: string[] };
    export type Config = {
      noAliasPropagation?: boolean |  "first-only";
      noCamelCase?: boolean;
      noBundling?: boolean;
      ignoreEquals?: boolean;
      duplicates?:
        | "use-first"
        | "use-last"
        | "limit-first"
        | "limit-last"
        | "error"
        | "append"
        | "stack"
        | "stack-values";
    };
  }
}
