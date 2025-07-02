import { useState, useEffect } from "react";
import { getSettings, saveSettings } from "../hooks/useSettings";

export default function Settings() {
  const { trackerStartDate: initialDate, isEditableInTracker: initialEditable, isColorCoded: initialColorCoded } = getSettings();

  const [trackerStartDate, setTrackerStartDate] = useState(initialDate);
  const [isEditableInTracker, setIsEditableInTracker] = useState(initialEditable);
  const [isColorCoded, setIsColorCoded] = useState(initialColorCoded);

  useEffect(() => {
    saveSettings({ trackerStartDate });
  }, [trackerStartDate]);

  useEffect(() => {
    saveSettings({ isEditableInTracker });
  }, [isEditableInTracker]);

  useEffect(() => {
    saveSettings({ isColorCoded });
  }, [isColorCoded]);

  return (
    <div className="py-4 px-4 lg:px-64 mx-auto text-white">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <div className="bg-[#1e1e1e] rounded shadow space-y-4 p-4">
            <div className="flex items-center justify-between">
                <label>Tracker Start Date</label>
                <input
                type="date"
                onFocus={(e) => e.target.blur()}
                onClick={(e) => e.currentTarget.showPicker()}
                value={trackerStartDate}
                onChange={(e) => setTrackerStartDate(e.target.value)}
                max={new Date().toLocaleDateString("en-CA")}
                required
                className="bg-[#121212] text-sm w-[12rem] text-white p-2 rounded border border-gray-600 hover:border-blue-500 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer 
                [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="editableToggle">Enable Editing in Tracker</label>
              <div className="flex items-center">
                <label htmlFor="editableToggle" className="relative inline-block w-11 h-6 cursor-pointer">
                  <input
                    id="editableToggle"
                    type="checkbox"
                    checked={isEditableInTracker}
                    onChange={() => setIsEditableInTracker((prev) => !prev)}
                    className="sr-only peer"
                  />
                  <div className="absolute inset-0 bg-gray-600 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
                  <div
                    className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"
                  ></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="editableToggle">Color Coded</label>
              <div className="flex items-center">
                <label htmlFor="colorCodedToggle" className="relative inline-block w-11 h-6 cursor-pointer">
                  <input
                    id="colorCodedToggle"
                    type="checkbox"
                    checked={isColorCoded}
                    onChange={() => setIsColorCoded((prev) => !prev)}
                    className="sr-only peer"
                  />
                  <div className="absolute inset-0 bg-gray-600 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
                  <div
                    className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"
                  ></div>
                </label>
              </div>
            </div>
        </div>
    </div>
  );
}