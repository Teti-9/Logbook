import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from './setup.js'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../server.js'

const signToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })

describe('GET /api/divisions (integration)', () => {
    let user, token

    beforeEach(async () => {
        user = await prisma.user.create({
            data: { email: 'teti@example.com', password: '123' }
        })
        token = signToken(user.id)

        await prisma.division.createMany({
            data: [
                { name: 'Push', day: "monday", userId: user.id },
                { name: 'Pull', day: "tuesday", userId: user.id }
            ]
        })
    })

    it('returns paginated divisions for the authenticated user', async () => {
        const res = await request(app)
            .get('/api/divisions')
            .set('Authorization', `Bearer ${token}`)
            .query({ page: 1, limit: 2 })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data.divisions).toHaveLength(2)
    })

    it('does not leak another users divisions', async () => {
        const otherUser = await prisma.user.create({
            data: { email: 'teti2@example.com', password: '1234' }
        })
        await prisma.division.create({ data: { name: 'Legs', day: "thursday", userId: otherUser.id } })

        const res = await request(app)
            .get('/api/divisions')
            .set('Authorization', `Bearer ${token}`)

        const names = res.body.data.divisions.map(d => d.name)
        expect(names).not.toContain('Legs')
    })

    it('rejects requests without a valid token', async () => {
        const res = await request(app).get('/api/divisions')
        expect(res.status).toBe(401)
    })
})
