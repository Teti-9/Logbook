import express from 'express'
import validateId from "../schemas/ids.js"
import validateFields from "../schemas/fields.js"
import zodError from "../utils/zoderror.js"

const UserRouter = (userService) => {
    const router = express.Router()

    router.get('/users/:id', async (req, res) => {

        const id = validateId(Number(req.params.id))

        if (!id.success) {
            throw new Error(zodError(id.error))
        }

        const result = await userService.getUserById(id.data.id)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.post('/users', async (req, res) => {

        const fieldConfig = { email: "string", password: "string" }

        const result = validateFields(req.body, fieldConfig)

        if (!result.success) {
            throw new Error(zodError(result.error))
        }

        const userCreated = await userService.createUser(req.body)

        return res.status(201).json({
            success: true,
            data: userCreated
        })

    })

    router.post('/logins', async (req, res) => {

        const fieldConfig = { email: "string", password: "string" }

        const result = validateFields(req.body, fieldConfig)

        if (!result.success) {
            throw new Error(zodError(result.error))
        }

        const logedUser = await userService.loginUser(req.body)

        return res.status(200).json({
            success: true,
            data: logedUser
        })

    })

    return router
}

export default UserRouter
