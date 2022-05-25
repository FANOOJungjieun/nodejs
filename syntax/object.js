var members = ['jieun', 'fanoo', 'noname'];

for(var i in members) {
    console.log('Array loop', members[i]);
}

var roles = {
    'name' : 'jieun',
    'subject' : 'nodejs',
    'nickname' : 'fanoo'
}

for(var i in roles) {
    console.log('Object name=>', i, 'Object=>', roles[i]);
}

console.log(roles.name);