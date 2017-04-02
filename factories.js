const moment = require("moment");
const utils = require("./utils");

const createItem = (Model, params) => data => new Promise((resolve, reject) => {
    const doc = new Model();

    Object.keys(data).forEach(key => doc[key] = data[key]);

    doc.save(err => {
        if (err)
            return reject(err);

        return resolve(doc);
    });
});

const getItem = (Model, params) => itemId => Model.findOne({ _id: itemId }, params ? params.fields : undefined);

const getItems = (Model, params) => query => Model.find(query);

const updateItem = (Model, params) => (itemId, data) => new Promise((resolve, reject) => {
    delete data._id;

    if (params && typeof params.transformIncomingDataFn === 'function') {
        data = params.transformIncomingDataFn(data)
    }

    const query = Model.findOne({ _id: itemId }, (err, doc) => {
        if (err)
            return reject(err);
        
        if (!doc)
            return reject('ITEM_NOT_FOUND');

        utils.updateObject(doc, data);
        
        doc.save(err => {
            if (err)
                return reject(err);

            return resolve(doc);
        });
    });
});

const deleteItem = (Model, params) => itemId => new Promise((resolve, reject) => {
    const isSoftDelete = params ? params.softDelete : false;

    Model[isSoftDelete ? 'findOne' : 'remove']({ _id: itemId }, (err, doc) => {
        if (err) {
            return reject(err);
        }

        if (!isSoftDelete) {
            return resolve(doc);
        }

        doc.deleted = true;
        doc.deletedAt = moment().utc();
        
        doc.save(err => {
            if (err)
                return reject(err);

            return resolve(doc);
        });
    });
});

module.exports = { deleteItem, updateItem, getItem, getItems, createItem  } 
