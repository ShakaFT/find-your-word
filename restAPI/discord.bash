# This script send a message on Discord webhook
# First parameter : Title
# Second parameter : Description
# Third parameter : Message

if [ $DEPLOYMENT_DISCORD_MESSAGE == true ]; then
    exit 0
fi

curl -H "Content-Type: application/json" -X POST -d '{
    "embeds": [{
        "title": "'"$1"'",
        "description": "'"$2"'",
        "fields": [
        {
            "name": "",
            "value": "'"$3"'" 
        },
        {
            "name": "",
            "value": "'"$(date +'%d/%m/%Y %H:%M:%S')"'" 
        }
        ]
    }]
}' $DEPLOYMENT_DISCORD_WEBHOOK

export DEPLOYMENT_DISCORD_MESSAGE=true