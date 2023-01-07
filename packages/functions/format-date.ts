import { DateTime } from "luxon";

export function formatDate(date: Date) {
  return (
    date &&
    DateTime.fromJSDate(date)
      .setLocale("fr-FR")
      .toLocaleString(DateTime.DATETIME_SHORT)
  );
}
