const moment = require("moment");
const mongoose = require("mongoose");
const factories = require("./factories");

module.exports = mongoDb => {
    const dbConnection = mongoose.createConnection(mongoDb);

    const decorateWithPrehooks = RESTparam => {
        if (!RESTparam.prehook) {
            RESTparam.prehook = new Promise( resolve => resolve());
        }

        return RESTparam;
    }
    const createModel = (resource, schema, params) => {
        schema.createdAt = { type: Date };
        schema.updatedAt = { type: Date };

        if (params && params.deleteItem && params.deleteItem.soft) {
            schema.deleted = { type: Boolean, default: false };
            schema.deletedAt = { type: Date };
        }
        
        const Schema = mongoose.Schema(schema);

        Schema.pre('save', next => {
	        const now = moment().utc();

	        this.updatedAt = now;
            
            if (!this.createdAt) {
                this.createdAt = now;
            }

	        return next();
        });

        Schema.pre('update', function(next) {
            this.updatedAt = moment().utc();
            next();
        });

        const Model = dbConnection.model(resource, Schema);

        const getItem = thenfactories.getItem(Model, decorateWithPrehooks(params ? params.getItem : {}));
        const getItems = factories.getItems(Model, decorateWithPrehooks(params ? params.getItems : {}));
        const createItem = factories.createItem(Model, decorateWithPrehooks(params ? params.createItem : {}));
        const updateItem = factories.updateItem(Model, decorateWithPrehooks(params ? params.updateItem : {}));
        const deleteItem = factories.deleteItem(Model, decorateWithPrehooks(params ? params.deleteItem : {}));

        return { Model, getItem, getItems, createItem, deleteItem, updateItem }
    };


    const create = (app, resource, model, params) => {
        const resourceBase = params ? params.base ? `/${params.base}` : '' : '';
        const Model = createModel(resource, model, params);

        app.get(`${resourceBase}/${resource}`, (req, res) => {
            params.getItems.prehook(req, res).then(() => {
                const promise = Model.getItems(req.query);

                promise.then(data => res.send(data), err => res.status(400).send(err));
            })
        });

        app.get(`${resourceBase}/${resource}/:itemId`, (req, res) => {
            params.getItem.prehook(req, res).then(() => {
                const promise = Model.getItem(req.params.itemId);

                promise.then(data => res.send(data), err => res.status(400).send(err));
            });    
        });

        app.put(`${resourceBase}/${resource}/:itemId`, (req, res) => {
            params.updateItem.prehook(req, res).then(() => {
                const promise = Model.updateItem(req.params.itemId, req.body);

                promise.then(data => res.send(data), err => res.status(400).send(err));
            });
        });

        app.post(`${resourceBase}/${resource}`, (req, res) => {
            params.createItem.prehook(req, res).then(() => {
                const promise = Model.createItem(req.body);

                promise.then(data => res.send(data), err => res.status(400).send(err));
            });    
        });

        app.delete(`${resourceBase}/${resource}/:itemId`, (req, res) => {
            params.deleteItem.prehook(req, res).then(() => {
                const promise = Model.deleteItem(req.params.itemId);

                promise.then(data => res.send(data), err => res.status(400).send(err));
            });
        });

        return { app, Model };
    };
    
    return { create, createModel, factories };
};