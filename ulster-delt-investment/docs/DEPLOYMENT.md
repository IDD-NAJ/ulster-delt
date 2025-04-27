# Deployment Guide

This document provides detailed instructions for deploying the Ulster Delt Investment application.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18 or later
- MongoDB 6.0 or later
- Redis 7.0 or later
- Git

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/ulster-delt-investment.git
cd ulster-delt-investment
```

2. Create environment files:
```bash
cp .env.example .env
```

3. Update the environment variables in `.env` with your configuration.

## Local Development

1. Start the development environment:
```bash
docker-compose up
```

2. Access the application:
- API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs
- Monitoring Dashboard: http://localhost:3001

## Production Deployment

### 1. Server Setup

1. Install Docker and Docker Compose on your server
2. Create a deployment directory:
```bash
mkdir -p /opt/ulster-delt-investment
```

### 2. Application Deployment

1. Copy the application files to the server
2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with production values
```

3. Start the application:
```bash
docker-compose -f docker-compose.yml up -d
```

### 3. Monitoring Setup

1. Start the monitoring stack:
```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

2. Access monitoring tools:
- Grafana: http://your-server:3001
- Prometheus: http://your-server:9090

### 4. SSL Configuration

1. Install Certbot:
```bash
sudo apt-get update
sudo apt-get install certbot
```

2. Obtain SSL certificate:
```bash
sudo certbot certonly --standalone -d your-domain.com
```

3. Configure Nginx with SSL:
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## CI/CD Pipeline

The application uses GitHub Actions for CI/CD. The pipeline includes:

1. Testing
2. Building Docker image
3. Pushing to Docker Hub
4. Deploying to production

### Required Secrets

Set up the following secrets in your GitHub repository:

- `DOCKERHUB_USERNAME`: Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token
- `DEPLOY_HOST`: Production server hostname
- `DEPLOY_USERNAME`: SSH username for deployment
- `DEPLOY_KEY`: SSH private key for deployment
- `CODECOV_TOKEN`: Codecov token for coverage reports

## Monitoring and Maintenance

### Logs

View application logs:
```bash
docker-compose logs -f app
```

View monitoring logs:
```bash
docker-compose -f docker-compose.monitoring.yml logs -f
```

### Backup

1. Database backup:
```bash
docker-compose exec mongodb mongodump --out /backup
```

2. Restore database:
```bash
docker-compose exec mongodb mongorestore /backup
```

### Scaling

To scale the application:

1. Update the number of replicas in docker-compose.yml:
```yaml
services:
  app:
    deploy:
      replicas: 3
```

2. Apply the changes:
```bash
docker-compose up -d
```

## Security Considerations

1. Keep all dependencies updated
2. Regularly rotate secrets and keys
3. Monitor security logs
4. Implement rate limiting
5. Use HTTPS for all communications
6. Regular security audits

## Troubleshooting

### Common Issues

1. Application not starting:
   - Check logs: `docker-compose logs app`
   - Verify environment variables
   - Check port availability

2. Database connection issues:
   - Verify MongoDB is running
   - Check connection string in .env
   - Check network connectivity

3. Monitoring not working:
   - Verify Prometheus and Grafana are running
   - Check metrics endpoint: http://localhost:3000/metrics
   - Verify network connectivity between services

### Support

For support, contact:
- Email: support@ulsterdelt.com
- Issue Tracker: GitHub Issues
- Documentation: /docs directory 