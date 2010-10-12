
# connect-security
      
  Authentication and authorisation middleware for [Connect](http://github.com/senchalabs/connect).

  connect-security is loosely based on [Spring Security](http://static.springsource.org/spring-security/site/) for Java.  Authentication is handled through the use of authentication filters which you can chain, allowing you to incorporate multiple different means of authentication into your application.  Authorisation, or access control, is handled through the use or user roles so you can lock down functions or URLs to be accessible only to users with certain roles.

## Features

  * Form authentication
  * Remember me authentication
  * Role based authorisation (access control)
  * Secure functions
  * Custom authentication filters
  * Chain-able authentication filters

## Coming Soon

  * Basic authentication
  * Secure URLs
  * Password hashing
  * API documentation

## Installation

npm:

    $ npm install connect-security

## Node Compatibility
    
The latest release of connect-security is compatible with node --version:

    v0.2.1

and connect --version:

    0.2.5

## License 

(The MIT License)

Copyright (c) 2010 Max Stewart &lt;max.stewart@superafroman.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.