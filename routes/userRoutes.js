const Router = require("express");
const { usersController } = require('../controllers/usersController');


const userRouter = new Router();

userRouter.post("/filter", usersController.getFilteredList);
userRouter.get("/:reqEmail/:resEmail", usersController.getUserById);
userRouter.get('/:reqEmail', usersController.getAllUsers);

userRouter.put("/", usersController.editUser);

userRouter.post("/", usersController.addUser);

userRouter.delete("/",usersController.deleteUser);

module.exports =  { userRouter };