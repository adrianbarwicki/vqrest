const moment = require("moment");
const mongoose = require("mongoose");

module.exports = mongoDb => {
    const app = require('express')();
    const dbConnection = mongoose.createConnection(mongoDb);

    const createModel = (resource, model) => {
        model.createdAt = { type: Date };
        model.updatedAt = { type: Date };
        model.deleted = { type: Boolean, default: false };
        model.deletedAt = { type: Date };

        const Schema = mongoose.Schema(model);

        const getItem = itemId => Model.findOne({ _id: itemId });

        const getItems = query => Model.find(query);

        const createItem = data => {
            const doc = new Model();

            Object.keys(data).forEach(key => doc[key] = data[key]);

            doc.save(err => new Promise((resolve, reject) => {
                if (err)
                    return reject(err);

                return resolve(doc);
            }));
        };

        const updateItem = (itemId, data) => {
            const query = Model.findOne({ _id: itemId });

            query.then(doc => new Promise((resolve, reject) => {
                Object.keys(req.body).forEach(key => doc[key] = req.body[key]);
                
                doc.save(err => {
                    if (err)
                       return reject(err);

                    return resolve(doc);
                });
            }));
        };

        const deleteItem = itemId => new Promise((resolve, reject) => {
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

        const Model = conn.model(resource, Schema);

        return { Model, getItem, getItems, createItem, deleteItem, updateItem }
    };

    const create = (resource, model) => {
        const Model = createModel(resource, model);

        app.get(`/${resource}`, (req, res) => {
            const promise = Model.getItems(req.query);

            promise.then(data => req.send(data), err => res.status(400).send(err));
        });

        app.get(`/${resource}/:itemId`, (req, res) => {
            const promise = Model.getItem(req.params.itemId);

            promise.then(data => req.send(data), err => res.status(400).send(err));
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

        return { getItem, getItems, createItem, deleteItem, updateItem, Model };
    };

    return { app, create, createModel };
};