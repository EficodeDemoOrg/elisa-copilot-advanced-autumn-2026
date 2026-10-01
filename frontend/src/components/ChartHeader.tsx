import { useEffect, useState } from 'react';

type Props = {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
};

export function ChartHeader({ startDate, endDate, onChange }: Props) {
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);

  useEffect(() => setStart(startDate), [startDate]);
  useEffect(() => setEnd(endDate), [endDate]);

  const commit = (s: string, e: string) => {
    if (s && e && s <= e && (s !== startDate || e !== endDate)) {
      onChange(s, e);
    }
  };

  return (
    <div className="chart-header">
      <label>
        Chart start
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          onBlur={() => commit(start, end)}
        />
      </label>
      <label>
        Chart end
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          onBlur={() => commit(start, end)}
        />
      </label>
      {start > end && <span className="error">End must be on or after start.</span>}
    </div>
  );
}
