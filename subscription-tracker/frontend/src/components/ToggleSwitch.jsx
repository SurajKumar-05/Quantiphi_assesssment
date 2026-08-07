import React from 'react';

export const ToggleSwitch = ({ checked, onChange, disabled = false, id, label }) => {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label || 'Toggle active status'}
      disabled={disabled}
      className={`tactile-toggle-btn ${checked ? 'state-active' : 'state-paused'}`}
      onClick={() => !disabled && onChange(!checked)}
    >
      <span className="toggle-track">
        <span className="toggle-knob">
          {checked ? 'ON' : 'OFF'}
        </span>
      </span>
      <span className="toggle-text">
        {checked ? 'ACTIVE' : 'PAUSED'}
      </span>
    </button>
  );
};
