function Input({ label, error, as = "input", options, ...rest }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {as === "select" ? (
        <select className="select" {...rest}>
          {options}
        </select>
      ) : (
        <input className="input" {...rest} />
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default Input;
