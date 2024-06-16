import { DetectedRuntime } from './DetectedRuntime.ts';

declare const Deno: { version?: { deno?: string; v8?: string; typescript?: string } };
declare const Bun: { version?: string };
declare const process: { versions?: { node?: string } };

export const detectRuntime = (): DetectedRuntime =>
{
  const isDeno = typeof Deno !== 'undefined';
  const isBun = typeof Bun !== 'undefined';

  // ¯\_(ಠ_ಠ)_/¯ this is how Sydney said to check for Node:
  const isNode = !isBun && typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

  const isUnknown = !isDeno && !isBun && !isNode;

  const result: DetectedRuntime = {
    name: 'unknown runtime',
    version: 'unknown',
    isDeno,
    isBun,
    isNode,
    isUnknown,
  };

  if (isDeno)
  {
    const denoVersion = Deno.version;
    result.name = 'Deno';
    if (denoVersion)
    {
      if (denoVersion.deno)
      {
        result.version = denoVersion.deno;
      }
      if (denoVersion.typescript)
      {
        result.typescriptVersion = denoVersion.typescript;
      }
      if (denoVersion.v8)
      {
        result.v8Version = denoVersion.v8;
      }
    }
  }
  else if (isBun)
  {
    result.name = 'Bun';
    result.version = Bun.version ?? 'unknown';
  }
  else if (isNode)
  {
    result.name = 'Node.js';
    const nodeVersion = process.versions?.node;
    if (nodeVersion)
    {
      result.version = nodeVersion;
    }
  }
  return result;
};
