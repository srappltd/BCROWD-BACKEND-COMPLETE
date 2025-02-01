const cron = require('node-cron');
const {UserModel} = require('../models/user.model');
const { findCorrectPosition, assignUserToTeam } = require('../utils/binaryTreeTeam');

const autoAssignUsers = async () => {
  try {
    const unassignedUsers = await UserModel.find({ parent_id: null });

    for (const user of unassignedUsers) {
      const parentData = await findCorrectPosition(null);

      if (!parentData) {
        console.log(`❌ No valid parent found for ${user.name}`);
        continue;
      }

      user.parent_id = parentData.parentId;
      await user.save();

      const parent = await UserModel.findById(parentData.parentId);
      parent[parentData.position] = user._id;
      await parent.save();
      await assignUserToTeam(user._id);

      console.log(`✅ Assigned ${user.name} to parent ${parent.name} at ${parentData.position}`);
    }
  } catch (error) {
    console.error('❌ Error in auto-assigning users:', error.message);
  }
};

// // Run every 2 minutes
// cron.schedule('*/2 * * * *', async () => {
//   console.log('⏳ Running auto-user assignment...');
//   await autoAssignUsers();
// });

// setInterval(()=>{
//     autoAssignUsers();
// },5000)
