function StarRating({ value = 0, onChange, readonly = false, size = 22 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`stars${readonly ? " readonly" : ""}`}>
      {stars.map((star) => (
        <span
          key={star}
          style={{ fontSize: size }}
          onClick={() => !readonly && onChange?.(star)}
        >
          {star <= value ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
}

export default StarRating;
