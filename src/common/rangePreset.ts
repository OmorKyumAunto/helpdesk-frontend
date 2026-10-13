import { TimeRangePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";

export interface DateRangeOption {
  label: string;
  // Short label for the quick-range chips; options without one are only
  // offered in the picker's dropdown.
  chip?: string;
  // Computed on demand, not at import time, so a tab left open past midnight
  // still gets the right "Today". Every range is inclusive and ends today.
  range: () => [Dayjs, Dayjs];
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { label: "Today", chip: "Today", range: () => [dayjs(), dayjs()] },
  {
    label: "Yesterday",
    range: () => [dayjs().subtract(1, "day"), dayjs().subtract(1, "day")],
  },
  {
    label: "Last 7 Days",
    chip: "7 Days",
    range: () => [dayjs().subtract(6, "day"), dayjs()],
  },
  {
    label: "Last 14 Days",
    range: () => [dayjs().subtract(13, "day"), dayjs()],
  },
  {
    label: "Last 30 Days",
    chip: "30 Days",
    range: () => [dayjs().subtract(29, "day"), dayjs()],
  },
  {
    label: "Last 90 Days",
    chip: "90 Days",
    range: () => [dayjs().subtract(89, "day"), dayjs()],
  },
  {
    label: "Last 6 Months",
    chip: "6 Months",
    range: () => [dayjs().subtract(6, "month").add(1, "day"), dayjs()],
  },
  {
    label: "Last 1 Year",
    chip: "1 Year",
    range: () => [dayjs().subtract(1, "year").add(1, "day"), dayjs()],
  },
  {
    label: "This Year",
    chip: "This Year",
    range: () => [dayjs().startOf("year"), dayjs()],
  },
];

export const rangePreset: TimeRangePickerProps["presets"] =
  DATE_RANGE_OPTIONS.map(({ label, range }) => ({ label, value: range }));
