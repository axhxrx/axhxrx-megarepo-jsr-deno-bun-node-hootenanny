/**
 The information about the runtime we are running in that can be returned by `detectRuntime()`;
 */
export type DetectedRuntime = {
  name: 'Deno' | 'Bun' | 'Node.js' | 'unknown runtime';
  version: string;
  isDeno: boolean;
  isBun: boolean;
  isNode: boolean;
  isUnknown: boolean;
  typescriptVersion?: string;
  v8Version?: string;
};
