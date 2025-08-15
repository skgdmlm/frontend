export const tableFormat = (date: string | Date) => {
    console.log('date: ', date);
    const d = new Date(date);
    console.log('d: ', d);
    const year = d.getFullYear();
    console.log('year: ', year);
    const month = String(d.getMonth() + 1).padStart(2, '0'); // month is 0-based
    console.log('month: ', month);
    const day = String(d.getDate()).padStart(2, '0');
    console.log('day: ', day);

    return `${year}-${month}-${day}`;
};
