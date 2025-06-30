import { useState, useEffect } from "react";
import { getSettings, saveSettings } from "../hooks/settings";

export default function Settings() {
  const { trackerStartDate: initialDate, isEditableInTracker: initialEditable } = getSettings();

  const [trackerStartDate, setTrackerStartDate] = useState(initialDate);
  const [isEditableInTracker, setIsEditableInTracker] = useState(initialEditable);

  useEffect(() => {
    saveSettings({ trackerStartDate });
  }, [trackerStartDate]);

  useEffect(() => {
    saveSettings({ isEditableInTracker });
  }, [isEditableInTracker]);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 text-white">
        <h1 className="text-2xl font-bold">Settings</h1>

        <div className="bg-gray-700 p-4 rounded shadow flex items-center justify-between">
            <label>Tracker Start Date</label>
            <input
            type="date"
            onFocus={(e) => e.target.blur()}
            onClick={(e) => e.currentTarget.showPicker()}
            value={trackerStartDate}
            onChange={(e) => setTrackerStartDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            required
            className="bg-gray-800 text-sm w-[12rem] text-white p-2 rounded border border-gray-600 hover:border-blue-500 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer 
            [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
        </div>

        <div className="bg-gray-700 p-4 rounded shadow flex items-center justify-between">
            <label>Enable Editing in Tracker</label>
            <input
            type="checkbox"
            id="editable"
            className="w-5 h-5 accent-blue-600 cursor-pointer"
            checked={isEditableInTracker}
            onChange={() => setIsEditableInTracker((prev) => !prev)}
            />
        </div>
    </div>
  );
}