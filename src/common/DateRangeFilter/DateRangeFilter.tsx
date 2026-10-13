import { DatePicker, Typography } from "antd";
import dayjs from "dayjs";
import styled from "styled-components";
import { DATE_RANGE_OPTIONS, rangePreset } from "../rangePreset";

const { Text } = Typography;

// What the report APIs expect (zod-validated server side).
const VALUE_FORMAT = "YYYY-MM-DD";

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

// Same chip as the task-list filters (modules/task/page/SuperAdminTaskList.tsx).
const Chip = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  border: 1px solid ${({ $active }) => ($active ? "#2563eb" : "#e2e8f0")};
  background: ${({ $active }) => ($active ? "#2563eb" : "#f8fafc")};
  color: ${({ $active }) => ($active ? "#fff" : "#475569")};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s,
    transform 0.15s;
  white-space: nowrap;
  &:hover {
    border-color: #2563eb;
    background: ${({ $active }) => ($active ? "#1d4ed8" : "#eff6ff")};
    color: ${({ $active }) => ($active ? "#fff" : "#1d4ed8")};
  }
  &:active {
    transform: scale(0.96);
  }
  &:focus-visible {
    outline: 2px solid #93c5fd;
    outline-offset: 1px;
  }
`;

const PickerRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
`;

const Readout = styled.span<{ $empty: boolean }>`
  font-size: 12px;
  color: ${({ $empty }) => ($empty ? "#94a3b8" : "#475569")};
  white-space: nowrap;
  b {
    color: #1e293b;
    font-weight: 600;
  }
`;

interface Props {
  label: string;
  start?: string | null;
  end?: string | null;
  // Emits YYYY-MM-DD strings, or undefined for both when cleared.
  onChange: (start?: string, end?: string) => void;
}

/**
 * Report date range: one-click range chips over a regular RangePicker.
 * The active chip is derived from start/end, so picking the same range in the
 * picker lights the chip and picking custom dates clears it.
 */
const DateRangeFilter = ({ label, start, end, onChange }: Props) => {
  const hasRange = Boolean(start && end);

  const activeChip = hasRange
    ? DATE_RANGE_OPTIONS.find(({ chip, range }) => {
        if (!chip) return false;
        const [from, to] = range();
        return (
          from.format(VALUE_FORMAT) === start && to.format(VALUE_FORMAT) === end
        );
      })?.label
    : undefined;

  const days = hasRange ? dayjs(end).diff(dayjs(start), "day") + 1 : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Text
        style={{
          fontSize: "clamp(11px, 1.5vw, 12px)",
          fontWeight: 500,
          color: "#595959",
        }}
      >
        {label}
      </Text>

      <ChipRow>
        {DATE_RANGE_OPTIONS.filter((option) => option.chip).map((option) => {
          const active = option.label === activeChip;
          return (
            <Chip
              key={option.label}
              type="button"
              $active={active}
              aria-pressed={active}
              onClick={() => {
                // Clicking the active chip again clears the range.
                if (active) return onChange(undefined, undefined);
                const [from, to] = option.range();
                onChange(from.format(VALUE_FORMAT), to.format(VALUE_FORMAT));
              }}
            >
              {option.chip}
            </Chip>
          );
        })}
      </ChipRow>

      <PickerRow>
        <DatePicker.RangePicker
          presets={rangePreset}
          format="DD-MM-YYYY"
          style={{ width: 280, maxWidth: "100%" }}
          placeholder={["Start Date", "End Date"]}
          // null (not undefined) keeps the picker controlled, so "Clear
          // filters" empties it instead of leaving the old dates showing.
          value={hasRange ? [dayjs(start), dayjs(end)] : null}
          onChange={(dates) =>
            dates?.[0] && dates?.[1]
              ? onChange(
                  dates[0].format(VALUE_FORMAT),
                  dates[1].format(VALUE_FORMAT)
                )
              : onChange(undefined, undefined)
          }
          disabledDate={(current) => current && current > dayjs().endOf("day")}
        />
        <Readout $empty={!hasRange}>
          {hasRange ? (
            <>
              <b>
                {dayjs(start).format("DD MMM YYYY")} –{" "}
                {dayjs(end).format("DD MMM YYYY")}
              </b>{" "}
              · {days} {days === 1 ? "day" : "days"}
            </>
          ) : (
            "All dates"
          )}
        </Readout>
      </PickerRow>
    </div>
  );
};

export default DateRangeFilter;
