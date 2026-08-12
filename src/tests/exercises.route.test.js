import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from './setup.js'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../server.js'

const signToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })

describe('api/exercises (integration)', () => {
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

        await prisma.exercises.createMany({
            data: [
                { name: 'bench press', series: 2, topset_weight: 50, topset_reps: 8, divisionId: 1, userId: user.id },
                { name: 'tbar', series: 2, topset_weight: 50, topset_reps: 8, divisionId: 2, userId: user.id }
            ]
        })
    })

    it('rejects requests without a valid token.', async () => {
        const res = await request(app).get('/api/exercises')
        expect(res.status).toBe(401)
    })

    it('missing fields, invalid shape.', async () => {
        const res = await request(app)
            .post('/api/exercises')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'tbar', series: 2 })

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toMatch(/invalid/i)
    })

    it('returns division not found.', async () => {
        const res = await request(app)
            .post('/api/exercises')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'tbar', series: 2, topset_weight: 50, topset_reps: 8, divisionId: 5 })

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Division not found.')
    })

    it('successfully creates an exercise.', async () => {
        const res = await request(app)
            .post('/api/exercises')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'pull up', series: 2, topset_weight: 40, topset_reps: 8, divisionId: 2 })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data.message).toBe('Exercise successfully created.')
    })

    it('get exercise not-found path.', async () => {
        const res = await request(app)
            .get(`/api/exercises/${10}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.body.success).toBe(false)
        expect(res.status).toBe(404)
        expect(res.body.data).toBe('Exercise not found.')
    })

    it('returns paginated exercises for the authenticated user.', async () => {
        const res = await request(app)
            .get('/api/exercises')
            .set('Authorization', `Bearer ${token}`)
            .query({ page: 1, limit: 2 })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data.exercises).toHaveLength(2)
    })

    it('return exercise by id.', async () => {
        const res = await request(app)
            .get(`/api/exercises/${1}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('does not leak another users exercises.', async () => {
        const otherUser = await prisma.user.create({
            data: { email: 'teti2@example.com', password: '1234' }
        })

        const otherDivision = await prisma.division.create({ data: { name: 'push', day: "monday", userId: otherUser.id } })
        await prisma.exercises.create({ data: { name: 'peck deck', series: 2, topset_weight: 50, topset_reps: 8, divisionId: otherDivision.id, userId: otherUser.id } })

        const res = await request(app)
            .get('/api/exercises')
            .set('Authorization', `Bearer ${token}`)

        const names = res.body.data.exercises.map(d => d.name)
        expect(names).not.toContain('peck deck')
    })

    it('delete exercise not-found path.', async () => {
        const res = await request(app)
            .delete(`/api/exercises/${10}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.body.success).toBe(false)
        expect(res.status).toBe(404)
        expect(res.body.data).toBe('Exercise not found.')
    })

    it('delete populated exercise with logbook.', async () => {
        await prisma.logbook.create({ data: { exerciseId: 1, topset_weight: 50, topset_reps: 8, backoff_weight: 40, backoff_reps: 8, userId: user.id } })

        const res = await request(app)
            .delete(`/api/exercises/${1}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.body.success).toBe(false)
        expect(res.status).toBe(409)
        expect(res.body.data).toBe('Exercise contains unsynced logbooks, please delete or sync them before hand.')
    })

    it('successfully delete an exercise.', async () => {
        const res = await request(app)
            .delete(`/api/exercises/${1}`)
            .set('Authorization', `Bearer ${token}`)

        const deletedExercise = await prisma.exercises.findFirst({
            where: { id: 1 }
        })

        expect(res.body.success).toBe(true)
        expect(res.status).toBe(200)
        expect(res.body.data.message).toBe('Exercise successfully deleted.')
        expect(deletedExercise?.isDeleted).toBe(true)
        expect(deletedExercise?.deletedAt).toBeInstanceOf(Date)
    })
})
