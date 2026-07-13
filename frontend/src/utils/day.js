export default function Day(date) {

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const day = date
    const now = day ? new Date(day) : null
    const dayName = now ? days[now.getDay()] : null

    return dayName
}