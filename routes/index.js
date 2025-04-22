var express = require('express');
var router = express.Router();
const { UserTwoByEightModel, UserTwoByTwoModel, UserModel } = require('../models/user.model');
const { PackageTwoByTwoModel, PackageTwoByEightModel } = require('../models/package.model');
const { FinalEnterTwoByEightModel, FinalEnterTwoByTwoModel } = require('../models/finalenteruser.model');
const { RebirthTwoByEightModel, RebirthTwoByTwoModel } = require('../models/rebirth.model');
const { getBinaryTreeData, buildTree } = require('../utils/addToBinaryTreeAutomatically');
const { assignUserToTeam, getDownlineUsers } = require('../utils/binaryTreeTeam');
const { PurchaseModel } = require('../models/parchase.model');
const { LevelModel } = require('../models/level.model');
const { TeamIncomeModel } = require('../models/team.model');




const adminCreate = async () => {
  if (await UserModel.findOne({ email: 'admin@wecrowd.world' })) {
    return
  }
  const newReferralCode = `WC${Math.floor(100000000 + Math.random() * 999999999)}`;
  const newUser = new UserModel({
    name: `AutoUser${Date.now()}`,
    email: `admin@wecrowd.world`,
    number: `123456789`,
    wallet_address: `0x${Math.random().toString(16).slice(2, 42)}`,
    referred_by: 'WECROWD',
    referral_code: 'WECROWD',
    joiningMode: 'left'
  });
  await newUser.save()
};
adminCreate();


