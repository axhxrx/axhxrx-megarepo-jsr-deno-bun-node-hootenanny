# axhxrx-megarepo-jsr-deno-bun-node-hootenanny

This is a test monorepo/megarepo for the purpose of testing JSR.io packages, and Deno/Bun/Node interoperability in a monorepo/megarepo context. The libs it publishes are just minimal ones for the purpose of testing that out. **😙 THIS MAY NOT BE USEFUL**

## Problem statement (short)

Can we construct a megarepo that contains multiple, interdependent TypeScript libraries and applications, that can:

- [ ] reasonably conform to the monorepo/megarepo workflow, letting libs import from each other, and apps import from libs, without too much extra fuckery
- [x] use non-insane imports with the `.ts` extension
- [x] be run with Deno
- [x] be run with Bun
- [x] be bundled with esbuild or Bun or whatever, and then run with Node
- [x] be published to NPM or equivalent (presumably, JSR.io)
- [x] ...and get that nice provenance verification from JSR? 
- [ ] be (somehow, e.g. with a build step) consumed by legacy Node.js apps and Angular apps and whatnot

## Change log

### miscellany

- "deno.disablePaths" settings do not support globs, so to avoid Deno language server annoyingness, we must specify every single incompatible file individually (e.g. "libs/ts/detect-runtime/tests.bun.spec.ts") — obvious candidate for automation

- add a hackneyed initial draft of "check JSR metadata and publish only if local version higher" feature in the GHA automation

- **PROBLEM:** The publishing step seems to require maintaining the export_map.json file in pretty manual fashion. The publish step failed until we fixed various things by duplicating info from the `package.json` file into the `export_map.jsr.json` file. Considering we have only 3 tiny test libs so far, this could be a deal-breaking hassle with a real monorepo of 100s of packages, unless reliably automated.

```text
└[~/axhxrx-megarepo-jsr-deno-bun-node-hootenanny/libs/ts/detect-runtime]> bunx jsr publish --allow-dirty
Checking for slow types in the public API...
Visit https://jsr.io/auth?code=NAXW-TTBA to authorize publishing of @axhxrx/detect-runtime
Waiting...
Authorization successful. Authenticated as protiev
Publishing @axhxrx/detect-runtime@0.2.0 ...
error: Failed to publish @axhxrx/detect-runtime@0.2.0

Caused by:
    Failed to publish @axhxrx/detect-runtime at 0.2.0: failed to build module graph: Module not found "file:///@libs/logger".
        at file:///Loginator.ts:1:22
Child process exited with: 1
┌[protiev@fed-40-container] [/dev/pts/18] [main ⚡] [1]
└[~/axhxrx-megarepo-jsr-deno-bun-node-hootenanny/libs/ts/detect-runtime]> bunx jsr publish --allow-dirty
Checking for slow types in the public API...
Visit https://jsr.io/auth?code=CQWD-MAHK to authorize publishing of @axhxrx/detect-runtime
Waiting...
Authorization successful. Authenticated as protiev
Publishing @axhxrx/detect-runtime@0.2.0 ...
error: Failed to publish @axhxrx/detect-runtime@0.2.0

Caused by:
    Failed to publish @axhxrx/detect-runtime at 0.2.0: specifier 'npm:left-pad' is missing a version constraint
Child process exited with: 1
┌[protiev@fed-40-container] [/dev/pts/18] [main ⚡] [1]
└[~/axhxrx-megarepo-jsr-deno-bun-node-hootenanny/libs/ts/detect-runtime]> bunx jsr publish --allow-dirty
error: Could not find a matching package for 'npm:left-pad:1.3.0' in '/home/protiev/axhxrx-megarepo-jsr-deno-bun-node-hootenanny/package.json'. You must specify this as a package.json dependency when the node_modules folder is not managed by Deno.
    at file:///home/protiev/axhxrx-megarepo-jsr-deno-bun-node-hootenanny/libs/ts/detect-runtime/leftPadRuntimeName.ts:1:46
Child process exited with: 1
┌[protiev@fed-40-container] [/dev/pts/18] [main ⚡] [1]
└[~/axhxrx-megarepo-jsr-deno-bun-node-hootenanny/libs/ts/detect-runtime]> bunx jsr publish --allow-dirty
Checking for slow types in the public API...
Visit https://jsr.io/auth?code=UJAF-BLMG to authorize publishing of @axhxrx/detect-runtime
Waiting...
Authorization successful. Authenticated as protiev
Publishing @axhxrx/detect-runtime@0.2.0 ...
Successfully published @axhxrx/detect-runtime@0.2.0
Visit https://jsr.io/@axhxrx/detect-runtime@0.2.0 for details

Completed in 48s
┌[protiev@fed-40-container] [/dev/pts/18] [main ⚡] 
```

