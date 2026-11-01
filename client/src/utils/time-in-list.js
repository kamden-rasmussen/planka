/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

const MS_IN_DAY = 24 * 60 * 60 * 1000;
const DAYS_IN_MONTH = 30;
const DAYS_IN_YEAR = 360;
const WARNING_DAYS = 30;
const DANGER_DAYS = 90;

export const getDaysInList = (listChangedAt, now = Date.now()) =>
  Math.max(0, Math.floor((now - new Date(listChangedAt).getTime()) / MS_IN_DAY));

// 0-29 days: "12d", 30-359 days: "1m".."11m", 360+ days: "1y", "2y", ...
export const formatShortDuration = (days) => {
  if (days < DAYS_IN_MONTH) {
    return `${days}d`;
  }

  if (days < DAYS_IN_YEAR) {
    return `${Math.floor(days / DAYS_IN_MONTH)}m`;
  }

  return `${Math.floor(days / DAYS_IN_YEAR)}y`;
};

export const getSeverity = (days) => {
  if (days >= DANGER_DAYS) {
    return 'danger';
  }

  if (days >= WARNING_DAYS) {
    return 'warning';
  }

  return null;
};

const addMonths = (date, count) => {
  const year = date.getFullYear();
  const month = date.getMonth() + count;
  const lastDay = new Date(year, month + 1, 0).getDate();

  return new Date(
    year,
    month,
    Math.min(date.getDate(), lastDay),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  );
};

const wholeDaysBetween = (from, to) => {
  const days = Math.round(
    (Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) -
      Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) /
      MS_IN_DAY,
  );

  const isTimeBefore =
    to.getHours() * 3600000 +
      to.getMinutes() * 60000 +
      to.getSeconds() * 1000 +
      to.getMilliseconds() <
    from.getHours() * 3600000 +
      from.getMinutes() * 60000 +
      from.getSeconds() * 1000 +
      from.getMilliseconds();

  return isTimeBefore ? days - 1 : days;
};

// Calendar difference, e.g. "1y 2m 3d". Leading zero units are dropped, days always shown.
export const formatExactDuration = (from, to = new Date()) => {
  const start = new Date(from);
  const end = new Date(to);

  if (end <= start) {
    return '0d';
  }

  let totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();

  if (addMonths(start, totalMonths) > end) {
    totalMonths -= 1;
  }

  const days = wholeDaysBetween(addMonths(start, totalMonths), end);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts = [];

  if (years > 0) {
    parts.push(`${years}y`);
  }

  if (years > 0 || months > 0) {
    parts.push(`${months}m`);
  }

  parts.push(`${days}d`);

  return parts.join(' ');
};
