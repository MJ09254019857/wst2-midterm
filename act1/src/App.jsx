import { useState, useEffect } from "react";

const TOTAL = 40;

function AttendanceControls({ present, onIncrease, onDecrease }) {
  return (
    <div className="row">
      <button onClick={onIncrease} disabled={present >= TOTAL}>+ Present</button>
      <button onClick={onDecrease} disabled={present <= 0}>– Present</button>
    </div>
  );
}

function AttendanceSummary({ present, total }) {
  const absent = total - present;
  const rate = ((present / total) * 100).toFixed(1);
  return (
    <div>
      <p>Present: <strong>{present}</strong></p>
      <p>Absent: <strong>{absent}</strong></p>
      <p>Attendance rate: <strong>{rate}%</strong></p>
    </div>
  );
}

function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return <p>Time now: {now.toLocaleTimeString()}</p>;
}

export default function App() {
  const [present, setPresent] = useState(0);

  useEffect(() => {
    document.title = `Present: ${present}/${TOTAL}`;
  }, [present]);

  const increase = () => setPresent((p) => Math.min(TOTAL, p + 1));
  const decrease = () => setPresent((p) => Math.max(0, p - 1));
  const reset = () => setPresent(() => 0);

  return (
    <div>
      <h1>Attendance Tracker</h1>
      <div className="card">
        <LiveClock />
        <AttendanceControls present={present} onIncrease={increase} onDecrease={decrease} />
        <AttendanceSummary present={present} total={TOTAL} />
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}