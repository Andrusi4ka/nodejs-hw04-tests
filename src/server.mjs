import http from 'http';
import url from 'url';
import querystring from 'querystring';
import chalk from 'chalk';

const PORT = process.env.PORT || 3000;

function sendResponse(res, statusCode, html) {
    const buffer = Buffer.from(html, 'utf-8');

    res.writeHead(statusCode, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': buffer.length,
        'X-Content-Type-Options': 'nosniff'
    });

    res.end(buffer);
}

function renderPage(title, heading, paragraph) {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>${title}</title>
        </head>
        <body>
            <h1>${heading}</h1>
            <p>${paragraph}</p>
        </body>
        </html>`;
}

const server = http.createServer((req, res) => {
    try {
        const parsedUrl = url.parse(req.url, true);
        const { pathname } = parsedUrl;

        if (req.method === 'GET') {
            if (pathname === '/') {
                return sendResponse(
                    res,
                    200,
                    renderPage('Home', 'Home', 'Welcome to the Home Page')
                )
            }

            if (pathname === '/about') {
                return sendResponse(
                    res,
                    200,
                    renderPage('About', 'About', 'Learn more about us')
                );
            }

            if (pathname === '/contact') {
                return sendResponse(
                    res,
                    200,
                    renderPage('Contact', 'Contact', 'Get in touch')
                );
            }

            return sendResponse(
                res,
                404,
                renderPage('404', 'Page Not Found', 'Page Not Found')
            );
        }

        if (req.method === 'POST') {
            if (pathname !== '/submit') {
                return sendResponse(
                    res,
                    404,
                    renderPage('404', 'Page Not Found', 'Page Not Found')
                );
            }

            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const parsedData = querystring.parse(body);
                    const { name, email } = parsedData;

                    if (!name || !email) {
                        return sendResponse(
                            res,
                            400,
                            renderPage('400', 'Invalid form data', 'Invalid form data')
                        );
                    }

                    return sendResponse(
                        res,
                        200,
                        renderPage(
                            'Form Submitted',
                            'Form Submitted',
                            `Name: ${name}\nEmail: ${email}`
                        )
                    );
                } catch (error) {
                    return sendResponse(
                        res,
                        500,
                        renderPage('Error 500', 'Server Error', 'Server Error')
                    );
                }
            });

            return;
        }

        return sendResponse(
            res,
            405,
            renderPage('405', 'Method Not Allowed', 'Method Not Allowed')
        );

    } catch (error) {
        return sendResponse(
            res,
            500,
            renderPage('Error 500', 'Server Error', 'Server Error')
        );
    }
});

server.listen(PORT, () => {
    printMenu(PORT);
});

function printMenu(port) {
    console.log('');
    console.log(chalk.green.bold('✔ Server started successfully'));
    console.log(chalk.blue(`→ http://localhost:${port}`));
    console.log('');

    console.log(chalk.yellow('Available routes:'));
    console.log(chalk.cyan(`GET    /`));
    console.log(chalk.cyan(`GET    /about`));
    console.log(chalk.cyan(`GET    /contact`));
    console.log(chalk.magenta(`POST   /submit`));
    console.log('');
}

export { server };
