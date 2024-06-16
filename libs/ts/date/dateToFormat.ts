import { assertNever } from '@axhxrx/assert-never';
import { dateToIS08601WithTimeZoneOffset } from './dateToIS08601WithTimeZoneOffset.ts';

/**
 All supported date format strings.
 */
export const allSupportedDateFormats = [
  'YYYY-MM-DD',
  'YYYY-MM-DD HH:mm',
  'YYYY-MM-DD HH:mm:ss',
  'YYYYMMDD', // because sometimes... you know :-/
] as const;

/**
 Type expressing all supported date format strings. This only includes formats we actually use.
 */
export type DateStringFormat = typeof allSupportedDateFormats[number];

/**
 Type guard that checks if a value is a `DateStringFormat`.
 */
export const isDateStringFormat = (value: unknown): value is DateStringFormat =>
{
  return (
    typeof value === 'string'
    && allSupportedDateFormats.includes(value as DateStringFormat)
  );
};

/**
 Returns a string expressing a date (the current date, unless otherwise specified) in a particular format.

 In the "JavaScript bogus date object" case, returns `'ERR_INVALID_DATE_BRO'`;
 */
export const dateToFormat = (
  format: DateStringFormat,
  date?: Date,
  localTimezoneOffset?: number,
): string =>
{
  const fullDateString = dateToIS08601WithTimeZoneOffset(date, localTimezoneOffset);

  if (fullDateString.startsWith('ERR'))
  {
    return fullDateString;
  }

  const [dateString, timeString] = fullDateString.split('T');
  const [year, month, day] = dateString.split('-');

  const timeComponents = timeString.split(':');
  const hour = timeComponents[0];
  const minute = timeComponents[1];
  const second = timeComponents[2].substring(0, 2);
  // const _twoDigitYear = year.slice(2); // NEVER!
  const twoDigitMonth = month;
  const twoDigitDay = day;
  const twoDigitHour = hour;
  const twoDigitMinute = minute;
  const twoDigitSecond = second;

  switch (format)
  {
    case 'YYYY-MM-DD':
      return `${year}-${twoDigitMonth}-${twoDigitDay}`;
    case 'YYYY-MM-DD HH:mm':
      return `${year}-${twoDigitMonth}-${twoDigitDay} ${twoDigitHour}:${twoDigitMinute}`;
    case 'YYYY-MM-DD HH:mm:ss':
      return `${year}-${twoDigitMonth}-${twoDigitDay} ${twoDigitHour}:${twoDigitMinute}:${twoDigitSecond}`;
    case 'YYYYMMDD':
      return `${year}${twoDigitMonth}${twoDigitDay}`;
    default:
      assertNever(format);
      throw new Error(
        `DateUtils.to(): invariant violation: illegal format: ${format}`,
      );
  }
};
