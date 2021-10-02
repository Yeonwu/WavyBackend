module.exports = {
    apps: [
        {
            name: 'dev-wavy-api-server',
            script: './dist/main.js',
            instances: '-1',
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: 'dev',
            },
        },
    ],
};
