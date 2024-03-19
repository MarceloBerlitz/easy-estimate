### Environment Variables

LOG_HOST = https://\*\*\*.grafana.net
LOG_USER = 123456
LOG_PWD = Loki Token
LOG_LEVEL =
NODE_ENV =

### get wsl ip

`ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'`

### Socket.io

- https://socket.io/docs/v4/connection-state-recovery
- https://socket.io/docs/v4/client-options/#auth
