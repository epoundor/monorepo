import { DateTime, type DurationLikeObject } from "luxon";

const units: (keyof DurationLikeObject)[] = [
  "year",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "second",
];

export function timeAgo(date: Date) {
  let dateTime =
    date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date);
  const diff = dateTime.diffNow().shiftTo(...units);
  const unit: Intl.RelativeTimeFormatUnit =
    (units.find(
      (unit) => diff.get(unit) !== 0
    ) as Intl.RelativeTimeFormatUnit) || "second";

  const relativeFormatter = new Intl.RelativeTimeFormat("fr", {
    numeric: "auto",
  });

  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
}
