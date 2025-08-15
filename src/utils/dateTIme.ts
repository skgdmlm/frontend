import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const tableFormat = (date: string | Date) => {
  // Explicitly parse the date as UTC first
  const utcDate = dayjs.utc(date);
  
  // Then convert to India timezone
  const indiaDate = utcDate.tz('Asia/Kolkata');
  
  // Format the date
  return indiaDate.format('YYYY-MM-DD');
};