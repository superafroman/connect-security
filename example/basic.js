/**
 * Simple Connect application to show basic form authentication in action.
 */

var connect = require('connect');
var security = require('connect-security');

var InMemoryUserProvider = require('connect-security/service/inmemoryuserprovider');

function urls(app) {
  app.get('/secure', function(req, res, next) {
    security.secure('user', req, function() {
      res.writeHead(200, {
        "Content-Type" : "text/html"
      });
      res.end('<html>' + '<head>' + '<title>Hello Secure World!</title>'
          + '</head>' + '<body>' + '<h2>Hello Secure World!</h2>' + '</body>'
          + '</html>');
      next();
    });
  });

  app.get('/', function(req, res, next) {
    res.writeHead(200, {
      "Content-Type" : "text/html"
    });
    res.end('<html>' + '<head>' + '<title>Hello World!</title>' + '</head>'
        + '<body>' + '<h2>Hello World!</h2>' + '</body>' + '</html>');
    next();
  });

  app.get('/logout', function(req, res, next) {
    res.writeHead(303, {
      "Location" : "/"
    });
    res.end('');
    next();
  });
}

var BasicAuthenticationFilter = require('connect-security/filter/basicauthenticationfilter');
var BasicAuthenticationEntryPoint = require('connect-security/entrypoint/basicauthenticationentrypoint');
var LogoutFilter = require('connect-security/filter/logoutfilter');

var server = connect.createServer(connect.cookieDecoder(), connect
    .bodyDecoder(), connect.session(), security({
  filters : [ new BasicAuthenticationFilter({
    userProvider : new InMemoryUserProvider({
      users : {
        'test' : {
          username : 'test',
          password : '12345',
          roles : [ 'user' ]
        }
      }
    })
  }), new LogoutFilter() ],
  entryPoint : new BasicAuthenticationEntryPoint({
    realmName : 'connect-security'
  })
}), connect.router(urls), security.errorHandler());

server.listen(3000);
console.log('Server started at http://127.0.0.1:3000/');
