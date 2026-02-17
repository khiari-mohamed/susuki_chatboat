module.exports = {
  apps: [{
    name: 'suzuki-backend',
    script: 'dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    env_file: '.env',
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
