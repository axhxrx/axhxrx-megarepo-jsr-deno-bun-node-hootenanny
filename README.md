# axhxrx-megarepo-jsr-deno-bun-node-hootenanny

## Problem statement (short)

Can we construct a megarepo that contains multiple, interdependent TypeScript libraries and applications, that can:

- [ ] reasonably conform to the monorepo/megarepo workflow, letting libs import from each other, and apps import from libs, without too much extra fuckery
- [ ] use non-insane imports with the `.ts` extension
- [ ] be run with Deno
- [ ] be run with Bun
- [ ] be bundled with esbuild or Bun or whatever, and then run with Node
- [ ] be published to NPM or equivalent (presumably, JSR.io)
- [ ] be (somehow, e.g. with a build step) consumed by legacy Node.js apps and Angular apps and whatnot

## Change log

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
5. Can import from each other normally, within the megarepo, via a combination of TypeScript path mappings (`compiler_options.paths`) **and** equivalent entries in `import_map.jsonc`
6. Can be (optionally) published individually to [JSR.io](https://jsr.io), and therefore also be consumed by legacy Node.js apps and code via JSR's [npm compatibility layer](https://jsr.io/docs/npm-compatibility).

As of this writing as of 2024-06-16 it is still not quite clear:

7. Is the amount of the configuration needed to make this work going to be a deal-breaker? 
8. Will it *really* work in an existing "enterprise" monorepo with 100s of projects including things like Angular apps, Jest tests, and shit like that with lots of legacy dependencies and tools that aren't yet down with ESM?

Well... only one way to find out! 🚀
