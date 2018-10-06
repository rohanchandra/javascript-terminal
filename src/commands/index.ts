import { ICommandObjectMapping } from '../types';

export const commandNames: string[] = [
  'cat',
  'cd',
  'clear',
  'cp',
  'echo',
  'head',
  'history',
  'ls',
  'mkdir',
  'printenv',
  'pwd',
  'rm',
  'rmdir',
  'tail',
  'touch',
  'whoami'
];

export default commandNames.reduce((mapping, commandName) => {
  return {
    ...mapping,
    [commandName]: {
      function: require(`./${commandName}`).default,
      help: require(`./${commandName}`).help,
      optDef: require(`./${commandName}`).optDef
    }
  };
}, {}) as ICommandObjectMapping;
