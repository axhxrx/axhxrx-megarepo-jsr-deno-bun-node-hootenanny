/**
 Clunky hack first draft! 🚧
 */
console.log('ARGS', Deno.args);

import { join } from 'https://deno.land/std@0.224.0/path/mod.ts';
const cwd = Deno.cwd();

const firstArg = Deno.args[0];
const secondArg = Deno.args[1];
const thirdArg = Deno.args[2];

let scopeName: JsrScopeName;
let packageName: string;
let localVersionString: string;

if (firstArg && secondArg && thirdArg)
{
  console.log('taking arguments from command line');
  scopeName = '@' + firstArg;
  packageName = secondArg;
  localVersionString = thirdArg;
}
else if (firstArg || secondArg || thirdArg)
{
  console.log("ERR_INVALID_ARGS: it's an all-or-nothing affair");
  console.log(
    'Usage: deno run --allow-read --allow-net local-version-is-newer.deno.ts SCOPE_NAME PACKAGE_NAME LOCAL_VERSION_STRING',
  );
  Deno.exit(1);
}
else
{
  const pathToJsrMetadata = firstArg ?? join(cwd, 'jsr.json');

  console.log(`🌮🌮🌮 local-version-is-newer.deno.ts running in ${cwd}`);
  console.log(`Will attempt to read "${cwd}/jsr.json" to check local version...`);

  const localJsrMetadata = Deno.readTextFileSync(pathToJsrMetadata);
  const localJsrMetadataJson = JSON.parse(localJsrMetadata);
  localVersionString = localJsrMetadataJson.version;
}

if (!localVersionString)
{
  throw new Error(`No version found in "${cwd}/jsr.json"...`);
}

if (typeof localVersionString !== 'string' || localVersionString.length < 5
  || localVersionString.split('.').length !== 3)
{
  throw new Error(`Weird unusable version: "${localVersionString}"...`);
}
console.log(`Local version: ${localVersionString}`);

import { jsrMetadataFetch, JsrScopeName, jsrVersionIsOlderThan } from './mod.ts';

const remoteMetadata = await jsrMetadataFetch('@axhxrx', 'date');

if (!remoteMetadata)
{
  throw new Error(`No metadata found for "@axhxrx/date"...`);
}

console.log(`Remote version: ${remoteMetadata.latest}`);

const isOld = await jsrVersionIsOlderThan('@axhxrx', 'date', localVersionString, remoteMetadata);

console.log('JSR version is old:', isOld);

if (!isOld)
{
  console.log('Doing nothing and exiting with exit status 1');
  Deno.exit(0);
}
else
{
  console.log('🚀🚀🚀 PUBLISHING... ');
  const publishCommand = new Deno.Command("npx", {
    args: ["jsr", "publish"],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await publishCommand.output();

  if (code === 0) {
    console.log('✅ Published successfully!');
  } else {
    console.error('❌ Failed to publish.');
    const errorString = new TextDecoder().decode(stderr);
    console.error(errorString);
    const outputString = new TextDecoder().decode(stdout);
    console.log(outputString);
    Deno.exit(code);
  }

  Deno.exit(0);
}
