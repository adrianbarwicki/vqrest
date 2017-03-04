const moment = require("moment");
const mongoose = require("mongoose");

const factories = require("./factories");

module.exports = mongoDb => {
    const app = require('express')();
    const dbConnection = mongoose.createConnection(mongoDb);

    const createModel = (resource, schema) => {
        schema.createdAt = { type: Date };
        schema.updatedAt = { type: Date };
        schema.deleted = { type: Boolean, default: false };
        schema.deletedAt = { type: Date };

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

        const getItem = factories.getItem(Model);
        const getItems = factories.getItems(Model);
        const createItem = factories.createItem(Model);
        const updateItem = factories.updateItem(Model);
        const deleteItem = factories.deleteItem(Model)

        return { Model, getItem, getItems, createItem, deleteItem, updateItem }
    };

    const create = (resource, model) => {
        const Model = createModel(resource, model);

        app.get(`/${resource}`, (req, res) => {
            const promise = Model.getItems(req.query);

            promise.then(data => res.send(data), err => res.status(400).send(err));
        });

        app.get(`/${resource}/:itemId`, (req, res) => {
            const promise = Model.getItem(req.params.itemId);

            promise.then(data => res.send(data), err => res.status(400).send(err));
        });

        app.put(`/${resource}/:itemId`, (req, res) => {
            const promise = Model.updateItem(req.params.itemId, req.body);

            promise.then(data => res.send(doc), err => res.status(400).send(err));
        });

        app.post(`/${resource}`, (req, res) => {
            const promise = Model.createItem(req.body);

            promise.then(data => res.send(doc), err => res.status(400).send(err));
        });

        app.delete(`/${resource}/:itemId`, (req, res) => {
            const promise = Model.deleteItem(req.params.itemId);

            promise.then(data => res.send(doc), err => res.status(400).send(err));
        });

        return { app, Model };
    };



    return { app, create, createModel, factories };
};