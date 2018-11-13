import React from "react";
export default ({
  options,
  id,
  onChange,
  disabled = false,
  value = "0:00"
}) => (
  <select id={id} onChange={onChange} disabled={disabled} value={value}>
    {options.map(hour => <option value={hour}>{hour}</option>)}
  </select>
);
