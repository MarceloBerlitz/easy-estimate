### get wsl ip

`ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'`
