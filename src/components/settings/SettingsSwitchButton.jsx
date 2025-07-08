const SettingsSwitchButton = ({ id, checked, onChange }) => {
return (
  <>
    <label htmlFor={id} className="relative inline-block w-11 h-6 cursor-pointer">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={() => onChange((prev) => !prev)}
      className="sr-only peer"
    />
    <div className="absolute inset-0 bg-gray-600 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
    <div
      className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"
    ></div>
    </label>
  </>
  );
};

export default SettingsSwitchButton;