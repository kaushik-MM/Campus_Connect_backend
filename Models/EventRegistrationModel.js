const mongoose=require('mongoose');

const RegistrationSchema=new mongoose.Schema({

    userid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    eventid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Event"
    }
},
  {
    timestamps: true
  })
module.exports=mongoose.model('registration',RegistrationSchema);