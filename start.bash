# This script run Web App & REST API at the same time
cd restAPI && ./start.bash > /dev/null && cd - &
cd webApp && ./start.bash
