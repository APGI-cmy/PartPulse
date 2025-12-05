import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

export default function Select({
  label,
  error,
  helperText,
  options,
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || `select-${crypto.randomUUID()}`;
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        className={`
          block w-full px-3 py-2 
          border border-gray-300 rounded-md shadow-sm
          bg-white
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-error focus:ring-error focus:border-error' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
