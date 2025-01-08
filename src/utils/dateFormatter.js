const formatDate = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    weekday: "short", // "Mon"
    year: "numeric", // "2024"
    month: "short", // "Dec"
    day: "numeric", // "30"
    hour: "2-digit", // "07"
    minute: "2-digit", // "30"
    hour12: true, // 12-hour format
  });
};

export { formatDate };
