import { create as createFileSystem } from 'emulator-state/file-system';

const FS = createFileSystem({
  '/cannot-modify': {
    canModify: false
  },
  '/cannot-modify/can-modify-file': {
    canModify: true,
    content: ''
  },
  '/cannot-modify/cannot-modify-file': {
    canModify: true,
    content: ''
  },
  '/cannot-modify/can-modify': {
    canModify: true
  },
  '/cannot-modify/can-modify/can-modify-file': {
    canModify: true,
    content: ''
  },
  '/cannot-modify/can-modify/cannot-modify-file': {
    canModify: true,
    content: ''
  },
  '/can-modify': {
    canModify: true
  },
  '/can-modify/can-modify-file': {
    canModify: true,
    content: ''
  },
  '/can-modify/cannot-modify-file': {
    canModify: false,
    content: ''
  },
  '/can-modify-secondary': {
    canModify: true
  }
});

export default FS;
