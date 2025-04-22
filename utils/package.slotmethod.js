const { FinalEnterTwoByTwoModel, FinalEnterTwoByEightModel } = require("../models/finalenteruser.model");
const { RebirthTwoByTwoModel, RebirthTwoByEightModel } = require("../models/rebirth.model");
const { SlotHistoryTwoByTwoModel, SlotHistoryTwoByEightModel } = require("../models/slothistory.model");
const { UserTwoByTwoModel, UserTwoByEightModel } = require("../models/user.model");




// ----------------------------------- TWO BY TWO METHOD CREATE START ------------------------------------------------------
exports.packageTwoByTwoSlotMethod = async ({ tier1, tier2, count, doubleAmount, currentTier, dataInsert }) => {
    try {
        const currentTierCount = tier2.length;
        const parent = tier1[currentTierCount];
        if (!parent) return;
        const nextUsers = tier1.slice(currentTierCount * (count - 1), (currentTierCount + 1) * (count));
        nextUsers.shift();
        if (nextUsers.length == 0) return;
        const parentFind = await UserTwoByTwoModel.findById(parent);
        if (!parentFind) return;
        const parent2Find = await UserTwoByTwoModel.findById(parent);
        if (!parent2Find) return;
        const index = parent2Find.currentTierHistory.findIndex(
            (entry) => entry.tierCount === (currentTier - 1)
        );
        if (nextUsers.length != 0) {
            if (index !== -1) {
                if (nextUsers.length < (count - 1)) {
                    parent2Find.currentTierHistory[index].usersCount = nextUsers.length;
                    parent2Find.currentTierHistory[index].status = 'WAITING';
                } else {
                    parent2Find.currentTierHistory[index].usersCount = nextUsers.length;
                    parent2Find.currentTierHistory[index].status = 'ACHIEVED';
                    parent2Find.currentTierHistory[index].activationFees = parent2Find.activationFees;
                    parent2Find.currentTierHistory[index].upgrationFees = parent2Find.upgrationFees;
                    parent2Find.currentTierHistory[index].rebirthFees = parent2Find.rebirthFees;
                    parent2Find.currentTierHistory[index].netRewardFees = parent2Find.netRewardFees;
                }
            } else {
                parent2Find.currentTierHistory.push({ tierCount: currentTier - 1, usersCount: 0 < nextUsers.length, status: 'WAITING', usersTargetCount: count - 1, activationFees: parent2Find.activationFees, upgrationFees: parent2Find.upgrationFees, rebirthFees: parent2Find.rebirthFees, netRewardFees: parent2Find.netRewardFees });
            }
        }

        await parent2Find.save();
        if (nextUsers.length < (count - 1)) return;
        // if (dataInsert) {
        //     parentFind.activationFees = 5;
        //     parentFind.upgrationFees = 2.5;
        //     parentFind.rebirthFees = 1;
        //     parentFind.netRewardFees = 1.5;
        //     const finalEnterUserSingle = await FinalEnterTwoByTwoModel.findOne({ userId: parentFind.userId });
        //     finalEnterUserSingle.activationFees += 5;
        //     finalEnterUserSingle.upgrationFees += 2.5;
        //     finalEnterUserSingle.rebirthFees += 1;
        //     finalEnterUserSingle.netRewardFees += 1.5;
        //     await finalEnterUserSingle.save();
        // }
        parentFind.currentTierCount = currentTier;
        parentFind.currentTierType = "PARENT";
        parentFind.activationFees *= doubleAmount;
        parentFind.upgrationFees *= doubleAmount;
        parentFind.rebirthFees *= doubleAmount;
        parentFind.netRewardFees *= doubleAmount;
        parentFind.currentTierCount = currentTier;

        const finalEnterUser = await FinalEnterTwoByTwoModel.findOne({ userId: parentFind.userId });

        if (finalEnterUser) {
            if (doubleAmount % 2 === 0) {
                finalEnterUser.activationFees += parent2Find.activationFees;
                finalEnterUser.rebirthFees += parent2Find.rebirthFees;
                finalEnterUser.netRewardFees += parent2Find.netRewardFees;
                finalEnterUser.restrebirthFees += parent2Find.rebirthFees;
            }
            finalEnterUser.currentTierCount = currentTier;
        }
        const newRebirth = new RebirthTwoByTwoModel({ clientId: parentFind._id, activationFees: parentFind.activationFees, currentTierCount: parentFind.currentTierCount, investment: parentFind.investment, netRewardFees: parentFind.netRewardFees, rebirthAuto: parentFind.rebirthAuto, rebirthFees: parentFind.rebirthFees, upgrationFees: parentFind.upgrationFees })
        const newSlotHistory = new SlotHistoryTwoByTwoModel({ childs: nextUsers, parentId: parent, activationFees: parentFind.activationFees, currentTierCount: parentFind.currentTierCount, investment: parentFind.investment, netRewardFees: parentFind.netRewardFees, rebirthAuto: parentFind.rebirthAuto, rebirthFees: parentFind.rebirthFees, upgrationFees: parentFind.upgrationFees })

        parent2Find.history.push(newRebirth._id);
        parent2Find.slothistory.push(newSlotHistory._id);
        await newRebirth.save()
        await newSlotHistory.save()
        await finalEnterUser.save();
        await parentFind.save();
        await parent2Find.save();
        tier2.push(parentFind);
    } catch (error) {
        console.error("Error in packageTwoByTwoSlotMethod:", error);
    }
};
// ----------------------------------- TWO BY TWO METHOD CREATE END ------------------------------------------------------





