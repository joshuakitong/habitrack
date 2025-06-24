import { useState } from "react";
import { colorMap } from "../utils/colors";

const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
const colors = Object.keys(colorMap);

const HabitsForm = ({ onSubmit, habit }) => {
  const [formData, setFormData] = useState({
    name: habit?.name || "",
    description: habit?.description || "",
    days: habit?.days || [],
    color: habit?.color || colors[0],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Name is required.");

    const finalData = {
      ...formData,
      days: formData.days.length === 0 ? [...daysOfWeek] : formData.days,
      isChecked: false,
    };

    onSubmit(finalData);

    setFormData({ name: "", description: "", days: [], color: colors[0] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <h2 className="text-xl font-bold text-center">{habit ? "Edit Habit" : "Add Habit"}</h2>
      <div>
        <label className="block mb-1 font-medium">Name *</label>
        <input
          type="text"
          value={formData.name}
          maxLength={64}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          value={formData.description}
          maxLength={500}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 text-right">
          {formData.description.length}/500 characters
        </p>
      </div>

      <div>
        <label className="block mb-2 font-medium">Repeat On</label>
        <div className="flex gap-2 flex-wrap">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`cursor-pointer px-3 py-1 rounded-full text-sm border 
                ${
                  formData.days.includes(day)
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-gray-700 border-gray-600 text-gray-300"
                }`}
            >
              {day}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          No selection = every day.
        </p>
      </div>
      
      <div>
        <label className="block mb-1 font-semibold">Color</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {colors.map((clr) => (
            <button
              key={clr}
              type="button"
              onClick={() => handleChange("color", clr)}
              className={`cursor-pointer w-8 h-8 rounded-full border-4 transition
                ${formData.color === clr ? "border-white" : "border-transparent"}`}
              style={{ backgroundColor: colorMap[clr] }}
              title={clr}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="cursor-pointer bg-blue-600 px-4 py-2 rounded text-white font-semibold hover:bg-blue-700"
      >
        {habit ? "Update Habit" : "Create Habit"}
      </button>
    </form>
  );
};

export default HabitsForm;