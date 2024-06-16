/**
 * Render an [ISO 8601](https://xkcd.com/1179/) style date in the browser's local timezone,
 * e.g. `2021-03-06T16:45:14+09:00`.
 *
 * This was originally developed to have an unambiguous and machine-parseable (but still fairly human-friendly) date-formatting mechanism for viewing and copying log data.
 *
 * However, it might be generally useful any time you want an ISO 8601 date.
 */
export const dateToIS08601WithTimeZoneOffset = (
  date: Date = new Date(),
  timeZoneOffset?: number,
): string =>
{
  // We can't do better than this in JS, if we don't want to throw an error...
  if (isNaN(date.getTime()))
  {
    return 'ERR_INVALID_DATE_BRO';
  }

  // Thanks, Obama! https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript

  const actualOffset = date.getTimezoneOffset();
  const offset = timeZoneOffset ?? actualOffset;
  const difference = offset - actualOffset;
  const offsetDate = new Date(date.getTime() - (difference * 60 * 1000));

  const tzo = -offset;
  const dif = tzo >= 0 ? '+' : '-';
  const pad = (num: number) =>
  {
    const norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
  };

  return (
    offsetDate.getFullYear()
    + '-'
    + pad(offsetDate.getMonth() + 1)
    + '-'
    + pad(offsetDate.getDate())
    + 'T'
    + pad(offsetDate.getHours())
    + ':'
    + pad(offsetDate.getMinutes())
    + ':'
    + pad(offsetDate.getSeconds())
    + dif
    + pad(tzo / 60)
    + ':'
    + pad(tzo % 60)
  );
};
