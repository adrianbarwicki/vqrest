const vqrest = require('../index');

const vqrestApp = vqrest('mongodb://studentask-server:test@ds011238.mongolab.com:11238/studentask-test');


/**
 * vqrestApp.create(resourceName, resourceModel, options)
 * Creates paths:
 * GET /api/user
 * GET /api/user/:userId
 * POST /api/user
 * PUT /api/user/:userId
 * DELETE /api/user/:userId
 * 
 * 
 * @param options.base<String>: namespace for resourceModel
 * @param options.deleteItem<Object>: options for the delete item method factory
 *  @param options.deleteItem.soft<Boolean>: if true, deletion will happen with the isDeleted flag.
 */
vqrestApp.create('user', {
    firstName: String,
    lastName: String
}, {
    base: 'api',
    deleteItem: {
        soft: true
    }
});

vqrestApp.app.listen(8080);