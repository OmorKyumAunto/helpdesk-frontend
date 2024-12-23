export function formatTimeDifference(start: any, end: any) {
  const diffInMinutes = end.diff(start, "minute");
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""}`;
  }

  const diffInHours = end.diff(start, "hour");
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""}`;
  }

  const diffInDays = end.diff(start, "day");
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""}`;
  }

  const diffInMonths = end.diff(start, "month");
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""}`;
  }

  const diffInYears = end.diff(start, "year");
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""}`;
}
