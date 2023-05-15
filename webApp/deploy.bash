# This script deploys web application

function reset {
    git reset --hard
    exit 1
}

# Check if repo has been committed
if [[ -n $(git status --porcelain) ]]; then
    echo "Exit, you didn't commit your files"
    exit 1
fi

# Reset git if user use CTRL+C
trap reset SIGINT

# Active environment variables in .env file (useful if we run the script locally)
if [ -f '.env' ]; then
    export $(cat .env | xargs) >/dev/null 2>&1
fi

# Replace dev API url by prod url
sed -i '' 's;PRODUCTION:.*;PRODUCTION: true;' src/environments/environment.ts

# Build app
ng build --configuration=production

# deploy app
firebase deploy

# Replace dev API url by prod url
sed -i '' 's;PRODUCTION:.*;PRODUCTION: false;' src/environments/environment.ts

if [ `echo $?` != 0 ]; then
    echo 'An error occured during deployment of application...'
    ./discord.bash 'fail' 'Firebase failed to deploy web app'
    exit 1
fi

echo "Web App successfully deployed !"
./discord.bash 'success'
exit 0