// Route to add a new slot for a package
router.post('/register', async (req, res) => {
  try {
    const { name, email, number, wallet_address, referred_by } = req.body;
    const newReferralCode = `WC${Math.floor(100000000 + Math.random() * 999999999)}`;

    if (!name || !email || !number || !wallet_address || !referred_by) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const user = await UserModel.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'User already exists.' });

    const newUser = new UserModel({ name, email, number, wallet_address, referred_by, referral_code: newReferralCode });
    const referrer = await UserModel.findOne({ referral_code: referred_by });
    if (referrer) {
      const partnersJoiningPosition = (referrer.partners.length % 2 === 0) ? 'left' : 'right' 
      referrer.partners.push(newUser._id)
      newUser.parent_id = referrer._id;
      newUser.joiningMode = partnersJoiningPosition;
      await referrer.save();

      await referrer.addToBinaryTree(newUser, partnersJoiningPosition , UserModel)
      await referrer.save();
    }
    await newUser.save();
    res.status(201).json({ success: true, message: "All users added successfully.", data: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/show-tree/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const treeData = await buildTree(userId);
    if (!treeData) {
      return res.status(500).json({ success: false, message: 'User not found or no tree data available' });
    }
    res.status(200).json({ success: true, treeData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/tree-downline/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sdf = await getDownlineUsers(userId)
    res.status(200).json({ success: true, data: sdf });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.post('/add-user/two-by-two', async (req, res) => {
  try {
    const { userId, userName, activationFee, purchaseAmount, rebirthFee, totalNetReward, upgradationFee } = req.body;
    if (!userId || !userName || !activationFee || !purchaseAmount || !rebirthFee || !totalNetReward || !upgradationFee) {
      throw new Error(`All fields are required for userId: ${userId || 'Unknown'}`);
    }
    let packageTwoByTwo = await PackageTwoByTwoModel.findOne({ amount: 25 });
    if (!packageTwoByTwo) {
      packageTwoByTwo = new PackageTwoByTwoModel({ amount: 25 });
      await packageTwoByTwo.save();
    }
    const newUserTwoByTwoData = new UserTwoByTwoModel({ userId, username: userName, investment: purchaseAmount, activationFees: activationFee, netRewardFees: 1.5, rebirthFees: 1, upgrationFees: 2.5, currentTierCount: 1 });

    const finalEnterTwoUser = await FinalEnterTwoByTwoModel.findOne({ userId: userId });
    if (!finalEnterTwoUser) {
      const newFinalUser = new FinalEnterTwoByTwoModel({ userId: userId, username: userName, investment: purchaseAmount, activationFees: activationFee, upgrationFees: 0, rebirthFees: 0, restrebirthFees: 0, netRewardFees: 0, currentTierCount: 1 });
      await newFinalUser.save();
    } else {
      finalEnterTwoUser.activationFees += activationFee;
      finalEnterTwoUser.netRewardFees += 0;
      finalEnterTwoUser.rebirthFees += 0;
      finalEnterTwoUser.restrebirthFees += 0;
      finalEnterTwoUser.upgrationFees += 0;
      await finalEnterTwoUser.save();
    }

    if (packageTwoByTwo) {
      packageTwoByTwo.tier1.push(newUserTwoByTwoData);
      await packageTwoByTwo.save();
    }

    // const newRebirth = new RebirthTwoByTwoModel({ clientId: newUserTwoByTwoData._id, activationFees: newUserTwoByTwoData.activationFees, currentTierCount: 1, investment: newUserTwoByTwoData.investment, netRewardFees: newUserTwoByTwoData.netRewardFees, rebirthAuto: newUserTwoByTwoData.rebirthAuto, rebirthFees: newUserTwoByTwoData.rebirthFees, upgrationFees: newUserTwoByTwoData.upgrationFees })
    // newUserTwoByTwoData.history.push(newRebirth._id);
    // await newRebirth.save()
    await newUserTwoByTwoData.save();

    res.status(201).json({ success: true, message: "All users added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/add-package/:id', async (req, res) => {
  try {
    const { amount, packageName } = req.body;
    if (!amount || !packageName) {
      throw new Error(`All fields are required for clientId: ${clientId || 'Unknown'}`);
    }
    const user = await UserModel.findById(req.params.id);
    const newPurchase = new PurchaseModel({ amount, packageName, clientId: user._id });
    user.invastment += Number(amount);
    user.is_active = true;
    if(!user.active_date){
      user.active_date = new Date();
    }
    user.parchases.push(newPurchase._id);
    await newPurchase.save();
    await user.save();
    res.status(201).json({ success: true, message: "Purchase added successfully.", data: newPurchase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/find-user/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate('teamsIncome.history').populate({
      path: "teams",
      populate: [
          { path: "leftTeam", model: "User",select:'name _id invastment' },
          { path: "rightTeam", model: "User",select:'name _id invastment' }
      ]
  });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Route to add a new slot for a package
router.post('/add-user/two-by-eight', async (req, res) => {
  try {
    const { userId, userName, activationFee, purchaseAmount, rebirthFee, totalNetReward, upgradationFee } = req.body;
    if (!userId || !userName || !activationFee || !purchaseAmount || !rebirthFee || !totalNetReward || !upgradationFee) {
      throw new Error(`All fields are required for userId: ${userId || 'Unknown'}`);
    }
    let packageTwoByEight = await PackageTwoByEightModel.findOne({ amount: 25 });
    if (!packageTwoByEight) {
      packageTwoByEight = new PackageTwoByEightModel({ amount: 25 });
      await packageTwoByEight.save();
    }
    const newUserTwoByEightData = new UserTwoByEightModel({ userId, username: userName, investment: purchaseAmount, activationFees: activationFee, netRewardFees: 1.5, rebirthFees: 1, upgrationFees: 2.5, currentTierCount: 1 });

    const finalEnterEightUser = await FinalEnterTwoByEightModel.findOne({ userId });
    if (!finalEnterEightUser) {
      const newFinalUser = new FinalEnterTwoByEightModel({ userId: userId, username: userName, investment: purchaseAmount, activationFees: activationFee, upgrationFees: 0, rebirthFees: 0, restrebirthFees: 0, netRewardFees: 0, currentTierCount: 1 });
      await newFinalUser.save();
    } else {
      finalEnterEightUser.activationFees += activationFee;
      finalEnterEightUser.netRewardFees += 0;
      finalEnterEightUser.rebirthFees += 0;
      finalEnterEightUser.restrebirthFees += 0;
      finalEnterEightUser.upgrationFees += 0;
      await finalEnterEightUser.save();
    }
    if (packageTwoByEight) {
      packageTwoByEight.tier1.push(newUserTwoByEightData);
      await packageTwoByEight.save();
    }
    // const newRebirth = new RebirthTwoByEightModel({ clientId: newUserTwoByEightData._id, activationFees: newUserTwoByEightData.activationFees, currentTierCount: 1, investment: newUserTwoByEightData.investment, netRewardFees: newUserTwoByEightData.netRewardFees, rebirthAuto: newUserTwoByEightData.rebirthAuto, rebirthFees: newUserTwoByEightData.rebirthFees, upgrationFees: newUserTwoByEightData.upgrationFees })
    // newUserTwoByEightData.history.push(newRebirth._id);
    // await newRebirth.save()
    await newUserTwoByEightData.save();
    res.status(201).json({ success: true, message: "All users added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/add-user-binary', async (req, res) => {
  try {
    const { userId, userName, activationFee, purchaseAmount, rebirthFee, totalNetReward, upgradationFee } = req.body;

    if (!userId || !userName || !activationFee || !purchaseAmount || !rebirthFee || !totalNetReward || !upgradationFee) {
      throw new Error(`All fields are required for userId: ${userId || 'Unknown'}`);
    }

    // Retrieve or create the binary tree structure packages
    let packageTwoByTwo = await PackageTwoByTwoModel.findOne({ amount: 25 });
    if (!packageTwoByTwo) {
      packageTwoByTwo = new PackageTwoByTwoModel({ amount: 25 });
      await packageTwoByTwo.save();
    }

    let packageTwoByEight = await PackageTwoByEightModel.findOne({ amount: 25 });
    if (!packageTwoByEight) {
      packageTwoByEight = new PackageTwoByEightModel({ amount: 25 });
      await packageTwoByEight.save();
    }

    // Create new user data for both models
    const newUserTwoByTwoData = new UserTwoByTwoModel({
      userId,
      username: userName,
      investment: purchaseAmount,
      activationFees: activationFee,
      netRewardFees: totalNetReward,
      rebirthFees: rebirthFee,
      upgrationFees: upgradationFee
    });

    const newUserTwoByEightData = new UserTwoByEightModel({
      userId,
      username: userName,
      investment: purchaseAmount,
      activationFees: activationFee,
      netRewardFees: totalNetReward,
      rebirthFees: rebirthFee,
      upgrationFees: upgradationFee
    });

    const finalEnterTwoUser = await FinalEnterTwoByTwoModel.findOne({ userId });
    if (!finalEnterTwoUser) {
      const newFinalUser = new FinalEnterTwoByTwoModel({
        userId,
        username: userName,
        investment: purchaseAmount,
        activationFees: activationFee,
        upgrationFees: upgradationFee,
        rebirthFees: rebirthFee,
        restrebirthFees: rebirthFee,
        netRewardFees: totalNetReward,
        currentTierCount: 1
      });
      await newFinalUser.save();
    } else {
      finalEnterTwoUser.netRewardFees += totalNetReward;
      finalEnterTwoUser.activationFees += activationFee;
      finalEnterTwoUser.rebirthFees += rebirthFee;
      finalEnterTwoUser.restrebirthFees += rebirthFee;
      finalEnterTwoUser.upgrationFees += upgradationFee;
      await finalEnterTwoUser.save();
    }

    // Add new user to the two-by-two package
    packageTwoByTwo.tier1.push(newUserTwoByTwoData);
    await packageTwoByTwo.save();
    await newUserTwoByTwoData.save();

    // Update or create final entry for two-by-eight
    const finalEnterEightUser = await FinalEnterTwoByEightModel.findOne({ userId });
    if (!finalEnterEightUser) {
      const newFinalUser = new FinalEnterTwoByEightModel({
        userId,
        username: userName,
        investment: purchaseAmount,
        activationFees: activationFee,
        upgrationFees: upgradationFee,
        rebirthFees: rebirthFee,
        restrebirthFees: rebirthFee,
        netRewardFees: totalNetReward,
        currentTierCount: 1
      });
      await newFinalUser.save();
    } else {
      finalEnterEightUser.netRewardFees += totalNetReward;
      finalEnterEightUser.activationFees += activationFee;
      finalEnterEightUser.rebirthFees += rebirthFee;
      finalEnterEightUser.restrebirthFees += rebirthFee;
      finalEnterEightUser.upgrationFees += upgradationFee;
      await finalEnterEightUser.save();
    }

    // Add new user to the two-by-eight package
    packageTwoByEight.tier1.push(newUserTwoByEightData);
    await packageTwoByEight.save();
    await newUserTwoByEightData.save();

    res.status(201).json({ success: true, message: "All users added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// ------------- USERS REPORTS  TWO - EIGHT START ---------------------------
router.get('/admin/two-by-two-reports', async (req, res) => {
  try {
    const users = await UserTwoByTwoModel.find({ rebirthAuto: { $ne: 'Auto' } },{currentTierHistory:0,history:0,slothistory:0,leftChild:0,rightChild:0});
    res.status(200).json({ success: true, data:users,message:"Two By Two users" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/admin/rebirth/two-by-two-reports', async (req, res) => {
  try {
    const users = await UserTwoByTwoModel.find({ rebirthAuto: { $ne: null }},{currentTierHistory:0,history:0,slothistory:0,leftChild:0,rightChild:0});
    res.status(200).json({ success: true, data:users,message:"Two By Two users Rebirth"  });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/admin/two-by-eight-reports', async (req, res) => {
  try {
    const users = await UserTwoByEightModel.find({ rebirthAuto: { $ne: 'Auto' } },{currentTierHistory:0,history:0,slothistory:0,leftChild:0,rightChild:0});
    res.status(200).json({ success: true, data:users,message:"Two By Eight users" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/admin/rebirth/two-by-eight-reports', async (req, res) => {
  try {
    const users = await UserTwoByEightModel.find({ rebirthAuto: { $ne: null } },{currentTierHistory:0,history:0,slothistory:0,leftChild:0,rightChild:0});
    res.status(200).json({ success: true, data:users,message:"Two By Eight users Rebirth"  });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// ------------- USERS REPORTS  TWO - EIGHT START ---------------------------







router.get('/users/two-by-two/:id', async (req, res) => {
  try {
    const users = await UserTwoByTwoModel.find({ userId: req.params.id, rebirthAuto: { $ne: 'Auto' } });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------- CLIENT SIDE START ----------------------------
router.get('/users/two-by-two/summary/:id', async (req, res) => {
  try {
    const usersNotRebirth = await UserTwoByTwoModel.find({ userId: req.params.id, rebirthAuto: { $ne: 'Auto' } });
    const totalActivation = usersNotRebirth.reduce((total, user) => total + user.activationFees, 0);
    const totalRebirth = usersNotRebirth.reduce((total, user) => total + user.rebirthFees, 0);
    const totalNetReward = usersNotRebirth.reduce((total, user) => total + user.netRewardFees, 0);
    const totalUpgrationFees = usersNotRebirth.reduce((total, user) => total + user.upgrationFees, 0);
    const totalInvestment = usersNotRebirth.reduce((total, user) => total + user.investment, 0);

    const usersNotRebirthAuto = await UserTwoByTwoModel.find({ userId: req.params.id, rebirthAuto: { $ne: null } });
    const totalActivationAuto = usersNotRebirthAuto.reduce((total, user) => total + user.activationFees, 0);
    const totalRebirthAuto = usersNotRebirthAuto.reduce((total, user) => total + user.rebirthFees, 0);
    const totalNetRewardAuto = usersNotRebirthAuto.reduce((total, user) => total + user.netRewardFees, 0);
    const totalUpgrationFeesAuto = usersNotRebirthAuto.reduce((total, user) => total + user.upgrationFees, 0);
    const totalInvestmentAuto = usersNotRebirthAuto.reduce((total, user) => total + user.investment, 0);

    res.status(200).json({
      success: true,
      users: {
        totalActivation,
        totalRebirth,
        totalNetReward,
        totalUpgrationFees,
        totalInvestment
      },
      usersAuto: {
        totalActivationAuto,
        totalRebirthAuto,
        totalNetRewardAuto,
        totalUpgrationFeesAuto,
        totalInvestmentAuto
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/users/two-by-eight/summary/:id', async (req, res) => {
  try {
    const usersNotRebirth = await UserTwoByEightModel.find({ userId: req.params.id, rebirthAuto: { $ne: 'Auto' } });
    const totalActivation = usersNotRebirth.reduce((total, user) => total + user.activationFees, 0);
    const totalRebirth = usersNotRebirth.reduce((total, user) => total + user.rebirthFees, 0);
    const totalNetReward = usersNotRebirth.reduce((total, user) => total + user.netRewardFees, 0);
    const totalUpgrationFees = usersNotRebirth.reduce((total, user) => total + user.upgrationFees, 0);
    const totalInvestment = usersNotRebirth.reduce((total, user) => total + user.investment, 0);

    const usersNotRebirthAuto = await UserTwoByEightModel.find({ userId: req.params.id, rebirthAuto: { $ne: null } });
    const totalActivationAuto = usersNotRebirthAuto.reduce((total, user) => total + user.activationFees, 0);
    const totalRebirthAuto = usersNotRebirthAuto.reduce((total, user) => total + user.rebirthFees, 0);
    const totalNetRewardAuto = usersNotRebirthAuto.reduce((total, user) => total + user.netRewardFees, 0);
    const totalUpgrationFeesAuto = usersNotRebirthAuto.reduce((total, user) => total + user.upgrationFees, 0);
    const totalInvestmentAuto = usersNotRebirthAuto.reduce((total, user) => total + user.investment, 0);

    res.status(200).json({
      success: true,
      users: {
        totalActivation,
        totalRebirth,
        totalNetReward,
        totalUpgrationFees,
        totalInvestment
      },
      usersAuto: {
        totalActivationAuto,
        totalRebirthAuto,
        totalNetRewardAuto,
        totalUpgrationFeesAuto,
        totalInvestmentAuto
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// ---------------- CLIENT SIDE END ----------------------------



router.get('/users/final-user/:id', async (req, res) => {
  try {
    const finalTwoUser = await FinalEnterTwoByTwoModel.findOne({ userId: req.params.id });
    const finalEightUser = await FinalEnterTwoByEightModel.findOne({ userId: req.params.id });
    res.status(201).json({ success: true, data: { finalTwoUser, finalEightUser } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/users/rebirth/two-by-two/:id', async (req, res) => {
  try {
    const users = await UserTwoByTwoModel.find({ userId: req.params.id, rebirthAuto: { $ne: null } });
    res.status(201).json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
})

router.get('/users/rebirth-history/two-by-two/:id', async (req, res) => {
  try {
    const user = await UserTwoByTwoModel.findById(req.params.id);
    const rebirths = await RebirthTwoByTwoModel.find({ _id: user.history }).populate('clientId')
    res.status(201).json({ success: true, data: rebirths });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
})

router.get('/admin/two-by-eight-reports', async (req, res) => {
  try {
    const users = await UserTwoByEightModel.find();
    const totalActivationFees = users.reduce((total, user) => total + user.activationFees, 0);
    res.status(200).json({ success: true, users, totalActivationFees });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
})

router.get('/admin/total-count-reports', async (req, res) => {
  try {
    const usersTwo = await FinalEnterTwoByTwoModel.find();
    const totalActivationTwoFees = usersTwo.reduce((total, user) => total + user.activationFees, 0);
    const totalRebirthTwoFees = usersTwo.reduce((total, user) => total + user.rebirthFees, 0);
    const totalUpgrationTwoFees = usersTwo.reduce((total, user) => total + user.upgrationFees, 0);
    const totalNetRewardTwoFees = usersTwo.reduce((total, user) => total + user.netRewardFees, 0);
    const totalRestrebirthTwoFees = usersTwo.reduce((total, user) => total + user.restrebirthFees, 0);

    const usersEight = await FinalEnterTwoByEightModel.find();
    const totalActivationEightFees = usersEight.reduce((total, user) => total + user.activationFees, 0);
    const totalRebirthEightFees = usersEight.reduce((total, user) => total + user.rebirthFees, 0);
    const totalUpgrationEightFees = usersEight.reduce((total, user) => total + user.upgrationFees, 0);
    const totalNetRewardEightFees = usersEight.reduce((total, user) => total + user.netRewardFees, 0);
    const totalRestrebirthEightFees = usersEight.reduce((total, user) => total + user.restrebirthFees, 0);
    
    
    const levels = await LevelModel.find({},{amount:1});
    const totalLeaderBoardIncome = levels.reduce((total, user) => total + user.amount, 0);

    const matchingIncome = await TeamIncomeModel.find({},{amount:1});
    const totalMatchingIncome = matchingIncome.reduce((total, user) => total + user.amount, 0);

    const usersTwoRebirth = await UserTwoByTwoModel.find({ userId: req.params.id, rebirthAuto: { $ne: null } });
    const totalRebithTwoRebirth = usersTwoRebirth.reduce((total, user) => total + user.rebirthFees, 0);
    const totalRebithTwoReward = usersTwoRebirth.reduce((total, user) => total + user.netRewardFees, 0);
    const totalRebirthTwoUpgrade = usersTwoRebirth.reduce((total, user) => total + user.upgrationFees, 0);

    const usersEightRebirth = await UserTwoByEightModel.find({ userId: req.params.id, rebirthAuto: { $ne: null } });
    const totalRebithEightRebirth = usersEightRebirth.reduce((total, user) => total + user.rebirthFees, 0);
    const totalRebithEightReward = usersEightRebirth.reduce((total, user) => total + user.netRewardFees, 0);
    const totalRebirthEightUpgrade = usersEightRebirth.reduce((total, user) => total + user.upgrationFees, 0);
    

    
    const totalIncome = totalActivationTwoFees + totalRebirthTwoFees + totalUpgrationTwoFees + totalNetRewardTwoFees + totalActivationEightFees + totalRebirthEightFees + totalUpgrationEightFees + totalNetRewardEightFees
    

    const data = {
      twoByTwo:{
        totalActivation:totalActivationTwoFees,
        totalUpgration:totalUpgrationTwoFees,
        totalNetReward:totalNetRewardTwoFees,
        totalRebirth:totalRebithTwoRebirth,
        // totalRebirth:totalRebirthTwoFees,
        totalRestrebirth:totalRestrebirthTwoFees,
        rebirthD:{
          rebirth:totalRebithTwoRebirth,
          reward:totalRebithTwoReward,
          upgrade:totalRebirthTwoUpgrade,
          count:usersTwoRebirth.length,
          totalRestrebirth:totalRestrebirthTwoFees,
        }
      },
      twoByEight:{
        totalActivation:totalActivationEightFees,
        totalUpgration:totalUpgrationEightFees,
        totalNetReward:totalNetRewardEightFees,
        totalRebirth:totalRebithEightRebirth,
        // totalRebirth:totalRebirthEightFees,
        totalRestrebirth:totalRestrebirthEightFees,
        rebirthD:{
          rebirth:totalRebithEightRebirth,
          reward:totalRebithEightReward,
          upgrade:totalRebirthEightUpgrade,
          count:usersEightRebirth.length,
          totalRestrebirth:totalRestrebirthEightFees,
        }
      },
      totalLeaderBoardIncome,
      totalMatchingIncome,
      totalIncome
    }

    



    res.status(200).json({ success: true, data, message:"Admin Total Count" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
})


router.get('/users/two-by-eight/:id', async (req, res) => {
  try {
    const users = await UserTwoByEightModel.find({ userId: req.params.id, rebirthAuto: { $ne: 'Auto' } });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
})

router.get('/users/rebirth/two-by-eight/:id', async (req, res) => {
  try {
    const users = await UserTwoByEightModel.find({ userId: req.params.id, rebirthAuto: { $ne: null } });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
})

router.get('/users/rebirth-history/two-by-eight/:id', async (req, res) => {
  try {
    const user = await UserTwoByEightModel.findById(req.params.id);
    const rebirths = await RebirthTwoByEightModel.find({ _id: user.history }).populate('clientId')
    res.status(200).json({ success: true, data: rebirths });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
})

router.get('/admin/final-users/two-by-two', async (req, res) => {
  try {
    const users = await FinalEnterTwoByTwoModel.find();
    const totalActivationFees = users.reduce((total, user) => total + user.activationFees, 0);
    const totalNetRewardFees = users.reduce((total, user) => total + user.netRewardFees, 0);
    const totalRebirthFees = users.reduce((total, user) => total + user.rebirthFees, 0);
    const totalRestrebirthFees = users.reduce((total, user) => total + user.restrebirthFees, 0);
    const totalUpgrationFees = users.reduce((total, user) => total + user.upgrationFees, 0);
    res.status(200).json({ success: true, users,message:'Final-Two-By-Two', total:{totalActivationFees,totalNetRewardFees,totalRebirthFees,totalRestrebirthFees,totalUpgrationFees} });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
})

router.get('/final-users/two-by-two/:id', async (req, res) => {
  try {
    const users = await FinalEnterTwoByTwoModel.findOne({ userId: req.params.id });
    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
})

router.get('/admin/final-users/two-by-eight', async (req, res) => {
  try {
    const users = await FinalEnterTwoByEightModel.find();
    const totalActivationFees = users.reduce((total, user) => total + user.activationFees, 0);
    const totalNetRewardFees = users.reduce((total, user) => total + user.netRewardFees, 0);
    const totalRebirthFees = users.reduce((total, user) => total + user.rebirthFees, 0);
    const totalRestrebirthFees = users.reduce((total, user) => total + user.restrebirthFees, 0);
    const totalUpgrationFees = users.reduce((total, user) => total + user.upgrationFees, 0);
    res.status(200).json({ success: true, users,message:'Final-Two-By-Eight', total:{totalActivationFees,totalNetRewardFees,totalRebirthFees,totalRestrebirthFees,totalUpgrationFees} });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/final-users/two-by-eight/:id', async (req, res) => {
  try {
    const users = await FinalEnterTwoByEightModel.findOne({ userId: req.params.id });
    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
router.get('/user/total-count-reports/:id/:nodeId', async (req, res) => {
  try {
    // TWO BY EIGHT START --------------------------
    const usersEight = await FinalEnterTwoByEightModel.findOne({ userId: req.params.id });
    const userTwoByEight = await UserTwoByEightModel.find({ userId: req.params.id, rebirthAuto: { $ne: 'Auto' } });
    const rebirthTwoByEightAuto = await UserTwoByEightModel.find({ userId: req.params.id, rebirthAuto: { $ne: null } });
    const totalUpgrationFeesAutoEight = rebirthTwoByEightAuto.reduce((total, user) => total + user.upgrationFees, 0);
    const totalRebirthAutoEight = rebirthTwoByEightAuto.reduce((total, user) => total + user.rebirthFees, 0);

    // TWO BY EIGHT EIGHT --------------------------
    const usersTwo = await FinalEnterTwoByTwoModel.findOne({ userId: req.params.id });
    const userTwoByTwo = await UserTwoByTwoModel.find({ userId: req.params.id, rebirthAuto: { $ne: 'Auto' } })
    const rebirthTwoByTwoAuto = await UserTwoByTwoModel.find({ userId: req.params.id, rebirthAuto: { $ne: null } });
    const totalUpgrationFeesAutoTwo = rebirthTwoByTwoAuto.reduce((total, user) => total + user.upgrationFees, 0);
    const totalRebirthAutoTwo = rebirthTwoByTwoAuto.reduce((total, user) => total + user.rebirthFees, 0);
    const mainUser = await UserModel.findById(req.params.nodeId);

    const data = {
      twoByEight: {
        upgradeFees: usersEight ? usersEight?.upgrationFees : 0 ,
        rebirthFees: rebirthTwoByEightAuto ? totalRebirthAutoEight : 0,
        // rebirthFees: usersEight ? usersEight?.rebirthFees : 0,
        netRewardFees: usersEight ? usersEight?.netRewardFees : 0,
        activationFee:usersEight ? usersEight?.activationFees : 0 ,
        twoByTwoCount:userTwoByEight ? userTwoByEight?.length : 0 ,
        setMatchReward: mainUser ? mainUser?.teamsIncome?.income : 0,
        teamleadrshipreward:mainUser?.levelIncome?.income,
        restDivident: {
          restRebirthFees: usersEight ? usersEight?.restrebirthFees : 0,
          restRebirthCount: rebirthTwoByEightAuto ? rebirthTwoByEightAuto?.length : 0,
          upgradeFees: totalUpgrationFeesAutoEight ? totalUpgrationFeesAutoEight : 0
        },
      },
      twoByTwo: {
        upgradeFees: usersTwo ? usersTwo?.upgrationFees : 0,
        rebirthFees: rebirthTwoByTwoAuto ? totalRebirthAutoTwo : 0,
        // rebirthFees: usersTwo ? usersTwo?.rebirthFees : 0,
        netRewardFees: usersTwo ? usersTwo?.netRewardFees : 0,
        activationFee: usersTwo ? usersTwo?.activationFees : 0,
        twoByTwoCount: userTwoByTwo ? userTwoByTwo?.length : 0,
        setMatchReward: mainUser ? mainUser?.teamsIncome?.income : 0,
        teamleadrshipreward:mainUser?.levelIncome?.income,
        restDivident: {
          restRebirthFees: usersTwo ? usersTwo?.restrebirthFees : 0 ,
          restRebirthCount: rebirthTwoByTwoAuto ? rebirthTwoByTwoAuto?.length : 0,
          upgradeFees: totalUpgrationFeesAutoTwo ? totalUpgrationFeesAutoTwo : 0
        },
      },
    }
    res.status(200).json({ success: true, data, message: 'Total count reports' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
})







//----------------------------------------- SLOT CREATE AND TIER START ----------------------------------------
router.get('/users/divide-package-two-by-two/:id', async (req, res) => {
  try {
    const package = await PackageTwoByTwoModel.findOne({ amount: 25 }).populate({
      path: 'tier1 tier2 tier3 tier4 tier5 tier6 tier7 tier8 tier9 tier10 tier11 tier12 tier13 tier14 tier15 tier16 tier17 tier18 tier19 tier20 tier21 tier22 tier23 tier24 tier25 tier26 tier27 tier28 tier29 tier30',
    });
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const tiers = [];
    for (let i = 1; i <= 30; i++) {
      tiers.push(package[`tier${i}`]);
    }

    const slots = Array.from({ length: 15 }, (_, index) => ({
      slotName: `Slot ${index + 1}`,
      users: []
    }));
    const filteredTiers = tiers.filter(tier => tier.some(user => user.userId == req.params.id));
    for (let i = 0; i < filteredTiers.length && i < 30; i += 2) {
      slots[Math.floor(i / 2)].users = [filteredTiers[i], filteredTiers[i + 1] || null];
    }
    res.json({ slots });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/users/divide-package-two-by-eight/:id', async (req, res) => {
  try {
    const package = await PackageTwoByTwoModel.findOne({ amount: 25 }).populate({
      path: 'tier1 tier2 tier3 tier4 tier5 tier6 tier7 tier8',
    });
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const tiers = [];
    for (let i = 1; i <= 30; i++) {
      tiers.push(package[`tier${i}`]);
    }
    const filteredTiers = tiers.filter(tier => tier.some(user => user.userId == req.params.id));
    const newFilter = filteredTiers.map(tier => {
      return { _id: tier._id, currentTierHistory: tier.currentTierHistory };
    });
    res.json({ newFilter });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


//----------------------------------------- SLOT CREATE AND TIER END ----------------------------------------
router.get('/user/two-by-two/:id', async (req, res) => {
  try {
    const user = await UserTwoByTwoModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
})

router.get('/user/two-by-eight/:id', async (req, res) => {
  try {
    const user = await UserTwoByEightModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
})


router.get('/user/divide-package-two-by-eight/:id', async (req, res) => {
  try {
    const user = await UserTwoByEightModel.findById(req.params.id).populate('history');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
})


// ------------------- level incomes start ------------------------------------------
router.get('/user/level-income-history/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id, { _id: 1, email: 1, name: 1 });
    const level = await LevelModel.find({ userId: user._id })
    res.status(200).json({ success: true, data: level, message: "Level Income" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
})

router.get('/admin/leaderboard-income-history', async (req, res) => {
  try {
    const level = await LevelModel.find({}).populate({ path: 'userId', select: "name email wallet_address invastment" });
    res.status(200).json({ success: true, data: level, message: "Level Admin Side Income" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})
// ------------------- level incomes End ------------------------------------------


router.get('/user/set-matching-tree/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.status(200).json({ success:true,message:"Matching Users Data",data:user?.teams });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
router.get('/admin/set-matching-tree-users-reports', async (req, res) => {
  try {
    const users = await UserModel.find();
    let allSetMatchingUsers = [];
    for (const user of users) {
      allSetMatchingUsers = user?.teams.length ? [...user?.teams] : [];
    }
    res.status(200).json({ success:true,message:"Matching users admin Data",data:allSetMatchingUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
router.get('/user/set-leaderboard/income-reports/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const history = await TeamIncomeModel.find({_id:user?.teamsIncome?.history});
    res.status(200).json({ success:true,message:"leaderboard Income Data",data:history });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
router.get('/admin/set-matching/income-reports', async (req, res) => {
  try {
    const history = await TeamIncomeModel.find({}).populate({path:'client',select:'name email wallet_address number'});
    res.status(200).json({ success:true,message:"admin Leaderboard Income Data",data:history });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
