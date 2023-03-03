module.exports = {
  apps: [
    {
      name: 'vue3-study',
      script: './app.js',
      instances: 1,
      exec_mode: 'cluster',
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
      max_memory_restart: '500M',
    },
  ],
}