### 3️⃣ lib 3: `@axhxrx/detect-runtime`

Next, add a junk lib that imports the first two. This one will also import `left-pad`, of NPM fame. 😉 That's my test for "can use old NPM package".

```text
➜  detect-runtime git:(main) ✗ bun add left-pad
bun add v1.1.13 (bd6a6051)

installed left-pad@1.3.0

1 package installed [559.00ms]
➜  detect-runtime git:(main) ✗
```

~~**PROBLEM:** This makes Deno's language server start freaking out.~~ Oh wait, it doesn't. It actually works fine, I just had a typo. Wow! Cool. 

OK and now we have a third lib, which imports the other two from the monorepo, **and** [left-pad](https://www.npmjs.com/package/left-pad) from NPM. 

Cool let's add a dependency on a JSR package, too, although we will have to use the Nody way (but we're using Bun so I will use `bunx` and not `npx`):

```text
➜  detect-runtime git:(main) ✗ bunx jsr add @libs/logger         

Installing @libs/logger...
$ bun add @libs/logger@npm:@jsr/libs__logger
bun add v1.1.13 (bd6a6051)

installed @libs/logger@1.1.2

1 package installed [655.00ms]

Completed in 682ms
➜  detect-runtime git:(main) ✗ bun run index.ts
```
Hmm it works in Bun, but not Deno:

```text
➜  detect-runtime git:(main) ✗ bun run index.ts

    Hello via Bun!  
    The date is: 2024-06-16 16:04:56 
    (via @axhxrx/date)
    
{
  name: "Bun",
  version: "1.1.13",
  isDeno: false,
  isBun: true,
  isNode: false,
  isUnknown: false,
}
--------------------
                 Bun
--------------------
 INFO  │ +0.011      Loginator message {
  name: "zfx",
}
➜  detect-runtime git:(main) ✗ deno run index.ts
error: npm package '@jsr/libs__logger' does not exist.
➜  detect-runtime git:(main) ✗ deno run index.ts
```

I think this might be some unrelated bug in Deno/JSR though. I'll tackle that separately.

UPDATE: Yeah, the .npmrc file was missing somehow... fixed by adding that back.


### 2️⃣ lib 2: `axhxrx/date`

Since Deno doesn't use `package.json` and all that `node_modules` mess, but we need to have that, use Bun to generate an empty library:

```text
➜  date git:(main) bun init
bun init helps you get started with a minimal project and tries to guess sensible defaults. Press ^C anytime to quit

package name (date): 
entry point (index.ts): 

Done! A package.json file was saved in the current directory.
 + index.ts
 + .gitignore
 + tsconfig.json (for editor auto-complete)
 + README.md

To get started, run:
  bun run index.ts
➜  date git:(main) ✗ bun run index.ts 
```

Then, confirm that the library works with Deno, Bun, and Node (after bundling). It's just a hello world lib, so if it was already broken at this point, this project would be doomed, but it works as expected:

```text
➜  date git:(main) ✗ bun run index.ts 
Hello via Bun!
➜  date git:(main) deno run index.ts 
Hello via Bun!
➜  date git:(main) bun build index.ts --outdir=dist && node dist/index.js

  ./index.js  0.04 KB

[5ms] bundle 1 modules
Hello via Bun!
➜  date git:(main) 
```

