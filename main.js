var http = require('http');
var fs = require('fs');
//var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    const myURL = new URL('http://localhost:3000'+_url);
    var queryData = myURL.searchParams.get('id');
    
    if(queryData) {
    } else {
    queryData = undefined;
    }
    console.log(queryData);

    if(_url == '/'){
      _url = '/index.html';
    }
    if(_url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);
    //response.end(fs.readFileSync(__dirname + _url)); //기존 홈페이지를 출력하는 코드
    response.end(queryData); //추출한 쿼리스트링을 브라우저에 출력하는 코드
 
});
app.listen(3000);