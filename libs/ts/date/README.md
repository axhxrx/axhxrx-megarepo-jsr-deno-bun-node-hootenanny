# @axhxrx/date

A minimal utility library for formatting dates. Example:

```ts 
const backThen = dateToFormat('YYYY-MM-DD', new Date('1975-01-01T02:00:00Z'));
// '1975-01-01'

const rightNow = dateToFormat('YYYY-MM-DD');
// same thing, only later in time...
```

NOTE: This library works, as far as that goes, but it is intended mainly for testing JSR/Deno/Bun/Node/monorepo publishing, and not intended to actually be useful. (Just so you know 😉.)

## test

```test
deno test
Check file:///Volumes/STUFF/CODE/axhxrx-megarepo-jsr-deno-bun-node-hootenanny/libs/ts/date/dateToFormat.test.ts
Check file:///Volumes/STUFF/CODE/axhxrx-megarepo-jsr-deno-bun-node-hootenanny/libs/ts/date/dateToIS08601WithTimeZoneOffset.test.ts
running 2 tests from ./dateToFormat.test.ts
format a date ... ok (1ms)
fail to format the JavaScript bogus date object ... ok (0ms)
running 8 tests from ./dateToIS08601WithTimeZoneOffset.test.ts
format a valid date ... ok (0ms)
format date with positive non-hour offset ... ok (0ms)
format date with negative offset ... ok (0ms)
return ERR_INVALID_DATE_BRO for invalid JS Date object ... ok (0ms)
format ignoring milliseconds ... ok (0ms)
format a valid date with an overridden time zone offset ... ok (0ms)
format a valid date with an overridden time zone offset into the previous day ... ok (0ms)
format a valid date with an overridden time zone offset into the next day ... ok (0ms)

ok | 10 passed | 0 failed (15ms)
```

## License

[WTFPL](http://www.wtfpl.net/txt/copying/)

## 🧨 boom

NOTE: This lib is part of a proof-of-concept test of using JSR.io packages in a monorepo/megarepo context.

The experimental repo is here: <https://github.com/axhxrx/axhxrx-megarepo-jsr-deno-bun-node-hootenanny>