// ----------------------------------- TWO BY EIGHT METHOD CREATE START ------------------------------------------------------
exports.packageTwoByEightSlotMethod = async ({ tier1, tier2, count, doubleAmount, currentTier, dataInsert }) => {
    try {
        const currentTierCount = tier2.length;
        const parent = tier1[currentTierCount];
        if (!parent) return;
        // const nextUsers = tier1.slice(currentTierCount * count, (currentTierCount + 1) * count);
        const nextUsers = tier1.slice(currentTierCount * (count - 1), (currentTierCount + 1) * (count));
        nextUsers.shift();
        const parentFind = await UserTwoByEightModel.findById(parent);
        if (!parentFind) return;
        const parent2Find = await UserTwoByEightModel.findById(parent);
        if (!parent2Find) return;
        // Find index of existing tierCount
        const allFind = await UserTwoByEightModel.find({ _id: parent });
        const index = parent2Find.currentTierHistory.findIndex(
            (entry) => entry.tierCount === (currentTier - 1)
        );
        if (nextUsers.length != 0) {
            if (index !== -1) {
                if (nextUsers.length < (count - 1)) {
                    parent2Find.currentTierHistory[index].usersCount = nextUsers.length;
                    parent2Find.currentTierHistory[index].status = 'WAITING';
                } else {
                    parent2Find.currentTierHistory[index].usersCount = nextUsers.length;
                    parent2Find.currentTierHistory[index].status = 'ACHIEVED';
                    parent2Find.currentTierHistory[index].activationFees = parent2Find.activationFees;
                    parent2Find.currentTierHistory[index].upgrationFees = parent2Find.upgrationFees;
                    parent2Find.currentTierHistory[index].rebirthFees = parent2Find.rebirthFees;
                    parent2Find.currentTierHistory[index].netRewardFees = parent2Find.netRewardFees;
                }
            } else {
                parent2Find.currentTierHistory.push({ tierCount: currentTier - 1, usersCount: nextUsers.length, status: 'WAITING', usersTargetCount: (count - 1), activationFees: parent2Find.activationFees, upgrationFees: parent2Find.upgrationFees, rebirthFees: parent2Find.rebirthFees, netRewardFees: parent2Find.netRewardFees });
            }
        }
        await parent2Find.save();
        if (nextUsers.length < (count - 1)) return;
        // if (dataInsert) {
        //     parentFind.activationFees = 5;
        //     parentFind.upgrationFees = 2.5;
        //     parentFind.rebirthFees = 1;
        //     parentFind.netRewardFees = 1.5;
        //     const finalEnterUserSingle = await FinalEnterTwoByEightModel.findOne({ userId: parentFind.userId });
        //     finalEnterUserSingle.activationFees += 5;
        //     finalEnterUserSingle.upgrationFees += 2.5;
        //     finalEnterUserSingle.rebirthFees += 1;
        //     finalEnterUserSingle.netRewardFees += 1.5;
        //     // finalEnterUserSingle.restrebirthFees += 1.5;
        //     await finalEnterUserSingle.save();
        // }

        parentFind.currentTierType = "PARENT";
        parentFind.activationFees *= doubleAmount;
        parentFind.upgrationFees *= doubleAmount;
        parentFind.rebirthFees *= doubleAmount;
        parentFind.netRewardFees *= doubleAmount;
        parentFind.currentTierCount = currentTier;

        const finalEnterUser = await FinalEnterTwoByEightModel.findOne({ userId: parentFind.userId });

        if (finalEnterUser) {
            if (doubleAmount % 2 === 0) {
                finalEnterUser.activationFees += parent2Find.activationFees;
                finalEnterUser.rebirthFees += parent2Find.rebirthFees;
                finalEnterUser.netRewardFees += parent2Find.netRewardFees;
                finalEnterUser.restrebirthFees += parent2Find.rebirthFees;
            }
            finalEnterUser.currentTierCount = currentTier;
        }
        const newRebirth = new RebirthTwoByEightModel({ clientId: parentFind._id, activationFees: parentFind.activationFees, currentTierCount: parentFind.currentTierCount, investment: parentFind.investment, netRewardFees: parentFind.netRewardFees, rebirthAuto: parentFind.rebirthAuto, rebirthFees: parentFind.rebirthFees, upgrationFees: parentFind.upgrationFees })
        const newSlotHistory = new SlotHistoryTwoByEightModel({ childs: nextUsers, parentId: parent, activationFees: parentFind.activationFees, currentTierCount: parentFind.currentTierCount, investment: parentFind.investment, netRewardFees: parentFind.netRewardFees, rebirthAuto: parentFind.rebirthAuto, rebirthFees: parentFind.rebirthFees, upgrationFees: parentFind.upgrationFees })
        parent2Find.history.push(newRebirth._id);
        parent2Find.slothistory.push(newSlotHistory._id);
        await newRebirth.save();
        await newSlotHistory.save();
        await finalEnterUser.save();
        await parentFind.save();
        await parent2Find.save();
        tier2.push(parentFind);
        // await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
        console.error("Error in packageTwoByTwoSlotMethod:", error);
    }
}
// ----------------------------------- TWO BY EIGHT METHOD CREATE END ------------------------------------------------------
