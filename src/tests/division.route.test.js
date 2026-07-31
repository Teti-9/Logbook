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

    it('rejects requests without a valid token.', async () => {
        const res = await request(app).get('/api/divisions')
        expect(res.status).toBe(401)
    })

    it('missing fields, invalid shape.', async () => {
        const res = await request(app)
            .post('/api/divisions')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Upper' })

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toMatch(/invalid/i)
    })

    it('day must be a valid enum.', async () => {
        const res = await request(app)
            .post('/api/divisions')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Push', day: 'notvalid' })

        expect(res.status).toBe(409)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toMatch(/invalid/i)
    })

    it('a training split for this day already exists.', async () => {
        const res = await request(app)
            .post('/api/divisions')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Push', day: 'monday' })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('A training split for this day already exists.')
    })

    it('successfully creates a division.', async () => {
        const res = await request(app)
            .post('/api/divisions')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Upper', day: 'Friday' })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data.message).toBe('Training split successfully created.')
    })

    it('returns no divisions found if no divisions.', async () => {
        user = await prisma.user.create({
            data: { email: 'teti3@example.com', password: '123' }
        })
        token = signToken(user.id)

        const res = await request(app)
            .get('/api/divisions')
            .set('Authorization', `Bearer ${token}`)

        expect(res.body.success).toBe(false)
        expect(res.status).toBe(404)
    })

    it('get division not-found path.', async () => {
        const res = await request(app)
            .get(`/api/divisions/${10}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.body.success).toBe(false)
        expect(res.status).toBe(404)
        expect(res.body.data).toBe('Division not found.')
    })

    it('returns paginated divisions for the authenticated user.', async () => {
        const res = await request(app)
            .get('/api/divisions')
            .set('Authorization', `Bearer ${token}`)
            .query({ page: 1, limit: 2 })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data.divisions).toHaveLength(2)
    })

    it('return division by id.', async () => {
        const res = await request(app)
            .get(`/api/divisions/${1}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('does not leak another users divisions.', async () => {
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

    it('delete division not-found path.', async () => {
        const res = await request(app)
            .delete(`/api/divisions/${10}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.body.success).toBe(false)
        expect(res.status).toBe(404)
        expect(res.body.data).toBe('Division not found.')
    })

    it('successfully delete a division.', async () => {
        const res = await request(app)
            .delete(`/api/divisions/${1}`)
            .set('Authorization', `Bearer ${token}`)

        const deletedDivision = await prisma.division.findFirst({
            where: { id: 1 }
        })

        expect(res.body.success).toBe(true)
        expect(res.status).toBe(200)
        expect(res.body.data.message).toBe('Division successfully deleted.')
        expect(deletedDivision?.isDeleted).toBe(true)
        expect(deletedDivision?.deletedAt).toBeInstanceOf(Date)
    })
})
