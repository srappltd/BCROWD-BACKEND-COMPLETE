const { UserModel } = require('../models/user.model');
const { getDownlineUsersBinary } = require('./getDownlineUsersBinary');

// ✅ Find first available parent where user can be added
const findAvailableParent = async (referred_by) => {
  const downlineUsers = await UserModel.find({ referral_code: referred_by });

  for (const user of downlineUsers) {
    if (!user.left_child) return user._id;
    if (!user.right_child) return user._id;

    // Check left child's left and right
    const leftChild = await UserModel.findById(user.left_child);
    if (leftChild) {
      // await findAvailableParent(leftChild.referral_code);
      if (leftChild.left_child) return leftChild._id;
      if (!leftChild.right_child) return leftChild._id;
    };
    console.log('leftChild', leftChild);
    const rightChild = await UserModel.findById(user.right_child);
    if (rightChild) {
      // await findAvailableParent(rightChild.referral_code);
      if (!rightChild.left_child) return rightChild._id;
      if (!rightChild.right_child) return rightChild._id;
    };
  }
  return null;
};

// ✅ Automatically add a user to the first available slot
const addToBinaryTreeAutomatically = async (newUser, referred_by) => {
  const referrer = await UserModel.findOne({ referral_code: referred_by });
  if (!referrer) return; // Referrer not found
  const parentId = await findAvailableParent(referred_by);
  if (!parentId) return;
  const parentUser = await UserModel.findById(parentId);
  if (!parentUser.left_child) {
    parentUser.left_child = newUser._id;
  } else if (!parentUser.right_child) {
    parentUser.right_child = newUser._id;
  }
  newUser.parent_id = parentId;
  await parentUser.save();
  await newUser.save();
};


// ✅ Recursive function to get binary tree data for a user
const getBinaryTreeData = async (userId) => {
  const user = await UserModel.findById(userId).populate('left_child right_child').populate('parchases');

  if (!user) return null;
  if (!user.is_active) return null;
  // Format the current user and their children
  return {
    userId: user._id,
    name: user.name,
    parchases: user.parchases,
    leftChild: user.left_child ? await getBinaryTreeData(user.left_child._id) : null,
    rightChild: user.right_child ? await getBinaryTreeData(user.right_child._id) : null,
  };
};

const buildTree = async (userId) => {
  if (!userId) return null;

  const user = await UserModel.findById(userId,{name:1,email:1,invastment:1,referred_by:1,partners:1,is_active:1,joiningMode:1,left_child:1,right_child:1}).lean();
  if (!user) return null;
  const { left, right } = await getDownlineUsersBinary(user._id);

  // Recursively fetch left and right children
  const leftChild = await buildTree(user.left_child);
  const rightChild = await buildTree(user.right_child);

  // Use aggregation to get business totals
  const [leftBusinessAgg, rightBusinessAgg] = await Promise.all([
    UserModel.aggregate([
      { $match: { _id: { $in: left } } },
      { $group: { _id: null, total: { $sum: "$invastment" } } }
    ]),
    UserModel.aggregate([
      { $match: { _id: { $in: right } } },
      { $group: { _id: null, total: { $sum: "$invastment" } } }
    ])
  ]);

  const leftTotalBusiness = leftBusinessAgg[0]?.total || 0;
  const rightTotalBusiness = rightBusinessAgg[0]?.total || 0;

  const carryLeftForward = left.length > right.length ? left.length - right.length : 0;
  const carryRightForward = right.length > left.length ? right.length - left.length : 0;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    joiningMode: user.joiningMode,
    sponsorUserId: user.referred_by,
    is_active: user.is_active,
    carryLeft: carryLeftForward,
    carryRight: carryRightForward,
    leftTotalBusiness,
    rightTotalBusiness,
    leftCount: left.length,
    rightCount: right.length,
    partnerLength: user.partners.length,
    investment: user.invastment,
    left_child: leftChild,
    right_child: rightChild,
  };
};


// Calculate Distribution Ratio
const calculateRatio = (investment) => {
  if (investment >= 1000) return { parent: 2, grandParent: 1 }; // 2:1
  else if (investment >= 500) return { parent: 1, grandParent: 2 }; // 1:2
  else return { parent: 1, grandParent: 1 }; // 1:1
};

// Distribute Amount to Users
const distributeRewards = async () => {
  const users = await UserModel.find({});
  for (let user of users) {
    if (!user.parent_id || user.rewardReceived) continue; // Skip if user has already received reward or has no parent
    const parent = await UserModel.findById(user.parent_id);
    if (!parent) continue;
    const ratio = calculateRatio(user.wallet_address); // Example: Wallet balance as investment
    // Distribute Amount to the Parent
    parent.wallet_address += ratio.parent;
    parent.rewardReceived = true; // Mark parent as received
    if (parent.parent_id) {
      const grandParent = await UserModel.findById(parent.parent_id);
      if (grandParent) {
        grandParent.wallet_address += ratio.grandParent;
        grandParent.rewardReceived = true; // Mark grandparent as received
        await grandParent.save();
      }
    }
    await parent.save();
    await user.save(); // Mark the current user as received (optional)
  }
  console.log('💰 Rewards Distributed!');
};







module.exports = { addToBinaryTreeAutomatically, getBinaryTreeData, buildTree };
