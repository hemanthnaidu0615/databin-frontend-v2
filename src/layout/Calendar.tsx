import { useState } from "react";

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function DatePicker() {
  const [open, setOpen] = useState(false);            // panel visible?
  const [page, setPage] = useState(new Date());       // month being shown
  const [value, setValue] = useState<Date | null>(null);

  const y = page.getFullYear();
  const m = page.getMonth();
  const firstWeekday = (new Date(y, m, 1).getDay() || 7) - 1;
  const count = new Date(y, m + 1, 0).getDate();
  const blanks = Array(firstWeekday).fill(null);
  const days   = [...blanks, ...Array.from({ length: count }, (_, i) => i + 1)];

  const sameDay = (d: number) =>
    value &&
    value.getDate() === d &&
    value.getMonth() === m &&
    value.getFullYear() === y;

  return (
    <div className="w-full max-w-sm">
      {/* FIELD */}
      <input
        readOnly
        onClick={() => setOpen((o) => !o)}
        placeholder="Pick a date"
        value={value ? value.toLocaleDateString() : ""}
        className="w-full rounded-md border px-3 py-2 focus:border-blue-500
                   dark:bg-dark-2 dark:text-white"
      />

      {/* POP-UP */}
      {open && (
        <div className="mt-2 w-full rounded-lg border p-4 shadow-lg
                        dark:bg-dark-2">
          {/* header */}
          <div className="mb-2 flex items-center justify-between">
            <button
              onClick={() =>
                setPage((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
              }
              className="rounded p-2 hover:bg-gray-100 dark:hover:bg-dark"
            >
              ‹
            </button>

            <span className="font-medium">
              {page.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>

            <button
              onClick={() =>
                setPage((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
              }
              className="rounded p-2 hover:bg-gray-100 dark:hover:bg-dark"
            >
              ›
            </button>
          </div>

          {/* weekdays */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold
                          text-gray-500 dark:text-gray-400">
            {weekdays.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          {/* days */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((d, i) =>
              d ? (
                <button
                  key={i}
                  onClick={() => {
                    setValue(new Date(y, m, d));
                    setOpen(false);
                  }}
                  className={`aspect-square w-full rounded-md
                              hover:bg-blue-100 dark:hover:bg-dark
                              ${
                                sameDay(d)
                                  ? "bg-blue-600 text-white dark:bg-blue-500"
                                  : "text-gray-800 dark:text-gray-100"
                              }`}
                >
                  {d}
                </button>
              ) : (
                <div key={i} />
              ),
            )}
          </div>

          {/* footer */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setValue(null);
                setOpen(false);
              }}
              className="w-full rounded-md border py-2 font-medium
                         hover:bg-gray-100 dark:hover:bg-dark"
            >
              Remove
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full rounded-md bg-blue-600 py-2 font-medium text-white
                         hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
