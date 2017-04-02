# VQREST

VQRest allows with one line of code create mongoose models and restful API.


## vqrestApp.create(resourceName, resourceModel, options)

Creates a mongoose scheme for mongodb and sets up restful paths for common operations:

**GET** /options.base/resourceName<br>
**GET** /options.base/:itemId<br>
**POST** /options.base/resourceName<br>
**PUT** /options.base/resourceName/:itemId<br>
**DELETE** /options.base/resourceName/:itemId

```
const vqrestApp = require('vqrest')('<mongodb-url>');

vqrestApp.create('user', {
    firstName: String,
    lastName: String
}, {
    base: 'api',
    getItem: {
        prehook: (req, res) => new Promise( resolve => {
            if (req.user) {
                return resolve();
            }

            return res.status(401).send('Log in');
        });
    }
    deleteItem: {
        soft: true
    }
});
```

## vqrest.utils

### updateObject(obj, data)
Copies corresponding fields from data to obj

```
    const obj = { field1: 1, field2: 2 };

    vqrest.utils(obj, { field1: 2, field3: 3 });

    console.log(obj);
    // { { field1: 2, field2: 2, field3: 3 } }
```