declare module 'get-options' {
  export default function getOpts(
    commandOptions: string[],
    optDef: any,
    options: any
  ): {
    argv: any;
    options: any;
  };
}
