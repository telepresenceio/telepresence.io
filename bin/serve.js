#!/usr/bin/env node

const fs = require('fs/promises');
const http = require('http');
const path = require('path');
const url = require('url');

const mime = require('mime');
const redirectParser = require('netlify-redirect-parser');

let host = 'localhost'
let port = 9000;
let dir = path.resolve('public');
let cfg = path.resolve('netlify.toml');

const server = http.createServer()

async function exists(filepath) {
  try {
    await fs.stat(filepath);
    return true;
  } catch {
    return false;
  }
}

function matchesRedirect(forcefulOnly, requestURL, redirect) {
  if (forcefulOnly && !redirect.force) {
    return false;
  }
  if (redirect.path !== requestURL.pathname && redirect.path !== requestURL.pathname+'/') {
    return false;
  }
  const requestQuery = new URLSearchParams(requestURL.query);
  for (const key in redirect.query) {
    if (requestQuery.get(key) !== redirect.query[key]) {
      return false;
    }
  }
  return true;
}

function doRedirect(requestURL, response, redirect) {
  let location = redirect.to;
  if (!new URL(location).search) {
    location += (requestURL.search||'');
  }
  response.writeHead(redirect.status, {
    'Location': location,
    'Content-Type': 'text/plain',
  });
  response.end(`Redirecting to ${location}`);
}

server.on('request', async (request, response) => {
  console.log(request.method, request.url);
  const requestURL = new URL(url.resolve('/', request.url));
  if (requestURL.protocol || requestURL.host) {
    response.writeHead(400);
    response.end('Bad request URL');
  }

  let redirects;
  try {
    redirects = await redirectParser.parseAllRedirects({
      redirectsFiles: [path.resolve(dir, '_redirects')],
      netlifyConfigPath: cfg,
    });
  } catch (err) {
    response.writeHead(500, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify(err));
    return;
  }
  let redirect = redirects.find((redirect)=>(matchesRedirect(true, requestURL, redirect)));
  if (redirect) {
    doRedirect(requestURL, response, redirect);
    return;
  }

  const filepath = path.join(dir, requestURL.pathname).replace(/\/$/, '/index.html');
  let content;
  try {
    content = await fs.readFile(filepath);
  } catch (err) {
    if (err.code === 'EISDIR' && !requestURL.pathname.endsWith('/')) {
      // All sane webservers should do this.  `netlify dev` doesn't.
      const location = requestURL.pathname + '/' + (requestURL.search||'');
      response.writeHead(302, {
        'Location': location,
        'Content-Type': 'text/plain',
      });
      response.end(`Redirecting to ${location}`);
    } else if (requestURL.pathname.endsWith('.html') && await exists(filepath.replace(/\.html$/, ''))) {
      // This is a weird thing that Netlify does (even if you
      // turn off pretty URLs).
      const location = requestURL.pathname.replace(/\.html$/, '') + (requestURL.search||'');
      response.writeHead(302, {
        'Location': location,
        'Content-Type': 'text/plain',
      });
      response.end(`Redirecting to ${location}`);
    } else if ((redirect = redirects.find((redirect)=>(matchesRedirect(false, requestURL, redirect))))) {
      doRedirect(requestURL, response, redirect);
    } else {
      response.writeHead(404, {
        'Content-Type': 'text/html',
      });
      response.end(await fs.readFile(path.resolve(dir, '404.html')));
    }
    return;
  }
  response.writeHead(200, {
    'Content-Type': mime.getType(filepath),
  });
  response.end(content);
});

server.listen(port, host, () => {
  const addr = url.format({
    protocol: 'http',
    hostname: host,
    port: port,
    pathname: '/',
  });
  console.log(`----

  Serving
    directory ${dir}
    with config ${cfg}
    at address ${addr}

----`);
});
