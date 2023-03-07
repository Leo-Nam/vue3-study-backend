module.exports = {
  apps: [
    {
      name: 'roadAddr-collector',
      script: './app2.js',
      instances: 2,
      exec_mode: 'cluster',
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
      max_memory_restart: '500M',
    },
  ],
}
