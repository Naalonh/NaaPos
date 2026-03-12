import React from "react";
import "./Switch.css";

const Switch = ({
  checked,
  onChange,
  labelOn = "Active",
  labelOff = "Disabled",
}) => {
  return (
    <label className="switch-wrapper">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-slider"></span>

      <span className="switch-label">{checked ? labelOn : labelOff}</span>
    </label>
  );
};

export default Switch;
