export const getFormattedDate = (startDate, endDate) => {
  if (!startDate) {
    return null;
  }
  let formatted = new Date(startDate).toLocaleDateString('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'utc',
  });
  if (endDate) {
    const firstHalf = new Date(startDate).toLocaleDateString('en', {
      month: 'long',
      day: '2-digit',
      timeZone: 'utc',
    });
    const secondHalf = new Date(endDate).toLocaleDateString('en', {
      day: '2-digit',
      timeZone: 'utc',
    });
    const thirdHalf = new Date(endDate).getFullYear();
    formatted = `${firstHalf} - ${secondHalf}, ${thirdHalf}`;
  }
  return formatted;
};
