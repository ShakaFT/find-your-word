# This script is used to deploy REST API by Render

# Discord message details
TITLE="Find Your Word - REST API Deployment"
FAILED_DESCRIPTION="REST API deployment failed..."
SUCCESS_DESCRIPTION="REST API successfully deployed!"

# Active environment variables in .env file (useful if we run the script locally)
if [ -f ".env" ]; then
    export $(cat .env | xargs) >/dev/null 2>&1
fi

echo "Will run tests of REST API"
npm run test

TESTS_RESULT=`echo $?`
if [ $TESTS_RESULT != 0 ]; then
    echo "\nAn error occured during tests...\n"
    ./discord.bash "$DEPLOYMENT_DISCORD_WEBHOOK" "$TITLE" "$FAILED_DESCRIPTION" \
    "Unit tests failed. [Click here](https://dashboard.render.com/web/srv-ch95d16kobicv5rntc80/events) to see error details."
    exit 1
fi

echo "\nAll tests passed!\n"
echo "\nWill deploy REST API Documentation\n"

DOCUMENTATION_STATUS=`curl --write-out %{http_code} --silent --output /dev/null \
    -H "Authorization: Bearer $SWAGGER_TOKEN" -H "Content-Type: application/yaml" \
    --data-binary @documentation.yaml $SWAGGER_URL`

if [ $DOCUMENTATION_STATUS -lt 200 ] || [ 299 -lt $DOCUMENTATION_STATUS ]; then
    echo "\nAn error occured during documentation deployment...\n"
    ./discord.bash "$DEPLOYMENT_DISCORD_WEBHOOK" "$TITLE" "$FAILED_DESCRIPTION" "Failed to deploy REST API documentation..."
    exit 1
fi

echo "\nDocumentation has been deployed!\n"
echo "\nWill deploy REST API\n"

./discord.bash "$DEPLOYMENT_DISCORD_WEBHOOK" "$TITLE" "$SUCCESS_DESCRIPTION"

npm run start
exit `echo $?`