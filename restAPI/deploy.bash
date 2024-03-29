# This script is used to deploy REST API by Google App Engine

function reset {
    git reset --hard
    exit 1
}

# Reset git if user use CTRL+C
trap reset SIGINT

# Check if repo has been committed
if [[ -n $(git status --porcelain) ]]; then
    echo "Exit, you didn't commit your files"
    exit 1
fi

# Active environment variables in .env file (useful if we run the script locally)
if [ -f ".env" ]; then
    export $(cat .env | xargs) >/dev/null 2>&1
fi

# REST API Tests
echo "Will run tests of REST API"
npm run test

if [ `echo $?` != 0 ]; then
    echo "\nAn error occured during tests...\n"
    ./discord.bash fail "Unit tests failed..."
    exit 1
fi

echo "\nAll tests passed!\n"
echo "\nWill deploy REST API Documentation\n"

# REST API Documentation Deployment
DOCUMENTATION_STATUS=`curl --write-out %{http_code} --silent --output /dev/null \
    -H "Authorization: Bearer $SWAGGER_TOKEN" -H "Content-Type: application/yaml" \
    --data-binary @documentation.yaml $SWAGGER_URL`

if [ $DOCUMENTATION_STATUS -lt 200 ] || [ 299 -lt $DOCUMENTATION_STATUS ]; then
    echo "\nAn error occured during REST API documentation deployment...\n"
    ./discord.bash fail "Failed to deploy REST API documentation..."
    exit 1
fi

echo "\nDocumentation has been deployed!\n"
echo "\nWill deploy REST API\n"

# Set environment variable to app.yaml
if ! grep -q "env_variables:" app.yaml; then
    sed -i '' '$a\
env_variables:' app.yaml
fi

sed -i '' 's;env_variables:;&\n  API_KEY: '"$API_KEY"';' app.yaml
sed -i '' 's;env_variables:;&\n  CORS_ORIGIN: '"$WEB_APP_URL"';' app.yaml
sed -i '' 's;env_variables:;&\n  DB_CONNECTION: '"$DB_CONNECTION"';' app.yaml
sed -i '' 's;env_variables:;&\n  MONITORING_DISCORD_WEBHOOK: '"$MONITORING_DISCORD_WEBHOOK"';' app.yaml
sed -i '' 's;env_variables:;&\n  PRODUCTION: true;' app.yaml
sed -i '' 's;env_variables:;&\n  PROJECT_ID: '"$PROJECT_ID"';' app.yaml
sed -i '' 's;env_variables:;&\n  SENDGRID_API_KEY: '"$SENDGRID_API_KEY"';' app.yaml
sed -i '' 's;env_variables:;&\n  WEB_APP_URL: '"$WEB_APP_URL"';' app.yaml

# REST API Deployment
gcloud config set project $PROJECT_ID
gcloud app deploy --quiet

git reset --hard

if [ `echo $?` != 0 ]; then
    ./discord.bash fail "Failed to deploy REST API documentation... [Click here](https://console.cloud.google.com/logs/query?hl=fr&project='$PROJECT_ID') to see logs."
    exit 1
fi

echo "REST API successfully deployed !"
./discord.bash success
exit 0