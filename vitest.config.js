export default {
    test: {
        environment: 'node',
        pool: 'threads',
        globalSetup: ['./src/tests/global-setup.js'],
        setupFiles: ['./src/tests/setup.js'],
        fileParallelism: false
    }
}