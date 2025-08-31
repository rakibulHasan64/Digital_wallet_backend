import { User } from "../user/user.model"


const getmyprofile = async (userId: string) => {


  const users = await User.findById(userId).select("-password")
  return {
    data: users
  }
}




const getall = async () => {

   const users= await User.find({})
   const totalUser = await User.countDocuments()

   return {
      data: users,
      mata: {
         total: totalUser
      }
   }
   
}




export const serviceTangetion = {
   getmyprofile,
   getall
 
}