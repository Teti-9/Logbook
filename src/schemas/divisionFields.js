import * as z from "zod"

const FIELD_TYPES = {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
    email: z.string().email(),
    date: z.string().date(),
}

function buildSchema(fields) {
    const shape = Object.fromEntries(
        Object.entries(fields).map(([key, type]) => [key, FIELD_TYPES[type]])
    )
    return z.object(shape)
}

export default function validateFields(data, fieldConfig) {
    const schema = buildSchema(fieldConfig)
    return schema.safeParse(data)
}