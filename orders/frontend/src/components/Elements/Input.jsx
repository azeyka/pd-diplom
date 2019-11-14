import React from "react";
import PropTypes from "prop-types";

function Input({
  className,
  type,
  name,
  value,
  onChange,
  required,
  error,
  disabled,
  children
}) {
  return (
    <div className={className}>
      <label htmlFor={name}>{children}</label>
      <input
        type={type}
        className={error ? "form-control invalid" : "form-control"}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
      <div className={error ? "invalid-feedback visible" : "invalid-feedback"}>
        {error}
      </div>
    </div>
  );
}

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool
};

export default Input;
