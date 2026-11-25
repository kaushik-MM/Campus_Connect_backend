const PostController=require('../Controllers/PostControllers')
const uploadPost=require('../middleware/uploadPost')

const express=require('express')
const PostRouter=express.Router()

PostRouter.post('/createPost',uploadPost.single('image'),PostController.createPost)
PostRouter.get('/allPosts',PostController.allPosts)
PostRouter.get('/onePost',PostController.onePost)
PostRouter.put('/editPost/:id',PostController.editPost)
PostRouter.put('/deletePost/:id',PostController.deletePost)

module.exports=PostRouter