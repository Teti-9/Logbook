export default function zodError(obj) {
    const result = `${obj._zod.def[0].message}, check '${obj._zod.def[0].path}' field.`
    return result
}