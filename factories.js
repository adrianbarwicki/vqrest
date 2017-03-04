const utils = require("./utils");

const createItem = Model => data => {
    const doc = new Model();

    Object.keys(data).forEach(key => doc[key] = data[key]);

    doc.save(err => new Promise((resolve, reject) => {
        if (err)
            return reject(err);

        return resolve(doc);
    }));
};

const getItem = (Model, params) => itemId => Model.findOne({ _id: itemId }, params.fields);

const getItems = Model => query => Model.find(query);

const updateItem = Model => (itemId, data) => new Promise((resolve, reject) => {
    const query = Model.findOne({ _id: itemId }, (err, doc) => {
        if (err)
            return reject(err);
        
        utils.updateObject(doc, data);
        
        doc.save(err => {
            if (err)
                return reject(err);

            return resolve(doc);
        });
    });
});

const deleteItem = Model => itemId => new Promise((resolve, reject) => {
    const query = Model.findOne({ _id: itemId });

    query.then(doc => {
        doc.deleted = true;
        doc.deletedAt = moment().utc();
        
        doc.save(err => {
            if (err)
                return reject(err);

            return resolve(doc);
        });
    }, reject);
});

module.exports = { deleteItem, updateItem, getItem, getItems, createItem  } 
