# This script is used to deploy REST API by Render

# Active environment variables in .env file (useful if we run the script locally)
export $(cat .env | xargs) >/dev/null 2>&1

echo "Will run tests of REST API"
npm run test

TESTS_RESULT=`echo $?`
if [ $TESTS_RESULT != 0 ]; then
    echo "\nAn error occured during tests...\n"
    exit 1
fi

echo "\nAll tests passed!\n"
echo "\nWill deploy REST API Documentation\n"

DOCUMENTATION_STATUS=`curl --write-out %{http_code} --silent --output /dev/null \
    -H "Authorization: Bearer $SWAGGER_TOKEN" -H "Content-Type: application/yaml" \
    --data-binary @documentation.yaml $SWAGGER_URL`

if ( $DOCUMENTATION_STATUS < 200 || 299 < $DOCUMENTATION_STATUS ); then
    echo "\nAn error occured during documentation deployment...\n"
    exit 1
fi

echo "\nDocumentation has been deployed!\n"
echo "\nWill deploy REST API\n"

npm run start
exit `echo $?`