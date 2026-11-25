const express=require('express');
const UserController=require('../Controllers/UserController');
const EventController=require('../Controllers/EventController')
const uploadEvent=require('../middleware/uploadEvent')
const UserRouter=express.Router();

UserRouter.post('/createUser',UserController.createUser);
UserRouter.post('/loginUser',UserController.loginUser);


UserRouter.get('/allUser',UserController.allUser);
UserRouter.get('/allFaculty',UserController.allFaculty);
UserRouter.get('/allEvent',EventController.allEvent);

UserRouter.post('/createEvent',uploadEvent.single('image'),EventController.createEvent)

UserRouter.get('/changeStatus/:id',UserController.changeStatus)
UserRouter.delete('/deleteEvent/:id',EventController.deleteEvent)


UserRouter.post('/registerEvent',EventController.registerEvent)
UserRouter.get('/eventRegistrations/:eventid',EventController.getEventRegistration)
module.exports=UserRouter;