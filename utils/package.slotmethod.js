const { FinalEnterTwoByTwoModel, FinalEnterTwoByEightModel } = require("../models/finalenteruser.model");
const { HistoryTwoModel, HistoryEightModel } = require("../models/history.model");
const { RebirthTwoByTwoModel, RebirthTwoByEightModel } = require("../models/rebirth.model");
const { SlotHistoryTwoByTwoModel, SlotHistoryTwoByEightModel } = require("../models/slothistory.model");
const { UserTwoByTwoModel, UserTwoByEightModel } = require("../models/user.model");


// ✅ Core Method
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.packageTwoByTwoSlotMethod = async ({ tier1, tier2, count, doubleAmount, currentTier, dataInsert, up, rebirth, net }) => {
  try {
    const currentTierCount = tier2.length;
    const parent = tier1[currentTierCount];
    if (!parent) return;

    const totalToSlice = (currentTierCount + 1) * count;
    const nextUsers = tier1.slice(currentTierCount * (count - 1), totalToSlice);
    nextUsers.shift();

    if (nextUsers.length === 0) return;

    const parentFind = await UserTwoByTwoModel.findById(parent);
    const parentPopulated = await UserTwoByTwoModel.findById(parent).populate('currentTierHistory');

    if (!parentFind || !parentPopulated) return;

    const totalReward = Number(up + rebirth + net);

    parentFind.globalAutoTwoByTwo.usersCheck = nextUsers;

    const historyIndex = parentPopulated.currentTierHistory.findIndex((entry) => entry.tierCount === (currentTier - 1));
    const status = nextUsers.length >= (count - 1) ? 'ACHIEVED' : 'WAITING';
    const rewardUserCount = nextUsers.length >= (count - 1) ? (count - 1) : nextUsers.length;
    // console.log(nextUsers.length, historyIndex);
    if (historyIndex !== -1) {
      const entry = parentPopulated.currentTierHistory[historyIndex];
      let userCheck = false;
      for (const nextUser of nextUsers) {
        const alreadyAdded = parentFind.globalAutoTwoByTwo.usersAddCheck.includes(nextUser);
        userCheck = alreadyAdded;
      }
      entry.users = nextUsers.slice(0, (count - 1));
      entry.status = status;
      if (!userCheck) {
        // entry.activationFees += totalReward;
        entry.upgrationFees += up;
        entry.rebirthFees += rebirth;
        entry.netRewardFees += net;
        entry.usersCount = nextUsers.length;
      }
      parentPopulated.markModified(`currentTierHistory.${historyIndex}`);
      await entry.save();
    } else {
      const newHistory = new HistoryTwoModel({
        finalId: parentFind.userId,
        userId: parentFind._id,
        tierCount: currentTier - 1,
        usersCount: rewardUserCount,
        usersTargetCount: count - 1,
        status,
        // activationFees: totalReward * rewardUserCount,
        activationFees: totalReward,
        upgrationFees: up * rewardUserCount,
        rebirthFees: rebirth * rewardUserCount,
        netRewardFees: net * rewardUserCount,
        users: nextUsers.slice(0, (count - 1))
      });
      await newHistory.save();
      parentPopulated.currentTierHistory.push(newHistory._id);
    }



    const totalActivation = (nextUsers.length < 1) ? (totalReward) : totalReward;

    for (const nextUser of nextUsers) {
      // await delay(2000); // 2-second delay per user
      const alreadyAdded = parentFind.globalAutoTwoByTwo.usersAddCheck.includes(nextUser);
      if (!alreadyAdded && parentFind.globalAutoTwoByTwo.usersAddCheck.length < (count - 1)) {

        parentFind.currentTierCount = currentTier;
        parentFind.currentTierType = "PARENT";
        parentFind.activationFees = totalActivation;
        parentFind.upgrationFees += up;
        parentFind.rebirthFees += rebirth;
        parentFind.netRewardFees += net;

        const finalEnterUser = await FinalEnterTwoByTwoModel.findOne({ userId: parentFind.userId });
        if (finalEnterUser) {
          finalEnterUser.activationFees = totalActivation;
          finalEnterUser.rebirthFees += rebirth;
          finalEnterUser.netRewardFees += net;
          finalEnterUser.restrebirthFees += rebirth;
          finalEnterUser.upgrationFees += up;
          finalEnterUser.currentTierCount = currentTier;
          await finalEnterUser.save();
        }

        const [newRebirth, newSlotHistory] = await Promise.all([
          RebirthTwoByTwoModel.create({
            clientId: parentFind._id,
            currentTierCount: parentFind.currentTierCount,
            investment: parentFind.investment,
            activationFees: totalReward,
            netRewardFees: net,
            rebirthAuto: parentFind.rebirthAuto,
            rebirthFees: rebirth,
            upgrationFees: up
          }),
          SlotHistoryTwoByTwoModel.create({
            childs: nextUsers,
            parentId: parent,
            currentTierCount: parentFind.currentTierCount,
            investment: parentFind.investment,
            activationFees: totalReward,
            netRewardFees: net,
            rebirthAuto: parentFind.rebirthAuto,
            rebirthFees: rebirth,
            upgrationFees: up
          })
        ]);

        parentPopulated.history.push(newRebirth._id);
        parentPopulated.slothistory.push(newSlotHistory._id);
        parentFind.globalAutoTwoByTwo.usersAddCheck.push(nextUser);
      }
    }

    if (nextUsers.length >= (count - 1)) {
      parentFind.globalAutoTwoByTwo.usersAddCheck = [];
      parentFind.globalAutoTwoByTwo.usersCheck = [];
      tier2.push(parentFind);
      await Promise.all([parentFind.save(), parentPopulated.save()]);
    } else {
      await Promise.all([parentFind.save(), parentPopulated.save()]);
    }
  } catch (error) {
    console.error("❌ Error in packageTwoByTwoSlotMethod:", error.message);
  }
};


