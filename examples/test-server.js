const vqrest = require('../index');

const vqrestApp = vqrest('mongodb://studentask-server:test@ds011238.mongolab.com:11238/studentask-test');

vqrestApp.create('user', {
    firstName: String,
    lastName: String
});

vqrestApp.create('task', {
    title: String,
    description: String
});

vqrestApp.create('category', {
    title: String,
    description: String
});

vqrestApp.app.listen(8080);