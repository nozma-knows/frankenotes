import { DateTime } from "luxon";

export function FormatDateShort({ date }: { date: Date }) {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_SHORT);
}

export function FormatDateTimeLong({ date }: { date: Date }) {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_FULL);
}
