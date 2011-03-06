/**
 * Simple Connect application to show basic form authentication in action.
 */

var connect = require('connect');
var security = require('connect-security');

var InMemoryUserProvider = require('connect-security/service/inmemoryuserprovider');

function urls(app) {
  app.get('/secure', function(req, res, next) {
    res.writeHead(200, {
      'Content-Type' : 'text/html'
    });
    res.end('<html>' + 
              '<head>' + 
                '<title>Hello Secure World!</title>' + 
              '</head>' + 
              '<body>' + 
                '<h2>Hello Secure World!</h2>' + 
              '</body>' + 
            '</html>');
  });

  app.get('/', function(req, res, next) {
    res.writeHead(200, {
      'Content-Type' : 'text/html'
    });
    res.end('<html>' + 
              '<head>' + 
                '<title>Hello World!</title>' + 
              '</head>' + 
              '<body>' + 
                '<h2>Hello World!</h2>' + 
              '</body>' + 
            '</html>');
  });

  app.get('/logout', function(req, res, next) {
    res.writeHead(303, {
      'Location': '/'
    });
    res.end('');
  });

  app.get('/login', function(req, res, next) {
    res.writeHead(200, {
      'Content-Type' : 'text/html'
    });
    res.end('<html>' + 
              '<head>' + 
                '<title>Login</title>' + 
              '</head>' + 
              '<body>' + 
                '<h2>Login</h2>' + 
                '<p>Username/password: test/12345</p>' + 
                '<form method="post">' + 
                  '<div>' + 
                    '<label for="username">Username:</label>' + 
                    '<input id="username" name="username" type="text" />' + 
                  '</div>' + 
                  '<div>' + 
                    '<label for="password">Password:</label>' + 
                    '<input id="password" name="password" type="password" />' + 
                  '</div>' + 
                  '<div>' + 
                    '<label for="rememberMe">Remember Me:</label>' + 
                    '<input id="rememberMe" name="rememberMe" type="checkbox" />' + 
                  '</div>' + 
                  '<div>' + 
                    '<input name="login" type="submit" />' + 
                  '</div>' + 
                '</form>' + 
              '</body>' + 
            '</html>');
  });
}

var server = connect.createServer(
  connect.cookieDecoder(), 
  connect.bodyDecoder(), 
  connect.session(), 
  security.formAuthenticationChain({
    interceptUrls: [
      { url: /^secure.*/, access: 'hasRole("user")' }
    ],
    rememberMe : {},
    userProvider : new InMemoryUserProvider({
      users : {
        'test' : {
          username : 'test',
          password : '12345',
          roles : [ 'user' ]
        }
      }
    })
  }), 
  connect.router(urls), 
  security.errorHandler()
);

server.listen(3000);
console.log('Server started at http://127.0.0.1:3000/');
