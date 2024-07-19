import { getDayName } from "./getDayName";

export function truncateDateString(dateString: Date) {

    const date = dateString.getDate()
    const month = dateString.getMonth()
    const dayName = getDayName(dateString)

    return `${dayName} - ${date}.${month}.`
}