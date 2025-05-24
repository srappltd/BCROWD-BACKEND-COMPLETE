const { PackageTwoByTwoModel,PackageTwoByEightModel } = require("../models/package.model");
const { packageTwoByTwoSlotMethod,packageTwoByEightSlotMethod } = require("./package.slotmethod");


// Static Tier Data
const tierDataTwoByTwo = [ 5, 5, 10, 10, 20, 20, 40, 40, 80, 80, 160, 160, 320, 320, 640, 640, 1280, 1280, 2560, 2560, 5120, 5120, 10240, 10240, 20480, 20480, 40960, 40960, 81920, 81920];

// Reward Mapping Function
const getRewardMapTwoByTwo = async () => {
  const rewardMap = {};
  for (let i = 0; i < 30; i++) {
    const activationFee = tierDataTwoByTwo[i];
    const up = activationFee * 0.5;
    const net = activationFee * 0.3;
    const rebirth = activationFee * 0.2;
    rewardMap[i + 1] = { up, rebirth, net };
  }
  return rewardMap;
};

// Slot Handling Function
const twoByTwoHandSlot = async () => {
  try {
    const rewardMap = await getRewardMapTwoByTwo();

    const package = await PackageTwoByTwoModel.findOne({ amount: 25 });
    if (!package) return;

    const tierConfigs = [{ count: 3, doubleAmount: 1 }, { count: 5, doubleAmount: 2 }];
    const totalTiers = 30;
    let currentTier = 1;

    for (let i = 1; i <= totalTiers; i++) {
      const tier1 = package[`tier${i}`];
      const tier2 = package[`tier${i + 1}`];

      if (!tier1 || !tier2) break;

      const config = tierConfigs[(i - 1) % 2];
      const rewards = rewardMap[currentTier] || { up: 0, rebirth: 0, net: 0 };

      await packageTwoByTwoSlotMethod({
        tier1: tier1,
        tier2: tier2,
        count: config.count,
        doubleAmount: config.doubleAmount,
        dataInsert: i === 1,
        currentTier: currentTier,
        up: rewards.up,
        rebirth: rewards.rebirth,
        net: rewards.net
      });
      currentTier++;
    }

    // Final Tier to CompletedUser
    const finalTier = package[`tier${totalTiers}`];
    if (finalTier && package.completedUser) {
      const config = tierConfigs[(totalTiers -1 ) % 2];
      const rewards = rewardMap[currentTier] || { up: 0, rebirth: 0, net: 0 };

      // Add next tier activation fee (if available) to net
      const nextTierFee = tierDataTwoByTwo[totalTiers] || 0;
      rewards.net += nextTierFee;

      await packageTwoByTwoSlotMethod({
        tier1: finalTier,
        tier2: package.completedUser,
        count: config.count,
        doubleAmount: config.doubleAmount,
        dataInsert: false,
        currentTier: currentTier,
        up: 0,
        rebirth: rewards.rebirth,
        net: rewards.net + rewards.up
      });
    }

    await package.save();
  } catch (err) {
    console.log("Error in twoByTwoHandSlot:", err.message);
  }
};


// Tier Activation Fees for TwoByEight
const tierDataTwoByEight = [5, 5, 10, 40, 320, 5120, 163840, 10485760];

// Reward Mapping Function
const getRewardMapTwoByEight = async () => {
  const rewardMap = {};
  for (let i = 0; i < tierDataTwoByEight.length; i++) {
    if(i < 7){
      const activationFee = tierDataTwoByEight[i];
      const up = activationFee * 0.5;
      const rebirth = activationFee * 0.2;
      const net = activationFee * 0.3;
      rewardMap[i + 1] = { up, rebirth, net }; // Tier starts from 1
      // console.log("rewardMap", i);
    }else{
      const activationFee = tierDataTwoByEight[i];
      const up = 0;
      const rebirth = activationFee * 0.2;
      const net = activationFee * 0.8;
      rewardMap[i + 1] = { up, rebirth, net }; // Tier starts from 1
    }
  }
  return rewardMap;
};

// Main Execution Function
const twoByEightHandSlot = async () => {
  try {
    const pkg = await PackageTwoByEightModel.findOne({ amount: 25 });
    if (!pkg) return;

    const rewardMap = await getRewardMapTwoByEight();

    const tierConfig = [
      { from: 'tier1', to: 'tier2', count: 3, doubleAmount: 1 },
      { from: 'tier2', to: 'tier3', count: 5, doubleAmount: 1 },
      { from: 'tier3', to: 'tier4', count: 9, doubleAmount: 2 },
      { from: 'tier4', to: 'tier5', count: 17, doubleAmount: 4 },
      { from: 'tier5', to: 'tier6', count: 33, doubleAmount: 8 },
      { from: 'tier6', to: 'tier7', count: 65, doubleAmount: 16 },
      { from: 'tier7', to: 'tier8', count: 129, doubleAmount: 32 },
      { from: 'tier8', to: 'completedUser', count: 257, doubleAmount: 64 },
    ];

    for (let i = 0; i < tierConfig.length; i++) {
      const { from, to, count, doubleAmount } = tierConfig[i];
      const rewards = rewardMap[i + 1] || { up: 0, rebirth: 0, net: 0 };

      // Add next tier activation fee into net for final upgrade
      if (i === tierConfig.length - 1) {
        const nextTierFee = tierDataTwoByEight[i + 1] || 0;
        rewards.net += nextTierFee;
      }

      await packageTwoByEightSlotMethod({
        tier1: pkg[from],
        tier2: pkg[to],
        count,
        doubleAmount,
        currentTier: i + 1,
        dataInsert: i === 0,
        up: rewards.up,
        rebirth: rewards.rebirth,
        net: rewards.net
      });
    }

    await pkg.save();
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (err) {
    console.error("Error in twoByEightHandSlot:", err.message);
  }
};

module.exports = {twoByTwoHandSlot,twoByEightHandSlot}