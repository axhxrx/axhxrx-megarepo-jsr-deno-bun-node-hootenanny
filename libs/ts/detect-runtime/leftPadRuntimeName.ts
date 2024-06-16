import { default as leftPadThatBoooch } from 'left-pad';

import type { DetectedRuntime } from "./DetectedRuntime.ts";
/**
 This function just tests consumption of an NPM package. There's no other point.
 */
export const leftPaddedRuntimeName = (runtimeInfo: DetectedRuntime): string =>
{
  return leftPadThatBoooch(runtimeInfo.name, 20);
}