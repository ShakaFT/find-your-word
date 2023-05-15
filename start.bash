# This script run Web App & REST API at the same time

# Run REST API in the background
cd restAPI && npm install > /dev/null && ./start.bash > /dev/null && cd - &

# Run webApp
cd webApp && npm install > /dev/null && ./start.bash
