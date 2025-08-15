export const tableFormat = (date: string | Date) => {
  // Create a Date object (handles both strings and Date objects)
  const utcDate = new Date(date);
  
  // Apply IST offset (UTC+5:30) in minutes
  const istOffsetMinutes = 330; // 5 hours * 60 + 30 minutes
  const istDate = new Date(utcDate.getTime() + istOffsetMinutes * 60 * 1000);
  
  // Format as YYYY-MM-DD
  return istDate.toISOString().split('T')[0];
};