const UserModel=require('../Models/UserModel');
const crypt=require('bcrypt');


exports.createUser=async(req,res)=>{
    const body=req.body;
    if(!body.name || !body.email || !body.password || !body.phone || !body.yearOfJoining || !body.role ) {
        return res.json({'message':'All fields are required'});
}else{
    const newPassword=crypt.hashSync(body.password,10);
    await UserModel.create({
        name:body.name,
        email:body.email,
        password:newPassword,
        phone:body.phone,
        yearOfJoining:body.yearOfJoining,
        role:body.role
    });
   return res.json({'message':'User Created'});
}

}

exports.loginUser=async(req,res)=>{
    const body=req.body;
    if(!body.email || !body.password){
        return res.json({'message':'Email and Password required'})
    } 
    else{
        const user=await UserModel.findOne({email:body.email})
        if(!user){
            return res.json({'message':'User Not Found'})
        }else{
            const matchpassword=crypt.compareSync(body.password,user.password)
            if(!matchpassword){
                return res.json({'message':'Invalid Password'})
            }else{
                if(user.status=='inactive'){
                    return res.json({'message':'You are Not An Active user'})
                }else{
                    return res.json(user)
                }
            }
        }
    }
}

exports.allUser=async(req,res)=>{
    const users=await UserModel.find({"role":"student"});
     return res.json(users)

}
exports.allFaculty=async(req,res)=>{
    const faculty=await UserModel.find({"role":"faculty"});
     return res.json(faculty)

}


exports.changeStatus=async(req,res)=>{
    const id =req.params.id;
    const user=await UserModel.findById(id);
    const status=user.status;
    if(status=='active'){
          await UserModel.findByIdAndUpdate(id,{'status':'inactive'})
       }else{
            await UserModel.findByIdAndUpdate(id,{'status':'active'})
            
    }
    return res.json({'massege':'status change succesfully'})
}