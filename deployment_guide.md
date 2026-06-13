# Deployment Guide for SphereBreak

This guide will help you deploy the SphereBreak application to a sub-route (e.g., `https://yourdomain.com/spherebreak`) and configure your web server to handle API requests correctly.

## Angular Application

The Angular application has been configured to be served from the `/spherebreak/` sub-route. When you build the application using `npm run build`, the output will be in the `www` directory with the correct paths.

## Web Server Configuration

To ensure that the application and the API work correctly, you need to configure your web server to handle routing and API requests.

### Nginx

If you are using Nginx, you can add the following location block to your server configuration:

```nginx
location /spherebreak/ {
    alias /path/to/your/spherebreak/www/;
    try_files $uri $uri/ /spherebreak/index.html;

    location /spherebreak/api/ {
        proxy_pass http://your_api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Explanation:**

*   The first `location` block serves the Angular application from the `/spherebreak/` route.
*   The `try_files` directive ensures that all routes are handled by the `index.html` file, which is necessary for single-page applications.
*   The second `location` block is a reverse proxy for the API. It forwards all requests from `/spherebreak/api/` to your API backend.
*   Replace `/path/to/your/spherebreak/www/` with the actual path to your application's `www` directory.
*   Replace `http://your_api_backend` with the actual URL of your API backend.

### Apache

If you are using Apache, you can use `mod_rewrite` to achieve the same result. Add the following to your `.htaccess` file in the root of your website:

```apache
RewriteEngine On
RewriteBase /

# Serve the Angular app
RewriteRule ^spherebreak/.*$ /spherebreak/index.html [L]

# Proxy API requests
RewriteRule ^spherebreak/api/(.*)$ http://your_api_backend/$1 [P,L]
```

**Explanation:**

*   `RewriteEngine On` enables the rewrite engine.
*   `RewriteBase /` sets the base URL for the rewrites.
*   The first `RewriteRule` serves the Angular application for any request that starts with `/spherebreak/`.
*   The second `RewriteRule` proxies requests from `/spherebreak/api/` to your API backend.
*   Replace `http://your_api_backend/` with the actual URL of your API backend.

**Important:**

*   Make sure that `mod_rewrite` and `mod_proxy` are enabled on your Apache server.
*   You might need to adjust the paths and URLs to match your specific setup.
