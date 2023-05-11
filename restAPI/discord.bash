# This script send a message on Discord webhook
# First parameter : Discord webhook url
# Second parameter : Title
# First parameter : Description
# First parameter : Message

curl -H "Content-Type: application/json" -X POST -d '{
    "embeds": [{
        "title": "'"$2"'",
        "description": "'"$3"'",
        "fields": [
        {
            "name": "",
            "value": "'"$4"'" 
        },
        {
            "name": "",
            "value": "'"$(date +'%d/%m/%Y %H:%M:%S')"'" 
        }
        ]
    }]
}' $1