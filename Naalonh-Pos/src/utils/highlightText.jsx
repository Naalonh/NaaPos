const highlightText = (text, query, className = "highlight") => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className={className}>
        {part}
      </span>
    ) : (
      part
    ),
  );
};

export default highlightText;
