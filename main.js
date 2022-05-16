var http = require('http');
var fs = require('fs');
//var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    const myURL = new URL('http://localhost:3000'+_url);
    var queryData = myURL.searchParams.get('id');
    var title = queryData;
    
    if(queryData) {
    } else {
    queryData = undefined;
    }
    console.log(queryData);

    if(_url == '/'){
      //_url = '/index.html'; //정적 코드
      title='Welcome';
    }
    if(_url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);
    //response.end(fs.readFileSync(__dirname + _url)); //기존 정적인 홈페이지를 출력하는 코드

    fs.readFile(`data/${queryData}`, 'utf8', function(err,data){
      var template = `
    <!doctype html>
<html>
<head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  <ol>
    <li><a href="/?id=HTML">HTML</a></li>
    <li><a href="/?id=CSS">CSS</a></li>
    <li><a href="/?id=JavaScript">JavaScript</a></li>
  </ol>
  <h2>${title}</h2>
  <p>${data}
  </p>
</body>
</html>
    `;
    response.end(template); //추출한 쿼리스트링을 브라우저에 출력하는 코드
    });
 
});
app.listen(3000);