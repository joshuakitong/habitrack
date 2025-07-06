import { useState, useEffect } from "react";
import { getSettings, saveSettings } from "../hooks/useSettings";
import SwitchButton from "../components/settings/SwitchButton";

export default function Settings() {
  const { 
    trackerStartDate: initialDate, 
    isEditableInTracker: initialEditable, 
    isColorCoded: initialColorCoded,
    isRowColored: initialRowColor,
   } = getSettings();

  const [trackerStartDate, setTrackerStartDate] = useState(initialDate);
  const [isEditableInTracker, setIsEditableInTracker] = useState(initialEditable);
  const [isColorCoded, setIsColorCoded] = useState(initialColorCoded);
  const [isRowColored, setIsRowColored] = useState(initialRowColor);

  useEffect(() => {
    saveSettings({ trackerStartDate });
  }, [trackerStartDate]);

  useEffect(() => {
    saveSettings({ isEditableInTracker });
  }, [isEditableInTracker]);

  useEffect(() => {
    saveSettings({ isColorCoded });
  }, [isColorCoded]);

  useEffect(() => {
    saveSettings({ isRowColored });
  }, [isRowColored]);

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
              <SwitchButton id="editableToggle" checked={isEditableInTracker} onChange={setIsEditableInTracker} />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="colorCodedToggle">Color Coded Habits</label>
              <SwitchButton id="colorCodedToggle" checked={isColorCoded} onChange={setIsColorCoded} />
            </div>

            {isColorCoded &&(
              <div className="flex items-center justify-between">
                <label htmlFor="rowColored">Colored Rows</label>
                <SwitchButton id="rowColored" checked={isRowColored} onChange={setIsRowColored} />
              </div>
            )}
        </div>
    </div>
  );
}