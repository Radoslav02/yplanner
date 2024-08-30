export function addOneMonth(date: Date): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);

    // Provera da li je dan promenjen zbog razlike u broju dana u mesecu
    if (newDate.getDate() < date.getDate()) {
        newDate.setDate(0); // Postavlja na poslednji dan prethodnog meseca
    }

    return newDate;
}
