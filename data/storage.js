const mongoose = require('mongoose');
const Path = require('path');
const Logger = require('../logger/Logger');
const logger = new Logger();

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

module.exports = class Storage {
    constructor (Model) {
        this.Model = require(Path.join(__dirname, "../models/" + Model + ".js"));
        this.connect();
    }

    connect () {
        const DBUrl = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST;
        mongoose.set('strictQuery', false);
        mongoose
            .connect(DBUrl, options)
            .then(() => logger.log("connected to mongoDB"))
            .catch(err => logger.log("connection error: " + err));
    }

    async find() {
        return await this.Model.find({});
    }

    async findItem(id) {
        return await this.Model.find(id);
    }

    async addItem(data) {
        const item = new this.Model(data);
        await item.save();
        return !!item;
    }

    async deleteItems(ids) {
        return await this.Model.deleteMany(ids);
    }

    async updateItem(id, data) {
        return await this.Model.updateOne(id, data);
    }
};
