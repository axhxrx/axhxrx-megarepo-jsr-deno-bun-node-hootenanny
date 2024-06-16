# assert-never

Utility function for [exhaustiveness checking](http://www.typescriptlang.org/docs/handbook/advanced-types.html#exhaustiveness-checkin). Use it to get compile-time errors for non-exhaustive `switch` statements. Example:

## usage

 ```ts
 let state: "happy" | "sad" | "mad";
 switch(state) {
   case "happy": return "😀";
   case "sad":   return "😢";
   // case "mad" : return "😠";
   default:
     assertNever(state);
       // ERROR:
       // Argument of type '"mad"' is not assignable
       // to parameter of type 'never'.ts(2345)
       //
       // Uncomment the third case to fix the error by making the switch exhaustive.
 }
 ```

## test

```text
deno test

Check file:///Volumes/STUFF/CODE/axhxrx-megarepo-jsr-deno-bun-node-hootenanny/libs/ts/assert-never/assertNever.test.ts
running 1 test from ./assertNever.test.ts
assertNever ...
  should exist ... ok (0ms)
  should work ... ok (0ms)
assertNever ... ok (1ms)

ok | 1 passed (2 steps) | 0 failed (1ms)
```

## publish

```text
deno publish
```

## License

[WTFPL](http://www.wtfpl.net/txt/copying/)

## 🧨 boom

NOTE: This lib is part of a proof-of-concept test of using JSR.io packages in a monorepo/megarepo context.

The experimental repo is here: <https://github.com/axhxrx/axhxrx-megarepo-jsr-deno-bun-node-hootenanny>
