import express from 'express'
import validateId from "../schemas/ids.js"
import validateFields from "../schemas/fields.js"
import zodError from "../utils/zoderror.js"

const UserRouter = (userService, refreshTokenService) => {
    const router = express.Router()

    /**
 * @swagger
 * 
 * /api/auth/users/{id}:
 *   get:
 *     summary: Return a single user.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID.
 *     responses:
 *       200:
 *         description: Success.
 *       404:
 *         description: User not found.
 *       500:
 *         description: There was an internal server error.
 * 
 * /api/auth/registers:
 *   post:
 *     summary: Create a new user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User successfully created.
 *       500:
 *         description: There was an internal server error.
 * 
 * /api/auth/logins:
 *   post:
 *     summary: Authenticate a user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Success.
 *       401:
 *         description: Invalid password.
 *       404:
 *         description: Email not found.
 *       500:
 *         description: There was an internal server error.
 * 
 * /api/auth/refreshs:
 *   post:
 *     summary: Refresh the access token.
 *     tags: [User]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token cookie.
 *     responses:
 *       200:
 *         description: Success.
 *       401:
 *         description: Refresh token not supplied, expired, or invalid.
 *       500:
 *         description: There was an internal server error.
 * 
 * /api/auth/logouts:
 *   post:
 *     summary: Revoke the refresh token and log out the user.
 *     tags: [User]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token cookie.
 *     responses:
 *       200:
 *         description: Success.
 *       401:
 *         description: Refresh token not supplied or invalid.
 *       500:
 *         description: There was an internal server error.
 */

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

    router.post('/registers', async (req, res) => {

        const fieldConfig = { email: "email", password: "password" }

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

        const loggedUser = await userService.loginUser(req.body)

        if (loggedUser) {
            res.cookie('refreshToken', loggedUser.refreshToken, refreshTokenService._cookieOptions())
        }

        return res.status(200).json({
            success: true,
            data: loggedUser
        })

    })

    router.post('/refreshs', async (req, res) => {

        const fieldConfig = { refreshToken: "string" }

        if (!req.cookies.refreshToken)
            return res.status(401).json({
                success: false,
                data: 'Refresh token not supplied.'
            })

        const result = validateFields({ refreshToken: req.cookies.refreshToken }, fieldConfig)

        if (!result.success) {
            throw new Error(zodError(result.error))
        }

        const token = await refreshTokenService.refreshToken(req.cookies.refreshToken)

        if (token) {
            res.cookie('refreshToken', token.refreshToken, refreshTokenService._cookieOptions())
        }

        return res.status(200).json({
            success: true,
            data: token
        })

    })

    router.post('/logouts', async (req, res) => {

        const fieldConfig = { refreshToken: "string" }

        if (!req.cookies.refreshToken)
            return res.status(401).json({
                success: false,
                data: 'Refresh token not supplied.'
            })

        const result = validateFields({ refreshToken: req.cookies.refreshToken }, fieldConfig)

        if (!result.success) {
            throw new Error(zodError(result.error))
        }

        const logoutUser = await refreshTokenService.logoutUser(req.cookies.refreshToken)

        if (logoutUser) {
            res.clearCookie('refreshToken', refreshTokenService._cookieOptions({ clear: true }))
        }

        return res.status(200).json({
            success: true,
            data: logoutUser
        })

    })

    return router
}

export default UserRouter
