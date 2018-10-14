import { fromJS } from 'immutable';

// Primary folder
export const PRIMARY_FOLDER_PATH = '/primary';
export const PRIMARY_SUBFOLDER_PATH = '/primary/subfolder';
export const PRIMARY_FOLDER_FILES = ['foobar'];
export const PRIMARY_FILE_PATH = '/primary/foobar';
export const PRIMARY_FOLDER = {
  '/primary': {},
  '/primary/foobar': {content: ''},
  '/primary/subfolder': {}
};

// Secondary folder
export const SECONDARY_FOLDER_PATH = '/secondary';
export const SECONDARY_FOLDER_FILES = ['foo1', 'foo2', 'foo3'];
export const SECONDARY_FOLDER = {
  '/secondary': {},
  '/secondary/foo1': {content: ''},
  '/secondary/foo2': {content: ''},
  '/secondary/foo3': {content: ''}
};

// Mock FS
export const MOCK_FS = fromJS({
  '/': {},
  ...PRIMARY_FOLDER,
  ...SECONDARY_FOLDER
});

export const MOCK_FS_EXC_SECONDARY_FOLDER = fromJS({
  '/': {},
  ...PRIMARY_FOLDER
});
