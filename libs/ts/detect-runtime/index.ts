/**
 The reason for this import is we are testing edge cases in TypeScript monorepo, and just asserting that we can import other TS libs in the monorepo way, as we run this code using various different runtimes.
 */
import { dateToFormat } from '@axhxrx/date';
import { assertNever } from '@axhxrx/assert-never';
import { detectRuntime } from './detectRuntime.ts';
import { leftPaddedRuntimeName } from "./leftPadRuntimeName.ts";
import { Loginator } from './Loginator.ts';

const result = detectRuntime();

if (import.meta.main)
{
  // Node.js won't execute this block, because it [isn't on board the import.meta.main train](https://github.com/nodejs/node/issues/49440).

  console.log(`
    Hello via ${result.name}!  
    The date is: ${dateToFormat('YYYY-MM-DD HH:mm:ss')} 
    (via @axhxrx/date)
    `);
  console.log(result);

  console.log('--------------------')
  console.log(leftPaddedRuntimeName(result));
  console.log('--------------------')

  const logger = Loginator;

  logger.info("Loginator message", { name: "zfx" });
}

if (result.isNode || result.isUnknown)
{
  // Whatever, for now just print it
  console.log(result);
}

// This is just a test of importing another JSR package, to prove it can import the local monorepo/megarepo package in that context, and from JSR otherwise.
let _found = false;
const name = result.name
switch (name) {
  case 'Deno':
    _found = true;
    break;
  case 'Node.js':
    _found = true;
    break;
  case 'unknown runtime':
    _found = true;
    break;
  case 'Bun':
    _found = true;
    break;
  default:
    assertNever(name);
    console.error('Should never happen');
}
