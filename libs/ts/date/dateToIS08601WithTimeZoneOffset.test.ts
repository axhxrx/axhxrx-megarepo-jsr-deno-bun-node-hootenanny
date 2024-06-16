import { assertEquals } from 'jsr:@std/assert';
import { dateToIS08601WithTimeZoneOffset } from './dateToIS08601WithTimeZoneOffset.ts';

const testTimezoneOffset = -540; // JST

Deno.test('format a valid date', () =>
{
  const date = new Date('2023-10-01T12:00:00Z');
  const result = dateToIS08601WithTimeZoneOffset(date, testTimezoneOffset);
  assertEquals(result, '2023-10-01T21:00:00+09:00');
});

Deno.test('format date with positive non-hour offset', () =>
{
  const date = new Date('2023-10-01T12:00:00+05:30');
  const result = dateToIS08601WithTimeZoneOffset(date, testTimezoneOffset);
  assertEquals(result, '2023-10-01T15:30:00+09:00');
});

Deno.test('format date with negative offset', () =>
{
  const date = new Date('2023-10-01T12:00:00-04:00');
  const result = dateToIS08601WithTimeZoneOffset(date, testTimezoneOffset);
  assertEquals(result, '2023-10-02T01:00:00+09:00');
});

Deno.test('return ERR_INVALID_DATE_BRO for invalid JS Date object', () =>
{
  const date = new Date('invalid-date-string');
  const result = dateToIS08601WithTimeZoneOffset(date, testTimezoneOffset);
  assertEquals(result, 'ERR_INVALID_DATE_BRO');
});

Deno.test('format ignoring milliseconds', () =>
{
  const date = new Date('2023-10-01T12:00:00.123Z');
  const result = dateToIS08601WithTimeZoneOffset(date, testTimezoneOffset);
  assertEquals(result, '2023-10-01T21:00:00+09:00');
});

Deno.test('format a valid date with an overridden time zone offset', () =>
{
  const date = new Date('2023-10-01T12:00:00Z');
  const result = dateToIS08601WithTimeZoneOffset(date, 540);
  assertEquals(result, '2023-10-01T03:00:00-09:00');
});

Deno.test('format a valid date with an overridden time zone offset into the previous day', () =>
{
  const date = new Date('2023-10-01T01:00:00Z');
  const result = dateToIS08601WithTimeZoneOffset(date, 540);
  assertEquals(result, '2023-09-30T16:00:00-09:00');
});

Deno.test('format a valid date with an overridden time zone offset into the next day', () =>
{
  const date = new Date('2023-10-01T23:00:00Z');
  const result = dateToIS08601WithTimeZoneOffset(date, -480);
  assertEquals(result, '2023-10-02T07:00:00+08:00');
});
