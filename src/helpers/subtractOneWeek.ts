export function subtractOneWeek(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 7);
    return newDate;
}