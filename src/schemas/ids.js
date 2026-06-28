import * as z from "zod"

const schema = z.object({
    id: z.number(),
})

export default function validateId(id) {
    return schema.safeParse({ id })
}