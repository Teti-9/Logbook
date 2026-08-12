import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from './setup.js'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../server.js'

const signToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })

describe('api/historicals (integration)', () => {
    let user, token, new_token

    beforeEach(async () => {
        user = await prisma.user.create({
            data: { email: 'teti@example.com', password: '123' }
        })
        token = signToken(user.id)

        await prisma.division.create({ data: { name: 'push', day: "monday", userId: user.id } })
        await prisma.exercises.create({ data: { name: 'bench press', series: 2, topset_weight: 50, topset_reps: 8, divisionId: 1, userId: user.id } })

        await prisma.historical.createMany({
            data: [
                { exerciseId: 1, name: "bench press", series: 2, previous_topset_weight: 50, previous_topset_reps: 8, previous_backoff_weight: 40, previous_backoff_reps: 8, userId: user.id },
                { exerciseId: 1, name: "bench press", series: 2, previous_topset_weight: 60, previous_topset_reps: 8, previous_backoff_weight: 50, previous_backoff_reps: 8, userId: user.id }
            ]
        })
    })

    it('rejects requests without a valid token.', async () => {
        const res = await request(app).get('/api/historicals')
        expect(res.status).toBe(401)
    })

    it('returns historicals not found.', async () => {
        user = await prisma.user.create({
            data: { email: 'teti2@example.com', password: '123' }
        })
        new_token = signToken(user.id)

        const res = await request(app)
            .get('/api/historicals')
            .set('Authorization', `Bearer ${new_token}`)

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('No historical archives found.')
    })

    it('get historical not-found path.', async () => {
        const res = await request(app)
            .get(`/api/historicals/${10}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.body.success).toBe(false)
        expect(res.status).toBe(404)
        expect(res.body.data).toBe('Historical archive not found.')
    })

    it('return historical by id.', async () => {
        const res = await request(app)
            .get(`/api/historicals/${1}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('does not leak another users historicals.', async () => {
        const otherUser = await prisma.user.create({
            data: { email: 'teti2@example.com', password: '1234' }
        })

        const otherDivision = await prisma.division.create({ data: { name: 'push', day: "monday", userId: otherUser.id } })
        const otherExercise = await prisma.exercises.create({ data: { name: 'peck deck', series: 2, topset_weight: 50, topset_reps: 8, divisionId: otherDivision.id, userId: otherUser.id } })

        await prisma.historical.create({ data: { exerciseId: otherExercise.id, name: "peck deck", series: 2, previous_topset_weight: 50, previous_topset_reps: 8, previous_backoff_weight: 40, previous_backoff_reps: 8, userId: otherUser.id } })

        const res = await request(app)
            .get('/api/historicals')
            .set('Authorization', `Bearer ${token}`)

        const names = res.body.data.map(d => d.name)
        expect(names).not.toContain('peck deck')
    })

    it('delete historical not-found path.', async () => {
        const res = await request(app)
            .delete(`/api/historicals/${10}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.body.success).toBe(false)
        expect(res.status).toBe(404)
        expect(res.body.data).toBe('Historical archive not found.')
    })

    it('successfully delete an exercise.', async () => {
        const res = await request(app)
            .delete(`/api/historicals/${1}`)
            .set('Authorization', `Bearer ${token}`)

        const deletedHistorical = await prisma.historical.findFirst({
            where: { id: 1 }
        })

        expect(res.body.success).toBe(true)
        expect(res.status).toBe(200)
        expect(res.body.data.message).toBe('Historical archive successfully deleted.')
        expect(deletedHistorical?.isDeleted).toBe(true)
        expect(deletedHistorical?.deletedAt).toBeInstanceOf(Date)
    })
})
