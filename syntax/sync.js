var fs = require('fs');

/*readfilesync

console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf-8');
console.log(result);
console.log('C');

*/

console.log('A');
fs.readFile('syntax/sample.txt', 'utf-8', function(err,result) { //return하지 않음.
    //callback. main.js에서 사용한 함수도 이것.
    console.log(result);
});
console.log('C');