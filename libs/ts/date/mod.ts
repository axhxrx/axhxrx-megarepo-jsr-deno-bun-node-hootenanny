import { dateToFormat } from "./dateToFormat.ts";

export * from './dateToFormat.ts';
export * from './dateToIS08601WithTimeZoneOffset.ts';

if (import.meta.main)
{
  // Node.js won't execute this block, because it [isn't on board the import.meta.main train](https://github.com/nodejs/node/issues/49440).
  console.log(dateToFormat('YYYY-MM-DD HH:mm:ss'));
}
