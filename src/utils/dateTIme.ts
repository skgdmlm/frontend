import dayjs from 'dayjs';

export const tableFormat = (date: string | Date) => {
    return dayjs(date).format('YYYY-MM-DD');
};