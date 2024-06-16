import { assertEquals } from 'jsr:@std/assert';
import { dateToFormat, isDateStringFormat } from './dateToFormat.ts';

const testTimezoneOffset = -540; // JST

const testDate = new Date('1975-01-01T02:00:00Z');

const formattedDates = {
  'YYYY-MM-DD': '1975-01-01',
  'YYYY-MM-DD HH:mm': '1975-01-01 11:00',
  'YYYY-MM-DD HH:mm:ss': '1975-01-01 11:00:00',
  YYYYMMDD: '19750101',
};

Deno.test('format a date', () =>
{
  for (const [format, expected] of Object.entries(formattedDates))
  {
    if (isDateStringFormat(format))
    {
      const result = dateToFormat(format, testDate, testTimezoneOffset);
      assertEquals(result, expected);
    }
    else
    {
      throw new Error(`Not a date format: ${format}`);
    }
  }
});

Deno.test('fail to format the JavaScript bogus date object', () =>
{
  const x = new Date('invalid-date-string');
  const result = dateToFormat('YYYY-MM-DD', x, testTimezoneOffset);
  assertEquals(result, 'ERR_INVALID_DATE_BRO');
});
