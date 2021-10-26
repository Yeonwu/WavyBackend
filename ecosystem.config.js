module.exports = {
    apps: [
        {
            name: 'dev-app',
            script: './dist/main.js',
            instances: '-1',
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: 'dev',
            },
        },
        {
            name: 'test-app',
            script: './dist/main.js',
            instances: '-1',
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: 'test',
            },
        },
        {
            name: 'prod-app',
            script: './dist/main.js',
            instances: '-1',
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: 'prod',
            },
        },
    ],
};
