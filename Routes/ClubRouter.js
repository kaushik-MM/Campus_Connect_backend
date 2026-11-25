const ClubController=require('../Controllers/ClubControllers')
const uploadClub=require('../middleware/uploadClub')
const express=require('express')
const ClubRouter=express.Router()
const MessageController=require('../Controllers/MessageController')

ClubRouter.post('/createClub',uploadClub.single('image'),ClubController.createClub)
ClubRouter.get('/allClub',ClubController.getAllClubs)
ClubRouter.get('/fetchClub/:id',ClubController.getClubById)
ClubRouter.post('/joinClub/:studentId/:clubId',ClubController.joinClub)
ClubRouter.post('/leaveClub/:studentId/:clubId',ClubController.leaveClub)
ClubRouter.post('/reportClub',ClubController.reportClub)
ClubRouter.delete('/deleteClub/:clubId',ClubController.deleteClub)

ClubRouter.get('/fetchClubs',ClubController.fetchAllClubs)

ClubRouter.get('/clubs/:clubId/messages',MessageController.getClubMessages)

ClubRouter.post('/clubs/:clubId/messages',MessageController.sendClubMessage)


module.exports=ClubRouter;