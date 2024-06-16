import { it, describe } from 'bun:test'

import { detectRuntime } from "./detectRuntime.ts";
describe('the README example code ', () => {
  it('should not have compile errors', () => {
    const 肉まん = detectRuntime();
    if (肉まん.isBun)
    {
      console.log(`I knew it!! This is Bun ${肉まん.version}.`);
    }
  });
});