#VQREST

VQRest allows with one line of code create mongoose models and restful API.


##vqrestApp.create(resourceName, resourceModel, options)
Creates paths:
GET /<options.base>/<resourceName>

GET /<options.base>/:itemId

POST /<options.base>/<resourceName>

PUT /<options.base>/<resourceName>/:itemId

DELETE /<options.base>/<resourceName>/:itemId

```
vqrestApp.create('user', {
    firstName: String,
    lastName: String
}, {
    base: 'api',
    deleteItem: {
        soft: true
    }
});
```