Next we move package.json, tsconfig.json, and the .gitignore file that Bun generated to the root directory, instead of `libs/ts/date`. We are aiming to have an "integrated monorepo" with as few config files as we can manager, and everything sharing a single `package.json` file.

OK, but now let's put some real library contents in there so that it imports the other lib. Because this lib will import the previous lib, we add an import like this:

```
import { assertNever } from '@axhxrx/assert-never';
```

BOOM! Now we cannot build it, because the monorepo stuff isn't set up:

```
➜  date git:(main) ✗ deno run mod.ts
error: Relative import path "@axhxrx/assert-never" not prefixed with / or ./ or ../
    at file:///Volumes/STUFF/CODE/axhxrx-megarepo-jsr-deno-bun-node-hootenanny/libs/ts/date/mod.ts:1:29
➜  date git:(main) ✗ bun run mod.ts 
  🔍 @axhxrx/assert-never [1/1] 
error: package "@axhxrx/assert-never" not found registry.npmjs.org/@axhxrx%2fassert-never 404
error: Cannot find module "@axhxrx/assert-never" from "/Volumes/STUFF/CODE/axhxrx-megarepo-jsr-deno-bun-node-hootenanny/libs/ts/date/dateToFormat.ts"

Bun v1.1.13 (macOS arm64)
➜  date git:(main) ✗ 

```

Let's commit it in this broken state. (e6fcfd33713f68814648a0bbf933e0710fcf23c8)

OK, so let's try to fix that.

1. Change the lib so that when it is run it prints the date.
2. Rename `libs/ts/date/deno.json` to `libs/ts/date/deno.json.OFF` because unfortunately [Deno does not support one config gile extending another](https://github.com/denoland/deno/issues/18132)
3. Add a `deno.jsonc` file in the root of the repo, with contents:

```json
{
  "importMap": "import_map.json",
}
```

4. Add an `import_map.json` file in the root of the repo, with contents:

```json
{
  "imports": {
    "@axhxrx/assert-never": "./libs/ts/assert-never/mod.ts"
  }
}
```

BOOM! Deno can now run the program:

```text
➜  date git:(main) ✗ deno run mod.ts
2024-06-16 12:18:18
➜  date git:(main) ✗ 
```

OK Bun still doesn't work yet, but let's commmit this. (b67b7c6ff7f24d849c5bb1ec78a7649566895d9a)

OK, onwards to Bun. We add this to `./tsconfig.json`:

```json
    "paths": {
      "@axhxrx/assert-never": [
        "libs/ts/assert-never/mod.ts"
      ],
    },
    "rootDir": ".",
    "baseUrl": ".",
```

Et voilà!

```text
➜  date git:(main) ✗ bun run mod.ts                                    
2024-06-16 12:28:48
➜  date git:(main) ✗ 
➜  date git:(main) ✗ bun build mod.ts --outdir=dist && node dist/mod.js

  ./mod.js  2.63 KB

[2ms] bundle 5 modules
➜  date git:(main) ✗ # Node didn't print anything but that is expected since it doesn't support import.meta.main — it still ran and succeeded.
```

OK, let's commit this!(1ae9704fe28767ae1679b7b4fec838b0d9ad7cc1) We now have a working TypeScript monorepo with 2 libraries, one of which imports the other, and Deno can run/build it thanks to `./import_map.json` and Bun can build/run it thanks to `./tsconfig.json` and Node can run it thanks to Bun being able to build/bundle it. 

#### publish

OK, but we will get errors if we try to publish this. We need to add **another** export map, this time for JSR, so that it understands how to deal with `import { assertNever } from '@axhxrx/assert-never';` — in our megarepo, we want that to map to the local megarepo lib, but for the rest of the world, we need that reference `@axhxrx/assert-never` to resolve to the public, published package.

So, to give the library its own import map for publishing purposes, we add `./libs/ts/date/import_map.json` with contents:

```json
{
  "imports": {
    "@axhxrx/assert-never": "jsr:@axhxrx/assert-never@^0.1.1"
  }
}
```

And then, to reference that during the publish step, add `libs/ts/date/jsr.jsonc` with contents:

```json
{
  "name": "@axhxrx/date",
  "version": "0.1.5",
  "exports": "./mod.ts",
  "importMap": "import_map.json"
}
```

That's a lot of fuckery to do for every single import we use in every single lib! So hopefully it will be easy to automate. We'll hopefully be able to have every lib share a couple big import_maps: one for megarepo imports, and one for publication.

But anyway let's try this! (437e01ecf3e56a54f7ad7f224772c2a9ef19c288)

And.... dat werx! <https://jsr.io/@axhxrx/date@0.1.5>

So... we can now check off some of the boxes above. We have a monorepo with non-insane '.ts' imports, Deno, Bun, and Node compatibility, and JSR publishing. Maybe the next step is to add one more library, but make it import a.) megarepo libs, b.) NPM packages, and c.) JSR packages.

