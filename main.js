var http = require('http');
var fs = require('fs');
var qs = require('querystring');
//var url = require('url');

var template = {
  html:function(title,list,data,control) {
    return `
        <!doctype html>
      <html>
      <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
      </head>
      <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${data}
      </body>
      </html>
        `;
  },
  list:function(filelist) {
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length) {
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i+1;
    }
    var list = list + '</ul>';
  
    return list;
  }
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    const myURL = new URL('http://localhost:3000'+_url);
    var queryData = myURL.searchParams.get('id');
    var pathname = myURL.pathname;
    
    if(queryData) {
    } else {
    queryData = undefined;
    }

    if(pathname === '/') {
      if(queryData === undefined) {

        fs.readdir('./data', function(err, filelist) {
          var title = 'Welcome';
          var data = 'Hello, NodeJS';
          var list = template.list(filelist);
          var html = template.html(title,list,`<h2>${title}</h2>${data}`, `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html); 
        })
          
      } else {
        fs.readdir('./data', function(err, filelist) {
          var list = template.list(filelist);

          fs.readFile(`data/${queryData}`, 'utf8', function(err,data){
            var title = queryData;
            var html = template.html(title,list,`<h2>${title}</h2>${data}`, 
            `<a href="/create">create</a> 
             <a href="/update?id=${title}">update</a>
             <form action="delete_process" method="post" onsubmit="return confirm('do you want to delete this file?')">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
             </form>
             `);

            response.writeHead(200);
            response.end(html); //추출한 쿼리스트링을 브라우저에 출력하는 코드
          });

      })
      }
    } else if(pathname === '/create') {
      fs.readdir('./data', function(err, filelist) {
        var title = 'WEB-create';
        var list = template.list(filelist);
        var html = template.html(title,list,`
        <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
        </form>
        `, ``);
        response.writeHead(200);
        response.end(html); 
      })
    } else if(pathname === '/create_process') {
      var body = '';
      request.on('data', function(data) {
          body = body + data;
      })
      request.on('end', function() {
          var post = qs.parse(body);

          var title = post.title;
          var description = post.description;

          fs.writeFile(`data/${title}`, description, 'utf-8', function(err) {
            response.writeHead(302, {location: `/?id=${title}`});
            response.end();
          })
      })
    } else if(pathname=== '/update') {
      fs.readdir('./data', function(err, filelist) {
        var list = template.list(filelist);

        fs.readFile(`data/${queryData}`, 'utf8', function(err,data){
          var title = queryData;
          var html = template.html(title,list,`
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${data}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);

          response.writeHead(200);
          response.end(html); //추출한 쿼리스트링을 브라우저에 출력하는 코드
        });

    })
    } else if(pathname==='/update_process') {
      var body = '';
      request.on('data', function(data) {
          body = body + data;
      })
      request.on('end', function() {
          var post = qs.parse(body);

          var id = post.id;
          var title = post.title;
          var description = post.description;

          fs.rename(`data/${id}`, `data/${title}`, function(err) {
            fs.writeFile(`data/${title}`, description, 'utf-8', function(err) {
              response.writeHead(302, {location: `/?id=${title}`});
              response.end();
            })
          })
      })
    } else if(pathname==='/delete_process') {
      var body = '';
      request.on('data', function(data) {
          body = body + data;
      })
      request.on('end', function() {
          var post = qs.parse(body);

          var id = post.id;

          fs.unlink(`data/${id}`, function(err) {
            response.writeHead(302, {location: `/`});
            response.end();
          })

      })
    } else {
      response.writeHead(404);
      response.end('Not Found');
    }
    //response.end(fs.readFileSync(__dirname + _url)); //기존 정적인 홈페이지를 출력하는 코드
 
});
app.listen(3000);