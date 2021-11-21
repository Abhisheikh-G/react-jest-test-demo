import React from 'react';

const Input = ({ id, label, type, handleChange, errors }) => {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        className={`form-control ${errors[id] ? `is-invalid` : ``}`}
        type={type}
        name={id}
        id={id}
        onChange={handleChange}
      />
      {errors[id] && <div className="invalid-feedback mt-1">{errors[id]}</div>}
    </div>
  );
};

export default Input;
