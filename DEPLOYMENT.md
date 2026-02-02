# GitHub Actions Deployment Setup

## Required GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### 1. VPS_HOST

Your VPS IP address or domain name

```
Example: 123.456.789.0 or yourdomain.com
```

### 2. VPS_USERNAME

SSH username for your VPS

```
Example: root or ubuntu
```

### 3. VPS_SSH_KEY

Your private SSH key for accessing the VPS

```
How to get it:
- On your local machine: cat ~/.ssh/id_rsa
- Copy the entire content including -----BEGIN RSA PRIVATE KEY----- and -----END RSA PRIVATE KEY-----
```

### 4. VPS_PORT

SSH port (usually 22)

```
Example: 22
```

### 5. APP_PATH

Full path to your application on the VPS

```
Example: /home/ubuntu/autoguard-registry or /var/www/autoguard-registry
```

### 6. PM2_APP_NAME

The name of your PM2 process

```
How to find it: ssh into your VPS and run: pm2 list
Example: autoguard-registry or autoguard or app
```

## VPS Prerequisites

Make sure your VPS has:

1. Git installed
2. Node.js and npm installed
3. PM2 installed globally (`npm install -g pm2`)
4. Your repository cloned at the APP_PATH location
5. SSH key authentication configured

## How It Works

1. Push code to `main` branch
2. GitHub Actions triggers the workflow
3. Connects to your VPS via SSH
4. Navigates to your app directory
5. Pulls latest code from GitHub
6. Installs dependencies
7. Builds the Next.js app
8. Restarts PM2 process

## First Time Setup on VPS

```bash
# Navigate to your deployment directory
cd /path/to/deployment

# Clone your repository
git clone https://github.com/Jayank-Tiwari/autoguard-registry.git
cd autoguard-registry

# Install dependencies
npm install

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "autoguard-registry" -- start
pm2 save
pm2 startup
```

## Testing the Deployment

After setting up secrets, push a change to main:

```bash
git add .
git commit -m "Test deployment"
git push origin main
```

Check the Actions tab in your GitHub repository to see the deployment status.

## Troubleshooting

If deployment fails:

1. Check the Actions log in GitHub
2. Verify all secrets are correctly set
3. SSH into VPS manually and ensure you can run the commands
4. Check PM2 logs: `pm2 logs autoguard-registry`
5. Verify the app path exists and has proper permissions
