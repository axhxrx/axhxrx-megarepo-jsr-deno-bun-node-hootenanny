# @axhxrx/date

A minimal utility library for formatting dates. Example:

```ts 
const backThen = dateToFormat('YYYY-MM-DD', new Date('1975-01-01T02:00:00Z'));
// '1975-01-01'

const rightNow = dateToFormat('YYYY-MM-DD');
// same thing, only later in time...
```