exports.packageTwoByEightSlotMethod = async ({ tier1, tier2, count, doubleAmount, currentTier, dataInsert, up, rebirth, net }) => {
  try {
    const currentTierCount = tier2.length;
    const parent = tier1[currentTierCount];
    if (!parent) return;

    const totalToSlice = (currentTierCount + 1) * count;
    const nextUsers = tier1.slice(currentTierCount * (count - 1), totalToSlice);
    nextUsers.shift(); // remove parent itself

    if (nextUsers.length === 0) return;
    const parentFind = await UserTwoByEightModel.findById(parent);
    const parentPopulated = await UserTwoByEightModel.findById(parent).populate('currentTierHistory');

    if (!parentFind || !parentPopulated) return;

    const totalReward = Number(up + rebirth + net);


    // Save next users under parent's check
    parentFind.globalAutoTwoByEight.usersCheck = nextUsers;

    const historyIndex = parentPopulated.currentTierHistory.findIndex((entry) => entry.tierCount === (currentTier - 1));
    const status = nextUsers.length >= (count - 1) ? 'ACHIEVED' : 'WAITING';
    const rewardUserCount = nextUsers.length >= (count - 1) ? (count - 1) : nextUsers.length;
    if (historyIndex !== -1) {
      const entry = parentPopulated.currentTierHistory[historyIndex];
      let userCheck = false;
      for (const nextUser of nextUsers) {
        const alreadyAdded = parentFind.globalAutoTwoByEight.usersAddCheck.includes(nextUser);
        userCheck = alreadyAdded;
      }
      entry.users = nextUsers.slice(0, (count - 1));
      entry.status = status;
      if (!userCheck) {
        // entry.activationFees += totalReward;
        entry.upgrationFees += up;
        entry.rebirthFees += rebirth;
        entry.netRewardFees += net;
        entry.usersCount = nextUsers.length;
      }
    } else {
      const newHistory = new HistoryEightModel({
        finalId: parentFind.userId,
        userId: parentFind._id,
        tierCount: currentTier - 1,
        usersCount: rewardUserCount,
        usersTargetCount: count - 1,
        status,
        // activationFees: totalReward * rewardUserCount,
        activationFees: totalReward,
        upgrationFees: up * rewardUserCount,
        rebirthFees: rebirth * rewardUserCount,
        netRewardFees: net * rewardUserCount,
        users: nextUsers.slice(0, (count - 1))
      });
      await newHistory.save();
      parentPopulated.currentTierHistory.push(newHistory._id);
    }



    // console.log(nextUsers,count-1)
    // console.log(nextUsers.length, count - 1)
    // return

    const totalActivation = (nextUsers.length < 1) ? (totalReward) : totalReward;

    for (const nextUser of nextUsers) {
      const alreadyAdded = parentFind.globalAutoTwoByEight.usersAddCheck.includes(nextUser);
      if (!alreadyAdded && parentFind.globalAutoTwoByEight.usersAddCheck.length < (count - 1)) {

        parentFind.currentTierCount = currentTier;
        parentFind.currentTierType = "PARENT";
        parentFind.activationFees = totalActivation;
        parentFind.upgrationFees += up;
        parentFind.rebirthFees += rebirth;
        parentFind.netRewardFees += net;
        const finalEnterUser = await FinalEnterTwoByEightModel.findOne({ userId: parentFind.userId });
        if (finalEnterUser) {
          finalEnterUser.activationFees = totalActivation;
          finalEnterUser.rebirthFees += rebirth;
          finalEnterUser.netRewardFees += net;
          finalEnterUser.restrebirthFees += rebirth;
          finalEnterUser.upgrationFees += up;
          finalEnterUser.currentTierCount = currentTier;
          await finalEnterUser.save();
        }

        const [newRebirth, newSlotHistory] = await Promise.all([
          new RebirthTwoByEightModel({ clientId: parentFind._id, currentTierCount: parentFind.currentTierCount, investment: parentFind.investment, activationFees: totalReward, netRewardFees: net, rebirthAuto: parentFind.rebirthAuto, rebirthFees: rebirth, upgrationFees: up }).save(),
          new SlotHistoryTwoByEightModel({ childs: nextUsers, parentId: parent, currentTierCount: parentFind.currentTierCount, investment: parentFind.investment, activationFees: totalReward, netRewardFees: net, rebirthAuto: parentFind.rebirthAuto, rebirthFees: rebirth, upgrationFees: up }).save()
        ]);

        parentPopulated.history.push(newRebirth._id);
        parentPopulated.slothistory.push(newSlotHistory._id);
        parentFind.globalAutoTwoByEight.usersAddCheck.push(nextUser);
      }
    }

    await parentPopulated.save();
    await parentFind.save();

    if (nextUsers.length >= (count - 1)) {
      parentFind.globalAutoTwoByEight.usersAddCheck = [];
      parentFind.globalAutoTwoByEight.usersCheck = [];
      await Promise.all([parentFind.save(), parentPopulated.save()]);
      tier2.push(parentFind);
    }
  } catch (error) {
    console.error("Error in packageTwoByEightSlotMethod:", error);
  }
};
