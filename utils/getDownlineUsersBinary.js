const { UserModel } = require("../models/user.model");

const getDownlineUsersBinary = async (userId) => {
    const left = [];
    const right = [];
  
    // Traverse only left-downline
    let currentLeft = userId;
    while (currentLeft) {
      const user = await UserModel.findById(currentLeft,{left_child:1,right_child:1});
      if (!user || !user.left_child) break;
      left.push(user.left_child);
      currentLeft = user.left_child;
    }
  
    // Traverse only right-downline
    let currentRight = userId;
    while (currentRight) {
      const user = await UserModel.findById(currentRight,{left_child:1,right_child:1});
      if (!user || !user.right_child) break;
      right.push(user.right_child);
      currentRight = user.right_child;
    }
  
    return { left, right };
  };


  module.exports = {getDownlineUsersBinary}
  