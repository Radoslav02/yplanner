import { getDayName } from "./getDayName";

export function truncateDateString(dateString: Date) {

    const date = dateString.getDate()
    const month = (dateString.getMonth() + 1).toString().padStart(2, '0')
    const year = dateString.getFullYear()
    const dayName = getDayName(dateString)

    return `${dayName} - ${date}.${month}.${year}`
}