### 1️⃣ lib 1: `@axhxrx/assert-never`

Added a minimal Deno library, `@axhxrx/assert-never`. This lib doesn't import anything, it's just a base-level lib that other libs will import.

This lib doesn't do anything other than export a single function, `assertNever()`.

It could be published to JSR as [`@axhxrx/assert-never@0.1.1`](https://jsr.io/@axhxrx/assert-never@0.1.1)

```text
➜  axhxrx-megarepo-jsr-deno-bun-node-hootenanny git:(main) cd libs/ts/assert-never 
➜  assert-never git:(main) deno publish
Checking for slow types in the public API...
Visit https://jsr.io/auth?code=VYEB-XFUK to authorize publishing of @axhxrx/assert-never
Waiting...
Authorization successful. Authenticated as protiev
Publishing @axhxrx/assert-never@0.1.1 ...
Successfully published @axhxrx/assert-never@0.1.1
Visit https://jsr.io/@axhxrx/assert-never@0.1.1 for details
➜  assert-never git:(main) 
```

## Problem statement (long, with background story)

In large TypeScript codebases, there are efficiencies to using monorepo/megarepo style, whereby the code is split into multiple packages/libraries/apps, which are all colocated in a single git repo.

TypeScript [path mappings](https://www.typescriptlang.org/tsconfig/#paths) give us a way to [remap import specifiers] like `import { assertNever } from '@axhxrx/assert-never` such that when developing locally in our repo, that directly imports the TypeScript source code from the local version of the library, e.g. `libs/ts/assert-never/mod.ts`. But, outside of our repo, that import statement just works normally and would resolve to the published version of the library (usually, a package in the NPM package registry).

There's (a little) more to using a monorepo/megarepo with TypeScript, but that's the fundamental mechanism we are interested in here. This mechanism is provided by TypeScript itself. It is the key to how [Nx has traditionally managed monorepos](https://nx.dev/concepts/integrated-vs-package-based#integrated-repos), it can be used with Turborepo (although they [now recommend some Node.js-specific alternative fuckery](https://turbo.build/repo/docs/guides/tools/typescript#use-nodejs-subpath-imports-instead-of-typescript-compiler-paths)), and it [works with Bun without any additional configuration](https://bun.sh/docs/runtime/typescript#path-mapping).

But it has never worked with Deno, and likely never will, because Deno has gone all-in on [import maps](https://docs.deno.com/runtime/manual/basics/import_maps), a different mechanism to do the same thing. So using Deno in a typical TypeScript monorepo has always been painful, and not-super-useful. It can be done, but the other problem historically has been Deno's insistence on non-insane import statements.

"Non-insane import statements" are those that import a file by its actual filename, and do not omit the file extension or (even more insanely) use an imaginary file extension.

```ts
// e.g. the to import the file "EgressPortal.ts" from the same directory:

// sane:
import { EgressPortal } from './EgressPortal.ts';

// not sane: 
import { EgressPortal } from './EgressPortal';

// not even remotely sane:
import { EgressPortal } from './EgressPortal.js';
```

Any developer familiar with TypeScript well understands how we got into this situation, though, and that part is boring and irrelevant to the present discussion, other than to say that Deno's principled stand on "you may not import things that don't actually exist" was the primary pain point of trying to use Deno and the legacy Node.js ecosystem at the same time, in the same monorepo.

### The 🐔/🥚 Deno/TypeScript monorepo problem

So you couldn't use the same TypeScript code in Deno projects and non-Deno Node (or Node-adjacent) projects. If you omitted the `.ts` in your imports, Deno didn't work. If you added the `.ts`, Node and everything else didn't work.

But then! A couple things changed:

1. Deno caved, ever so slightly, and gave us "[unstable sloppy imports](https://docs.deno.com/runtime/manual/tools/unstable_flags#--unstable-sloppy-imports)".

Woohoo! Finally, Deno could consume normal TypeScript code. So Nx monorepo libraries, or whatever kind of monorepo libs you might have going on, started working in Deno.

Although... the cascade of warnings that results is pretty annoying:

```text
➜  nozomi git:(main) ✗ deno run --unstable-sloppy-imports mod.ts 
Warning Sloppy imports are not recommended and have a negative impact on performance.
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:1:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:2:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:3:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:4:15
Warning Sloppy module resolution (hint: specify path to index.ts file in directory instead)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:5:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:6:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:7:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:8:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:9:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:10:15
Warning Sloppy module resolution (hint: specify path to index.ts file in directory instead)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:11:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:12:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:13:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:14:15
Warning Sloppy module resolution (hint: specify path to index.ts file in directory instead)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/index.ts:15:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/lib/Configurable.ts:1:56
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/lib/Constructable.ts:1:21
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/lib/date/index.ts:1:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/lib/filterObject.ts:1:38
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/lib/iterable/index.ts:1:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/lib/resolve/index.ts:1:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/lib/resolve/index.ts:2:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/lib/resolve/index.ts:3:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/lib/web/index.ts:1:15
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/lib/resolve/Resolvable.ts:11:32
Warning Sloppy module resolution (hint: add .ts extension)
    at file:///CODE/axhxrx-mmxxv/libs/ts/core/src/lib/resolve/resolve.ts:1:32
➜  nozomi git:(main) ✗ 
```

2. TypeScript added the [`allowImportingTsExtensions`](https://www.typescriptlang.org/tsconfig/#allowImportingTsExtensions) option!

*Oh fuck yeah*, you might have been thinking as you read that in the TypeScript 5.0 release notes, until you read the next sentence which states that you can only use this when you change other configurations such that TypeScript's compiler no longer actually compiles your code. So now you need a bundler, but OK that makes sense.

Hey, Deno can actually bundle TypeScript code, right?! Oh, no, they are [taking that out](https://docs.deno.com/runtime/manual/tools/bundler). Hmm.

Well... maybe could use [esbuild](https://esbuild.github.io)? Or, there is also [Bun](https://bun.sh), which is a "runtime" somewhat similar to Deno (but more Nody and less progressive) and it includes a bundler. Or there is the nascent [`deno_emit`](https://github.com/denoland/deno_emit) thing.

OK so after fucking around a little bit, it was clear that it is at least *technically possible* now to have a megarepo with multiple library projects, written in TypeScript, that:

1. Use non-insane imports with the `.ts` extension.
2. Can be run with Deno.
3. Can be run with Bun.
4. Can be run with Node, if you bundle them first (with esbuild or Bun or whatever, it seems like there are several options).
5. Can import from each other normally, within the megarepo, via a combination of TypeScript path mappings (`compiler_options.paths`) **and** equivalent entries in `import_map.json`
6. Can be (optionally) published individually to [JSR.io](https://jsr.io), and therefore also be consumed by legacy Node.js apps and code via JSR's [npm compatibility layer](https://jsr.io/docs/npm-compatibility).

As of this writing as of 2024-06-16 it is still not quite clear:

7. Is the amount of the configuration needed to make this work going to be a deal-breaker? 
8. Will it *really* work in an existing "enterprise" monorepo with 100s of projects including things like Angular apps, Jest tests, and shit like that with lots of legacy dependencies and tools that aren't yet down with ESM?

Well... only one way to find out! 🚀
