const Logger = require("../logger/Logger");
const UsersRepository = require("../repositories/usersRepository");
const logger = new Logger();
const usersRepository = new UsersRepository();

const checkIfAdmin = async (Email) => {
    const admin = await usersRepository.findUser(Email);
    return admin[0].userRole === 'admin' && admin[0].status === 'active';
}

exports.usersController = {

    async getAllUsers(req, res) {
        if (await checkIfAdmin(req.params.reqEmail) === false)
            res.status(400).send("Error: user " + req.params.reqEmail + " you don't have permission to see other users!.");
        else {
            logger.log("Sending admin all users.");
            res.status(200).json(await usersRepository.find());
        }

    },

    async getUserById(req, res) {
        if (await checkIfAdmin(req.params.reqEmail) === false && req.params.resEmail != req.params.reqEmail) {
            res.status(400).send("Error: user " + req.params.reqEmail + " you don't have permission to see other users!.");
        }
        else {
            logger.log("Sending user " + req.params.resEmail + ".");
            res.status(200).json(await usersRepository.findUser(req.params.resEmail));
        }
    },

    async deleteUser(req, res) {
        const reqEmail  = req.body.reqEmail;
        const emails    = req.body.emails;

        if (emails.length == 1 && emails[0] == reqEmail) {
            const result = await usersRepository.deleteUsers(emails);
            if(!result)
                res.status(400).send('Failed to delete user ' + reqEmail + '.');
            else {
                logger.log("Delete user " + reqEmail + ".");
                res.status(200).send('User ' + reqEmail + ' is deleted.');
            }

        } else if (await checkIfAdmin(reqEmail) === true) {
            const result = await usersRepository.deleteUsers(emails);
            if(!result)
                res.status(400).send('Failed to delete user ' + reqEmail + '.');
            else {
                logger.log("Delete users " + emails + ".");
                res.status(200).send('Users ' + emails + ' are deleted.');
            }
        } else
            res.status(400).send("Error: user " + reqEmail + " you don't have permission to delete other users!.");
    },

    async editUser(req, res) {
        const reqEmail = req.body.reqEmail;
        const userData = req.body.userData;

        if (userData.length == 1 && userData[0].email == reqEmail && await checkIfAdmin(reqEmail) === false) {
            if (userData[0].hasOwnProperty('status')) {
                res.status(400).send("Error: user " + reqEmail + " you don't have permission to set your status!.");
            }
            else {
                const result = usersRepository.updateUser(reqEmail, userData[0]);
                if(!result)
                    res.status(400).send('Failed to edit user ' + reqEmail + '.');
                else {
                    logger.log("Edit user " + reqEmail);
                    res.status(200).send('User ' + reqEmail + ' edited.');
                }
            }
        }
        else if(await checkIfAdmin(reqEmail) === true) {
            for (const key in userData) {
                const userEmail = userData[key].email;
                const result = usersRepository.updateUser(userEmail, userData[key]);
                if(!result)
                    res.status(400).send('Failed to edit user ' + userEmail + '.');
            }
            logger.log("Edit users");
            res.status(200).send('Succeeded to edit users.');
        }
        else
            res.status(400).send("Error: user " + reqEmail + " you don't have permission to edit other users!.");

    },

    async addUser(req, res) {
        try {
            if (req.body.hasOwnProperty('adminEmail')) {
                if (checkIfAdmin(req.body.adminEmail) === false)
                    res.status(400).send("Error: user " + req.body.adminEmail + " you don't have permission to add users!.");
                else {
                    for (const key in req.body.userData) {
                        await usersRepository.addUser(req.body.userData[key]);
                    }
                    logger.log("create users.");
                    res.status(200).send("success.");
                }
            }
            else {
                await usersRepository.addUser(req.body.userData[0]);
                logger.log("create user");
                res.status(200).send("success, user is added.");
            }
        } catch (e) {
            res.status(400).send("Error: failed to add user. " + e);
        }
    },

    async getFilteredList(req, res) {
        if (await checkIfAdmin(req.body.adminEmail) === false)
            res.status(400).send("Error: user id " + req.body.adminEmail + " you don't have permission to get filtered users list!.");
        else {
            logger.log("filter list.");
            res.status(200).json(await usersRepository.filterList(req.body.criterias));
        }
    }
}
