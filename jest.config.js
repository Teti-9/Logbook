import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

export default {
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js']
}