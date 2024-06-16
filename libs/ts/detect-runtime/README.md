# detect-runtime

Tries to detect the runtime environment (e.g. Deno, Bun, or Node.js).

## Usage

On the command line:

```text
# Deno
deno run index.ts

# Bun
bun run index.ts

# Node
bun build index.ts --outdir=dist && node dist/index.js
```

From TypeScript code

```ts
const 肉まん = detectRuntime();
if (肉まん.isBun)
{
  console.log(`I knew it!! This is Bun ${肉まん.version}.`);
}

```

## test

This lib tests with Bun, not Deno (just to prove we can do either).

```text
bun test
bun test v1.1.13 (bd6a6051)

tests.bun.spec.ts:
I knew it!! This is Bun 1.1.13.
✓ the README example code  > should not have compile errors [1.15ms]

 1 pass
 0 fail
Ran 1 tests across 1 files. [69.00ms]
➜  detect-runtime git:(main) ✗ 
```

## About the source code

This mainly exists to test monorepo/megarepo setups, and to investigate how to write TypeScript code and configuration in such a way that it can be used in various different runtime/packaging contexts. This includes producing a library that can be used as-is in a monorepo context by Deno and Bun, can be bundled for use in a browser context or a Node.js context, and can be packaged as a JSR.io package. (And maybe even NPM package? 🤷‍♀️)

So anyway, like the saying goes, "this may not be useful".

```text
# Build with Bun
bun build index.ts --outdir=dist
```

## License

[WTFPL](http://www.wtfpl.net/txt/copying/)

## 🧨 boom

NOTE: This lib is part of a proof-of-concept test of using JSR.io packages in a monorepo/megarepo context.

The experimental repo is here: <https://github.com/axhxrx/axhxrx-megarepo-jsr-deno-bun-node-hootenanny>
