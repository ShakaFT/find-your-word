# This script send a message on Discord webhook
# First parameter : 'success' or 'fail'
# Second parameter : Message
echo $DEPLOYMENT_DISCORD_WEBHOOK
TITLE="Find Your Word - Web App Deployment"
if [ $1 == "success" ]; then
    COLOR=65280 # green
    DESCRIPTION="Web App successfully deployed!"
else
    COLOR=16711680 # red
    DESCRIPTION="Web App deployment failed..."
fi

curl -H "Content-Type: application/json" -X POST -d '{
    "embeds": [{
        "color": "'"$COLOR"'",
        "title": "'"$TITLE"'",
        "description": "'"$DESCRIPTION"'",
        "fields": [
            {
                "name": "",
                "value": "'"$2"'" 
            },
            {
                "name": "",
                "value": "'"$(date '+%d/%m/%Y %H:%M:%S')"'" 
            }
        ]
    }]
}' $DEPLOYMENT_DISCORD_WEBHOOK
