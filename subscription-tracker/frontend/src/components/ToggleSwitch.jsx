import React from 'react';

export const ToggleSwitch = ({ checked, onChange, disabled = false, id, label }) => {
  return (
    <div className="toggle-switch-wrapper">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label || 'Toggle active status'}
        disabled={disabled}
        className={`toggle-switch ${checked ? 'toggle-active' : 'toggle-paused'}`}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span className="toggle-thumb" />
      </button>
      <span className={`toggle-label ${checked ? 'text-active' : 'text-paused'}`}>
        {checked ? 'Active' : 'Paused'}
      </span>
    </div>
  );
};
