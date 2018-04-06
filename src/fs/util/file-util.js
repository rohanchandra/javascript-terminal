import { fromJS } from 'immutable';

/**
 * Checks if a JavaScript object is a file object
 * @param  {object}  json potential file
 * @return {boolean}      whether the object conforms to the file schema
 */
export const isFile = (map) => {
  return map.has('content');
};

/**
 * Checks if a JavaScript object is a directory object
 * @param  {object}  json potential directory
 * @return {boolean}      whether the object conforms to the directory schema
 */
export const isDirectory = (map) => {
  return !map.has('content');
};

/**
 * Makes an file conforming to the file schema
 * @param  {object} content  content of the file
 * @return {object}          new file
 */
export const makeFile = (content = '', metadata = {}) => {
  return fromJS({
    content,
    ...metadata
  });
};

/**
 * Makes an directory conforming to the directory schema
 * @param  {object} children child directories or files
 * @return {object}          new directory
 */
export const makeDirectory = (metadata = {}) => {
  return fromJS({
    ...metadata
  });
};
