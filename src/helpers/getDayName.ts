export function getDayName(date: Date) {
    const day = date.getDay()
    const weekDays = ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota']

    return weekDays[day]
}