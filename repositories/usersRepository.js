const Storage = require('../data/storage');

module.exports = class UsersRepository {
    constructor() {
        this.storage = new Storage('userModel');
    }

    find() {
        return this.storage.find();
    }

    findUser(email) {
        return this.storage.findItem({email});
    }

    async addUser(user) {
        user["createdAt"] = new Date().toLocaleDateString();
        user["updatedAt"] = new Date().toLocaleDateString();
        return await this.storage.addItem(user);
    }

    updateUser(email, user) {
        user["updatedAt"] = new Date().toLocaleDateString();
        if(user.hasOwnProperty('createdAt'))
            delete user.createdAt;
        return this.storage.updateItem({email: email}, user);
    }

    deleteUsers(emails) {
        return this.storage.deleteItems({ email: { $in: emails}});
    }

    filterList(criterias) {
        return this.storage.findItem(criterias);
    }

};
