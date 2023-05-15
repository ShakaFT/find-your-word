# This script deploys web application

# Set environment variables
export DEPLOYMENT_DISCORD_WEBHOOK=$(echo `grep 'DEPLOYMENT_DISCORD_WEBHOOK' 'src/environments/environment.ts'` | sed -E 's/.*"(.+)".*/\1/')

# Replace dev API url by prod url
sed -i '' 's;PRODUCTION:.*;PRODUCTION: true,;' src/environments/environment.ts

# Build app
ng build --configuration=production

# deploy app
firebase deploy
DEPLOY_RESULT=`echo $?`

# Replace dev API url by prod url
sed -i '' 's;PRODUCTION:.*;PRODUCTION: false,;' src/environments/environment.ts

if [ $DEPLOY_RESULT != 0 ]; then
    echo 'An error occured during deployment of application...'
    ./discord.bash 'fail' 'Firebase failed to deploy web app'
    exit 1
fi

echo "Web App successfully deployed !"
./discord.bash 'success'
exit 0
