import { useState, useEffect } from "react";
import { useSettingsContext } from "../context/SettingsContext";
import { Pencil, Save } from "lucide-react";
import SettingsSwitchButton from "../components/settings/SettingsSwitchButton";

export default function Settings() {
  const { settings, saveSettings, isLoading } = useSettingsContext();

  const [trackerStartDate, setTrackerStartDate] = useState("");
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState("");

  const [isEditableInTracker, setIsEditableInTracker] = useState(true);
  const [isColorCoded, setIsColorCoded] = useState(true);
  const [isRowColored, setIsRowColored] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading && settings) {
      setTrackerStartDate(settings.trackerStartDate);
      setIsEditableInTracker(settings.isEditableInTracker);
      setIsColorCoded(settings.isColorCoded);
      setIsRowColored(settings.isRowColored);
      setHasInitialized(true);
    }
  }, [isLoading, settings]);

  const handleEditClick = () => {
    setIsEditingDate(true);
  };

  const handleSaveClick = () => {
    if (!tempDate || tempDate === trackerStartDate) {
      setIsEditingDate(false);
      setTempDate("");
      return;
    }

    const parsedDate = new Date(tempDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsedDate.setHours(0, 0, 0, 0);

    const isValidDate = !isNaN(parsedDate.getTime());

    if (!isValidDate) {
      alert("Please select a valid date.");
      return;
    }

    if (parsedDate > today) {
      alert("Date cannot be in the future.");
      return;
    }

    setTrackerStartDate(tempDate);
    saveSettings({ trackerStartDate: tempDate });
    setIsEditingDate(false);
    setTempDate("");
  };

  useEffect(() => {
    if (hasInitialized) saveSettings({ trackerStartDate });
  }, [trackerStartDate]);

  useEffect(() => {
    if (hasInitialized) saveSettings({ isEditableInTracker });
  }, [isEditableInTracker]);

  useEffect(() => {
    if (hasInitialized) saveSettings({ isColorCoded });
  }, [isColorCoded]);

  useEffect(() => {
    if (hasInitialized) saveSettings({ isRowColored });
  }, [isRowColored]);

  if (isLoading || !hasInitialized) {
    return <div className="text-white text-center py-6">Loading settings...</div>;
  }

  return (
    <div className="py-6 px-4 lg:px-64 mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-[#1e1e1e] rounded shadow space-y-4 p-4">
        <div className="flex items-center justify-between gap-3 pb-2">
          <label>Tracker Start Date</label>

          {!isEditingDate ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-200">
                {new Date(trackerStartDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <button
                onClick={handleEditClick}
                className="text-blue-500 hover:text-blue-400 cursor-pointer"
              >
                <Pencil size={16} />
              </button>
            </div>
            ) : (
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={tempDate || trackerStartDate || ""}
                onChange={(e) => setTempDate(e.target.value)}
                max={new Date().toLocaleDateString("en-CA")}
                required
                className="bg-[#121212] text-sm w-[8rem] h-[1.5rem] text-white p-2 rounded border border-gray-600 hover:border-blue-500 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer 
                  [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
              <button
                onClick={handleSaveClick}
                className="text-blue-500 hover:text-blue-400 cursor-pointer"
              >
                <Save size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pb-2">
          <label htmlFor="editableToggle">Enable Editing in Tracker</label>
          <SettingsSwitchButton
            id="editableToggle"
            checked={isEditableInTracker}
            onChange={setIsEditableInTracker}
          />
        </div>

        <div className="flex items-center justify-between pb-2">
          <label htmlFor="colorCodedToggle">Color Coded Habits</label>
          <SettingsSwitchButton
            id="colorCodedToggle"
            checked={isColorCoded}
            onChange={setIsColorCoded}
          />
        </div>

        {isColorCoded && (
          <div className="flex items-center justify-between">
            <label htmlFor="rowColored">Colored Rows</label>
            <SettingsSwitchButton
              id="rowColored"
              checked={isRowColored}
              onChange={setIsRowColored}
            />
          </div>
        )}
      </div>
    </div>
  );
}