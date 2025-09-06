# VPS Setup Guide - Drawing Gallery Site

This guide will help you deploy your Next.js drawing gallery website on a VPS (Virtual Private Server).

## Prerequisites

- VPS with Ubuntu 20.04+ or similar Linux distribution
- Domain name (optional but recommended)
- SSH access to your VPS
- Basic command line knowledge

## Step 1: Initial VPS Setup

### Connect to your VPS
```bash
ssh root@your-vps-ip-address
```

### Update the system
```bash
apt update && apt upgrade -y
```

### Create a non-root user (recommended for security)
```bash
adduser deployer
usermod -aG sudo deployer
su - deployer
```

## Step 2: Install Required Software

### Install Node.js (v18+)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Verify installation
```bash
node --version
npm --version
```

### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### Install Git
```bash
sudo apt install git -y
```

### Install Nginx (Web Server)
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 3: Setup MongoDB

### Option A: Install MongoDB locally
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option B: Use MongoDB Atlas (Cloud Database)
- Create account at https://www.mongodb.com/atlas
- Create a cluster and get connection string
- Skip local MongoDB installation

## Step 4: Deploy Your Application

### Clone your repository
```bash
cd /home/deployer
git clone https://github.com/your-username/drawing-gallery-site.git
cd drawing-gallery-site
```

### Install dependencies
```bash
npm install
```

### Create environment file
```bash
nano .env.local
```

Add the following environment variables:
```bash
# MongoDB (use local or Atlas connection string)
MONGODB_URI=mongodb://localhost:27017/drawing-gallery
# OR for Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/drawing-gallery

# NextAuth Configuration
NEXTAUTH_URL=http://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-here

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# EmailJS (optional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-emailjs-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
```

### Build the application
```bash
npm run build
```

### Test the application
```bash
npm start
```

## Step 5: Configure PM2 for Production

### Create PM2 ecosystem file
```bash
nano ecosystem.config.js
```

Add the following configuration:
```javascript
module.exports = {
  apps: [{
    name: 'drawing-gallery',
    script: 'npm',
    args: 'start',
    cwd: '/home/deployer/drawing-gallery-site',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### Start the application with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Follow the command output to enable PM2 auto-startup.

## Step 6: Configure Nginx Reverse Proxy

### Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/drawing-gallery
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/drawing-gallery /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: Setup SSL Certificate (HTTPS)

### Install Certbot
```bash
sudo apt install snapd
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### Get SSL certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts to complete SSL setup.

## Step 8: Setup Firewall

### Configure UFW firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 9: Database Setup (if using local MongoDB)

### Create database user
```bash
mongosh
```

In MongoDB shell:
```javascript
use drawing-gallery
db.createUser({
  user: "dbuser",
  pwd: "secure-password",
  roles: ["readWrite"]
})
exit
```

Update your `.env.local` with the new credentials:
```bash
MONGODB_URI=mongodb://dbuser:secure-password@localhost:27017/drawing-gallery
```

## Step 10: Final Steps

### Restart your application
```bash
pm2 restart drawing-gallery
```

### Check application status
```bash
pm2 status
pm2 logs drawing-gallery
```

### Test your website
Visit `https://your-domain.com` to verify everything is working.

## Maintenance Commands

### Update your application
```bash
cd /home/deployer/drawing-gallery-site
git pull origin main
npm install
npm run build
pm2 restart drawing-gallery
```

### Monitor logs
```bash
pm2 logs drawing-gallery
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup database (if using local MongoDB)
```bash
mongodump --db drawing-gallery --out /home/deployer/backups/$(date +%Y%m%d)
```

## Security Recommendations

1. **Change default SSH port**
2. **Disable root login**
3. **Setup fail2ban** for intrusion prevention
4. **Regular security updates**
5. **Use strong passwords** for database users
6. **Setup automated backups**
7. **Monitor server resources**

## Troubleshooting

### Application won't start
- Check PM2 logs: `pm2 logs drawing-gallery`
- Verify environment variables in `.env.local`
- Ensure MongoDB is running: `sudo systemctl status mongod`

### Nginx errors
- Check Nginx configuration: `sudo nginx -t`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Database connection issues
- Verify MongoDB status: `sudo systemctl status mongod`
- Check connection string in `.env.local`
- Test database connection manually

### SSL Certificate issues
- Renew certificates: `sudo certbot renew`
- Check certificate status: `sudo certbot certificates`

## Performance Optimization

1. **Enable Nginx caching** for static assets
2. **Setup CDN** for images (Cloudinary is already configured)
3. **Monitor server resources** with htop or similar
4. **Regular database optimization**
5. **Enable compression** in Nginx

Your drawing gallery site should now be live and accessible on your VPS!