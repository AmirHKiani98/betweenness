import "../App.css";
export function NumberInput({ id, label, value, onChange, min, max, step, className = '' }) {
    return (
        <input
          type="number"
          id={id}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className={className}
        />
    );
  }