const { FinalEnterTwoByTwoModel, FinalEnterTwoByEightModel } = require("../models/finalenteruser.model");
const { RebirthTwoByTwoModel, RebirthTwoByEightModel } = require("../models/rebirth.model");
const { SlotHistoryTwoByTwoModel, SlotHistoryTwoByEightModel } = require("../models/slothistory.model");
const { UserTwoByTwoModel, UserTwoByEightModel } = require("../models/user.model");




// ----------------------------------- TWO BY TWO METHOD CREATE START ------------------------------------------------------
exports.packageTwoByTwoSlotMethod = async ({ tier1, tier2, count, doubleAmount, currentTier }) => {
    try {
        const currentTierCount = tier2.length;
        const parent = currentTierCount === 0 ? (await UserTwoByTwoModel.findOne())._id : tier1[currentTierCount];
        const nextUsers = tier1.slice(currentTierCount * count, (currentTierCount + 1) * count);
        const parentFind = await UserTwoByTwoModel.findById(parent);
        const parent2Find = await UserTwoByTwoModel.findById(parent);

        const allFind = await UserTwoByTwoModel.find({ _id: parent });
        const index = parent2Find.currentTierHistory.findIndex(
            (entry) => entry.tierCount === (currentTier-1)
        );
        if (nextUsers.length != 0) {
        if (index !== -1) {
                if (nextUsers.length < count) {
                    parent2Find.currentTierHistory[index].usersCount = nextUsers.length - 1;
                    parent2Find.currentTierHistory[index].status = 'WAITING';
                } else {
                    parent2Find.currentTierHistory[index].usersCount = nextUsers.length - 1;
                    parent2Find.currentTierHistory[index].status = 'ACHIEVED';
                    parent2Find.currentTierHistory[index].activationFees = parent2Find.activationFees;
                    parent2Find.currentTierHistory[index].upgrationFees = parent2Find.upgrationFees;
                    parent2Find.currentTierHistory[index].rebirthFees = parent2Find.rebirthFees;
                    parent2Find.currentTierHistory[index].netRewardFees = parent2Find.netRewardFees;
                }
            } else {
                parent2Find.currentTierHistory.push({ tierCount: currentTier-1, usersCount: 0 < nextUsers.length - 1, status: 'WAITING',usersTargetCount:count-1,activationFees:parent2Find.activationFees,upgrationFees:parent2Find.upgrationFees,rebirthFees:parent2Find.rebirthFees,netRewardFees:parent2Find.netRewardFees });
            }
        }

        await parent2Find.save();
        if (nextUsers.length < count) return;

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
        await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
        console.error("Error in packageTwoByTwoSlotMethod:", error);
    }
};
// ----------------------------------- TWO BY TWO METHOD CREATE END ------------------------------------------------------





// ----------------------------------- TWO BY EIGHT METHOD CREATE START ------------------------------------------------------
exports.packageTwoByEightSlotMethod = async ({ tier1, tier2, count, doubleAmount, currentTier }) => {
    try {
        const currentTierCount = tier2.length;
        const parent = currentTierCount === 0 ? (await UserTwoByEightModel.findOne())._id : tier1[currentTierCount];
        const nextUsers = tier1.slice(currentTierCount * count, (currentTierCount + 1) * count);
        const parentFind = await UserTwoByEightModel.findById(parent);
        const parent2Find = await UserTwoByEightModel.findById(parent);
        // Find index of existing tierCount
        const index = parent2Find.currentTierHistory.findIndex(
            (entry) => entry.tierCount === (currentTier-1)
        );

        if(nextUsers.length != 0) {
        if (index !== -1) {
                if (nextUsers.length < count) {
                    parent2Find.currentTierHistory[index].usersCount = nextUsers.length - 1;
                    parent2Find.currentTierHistory[index].status = 'WAITING';
                } else {
                    parent2Find.currentTierHistory[index].usersCount = nextUsers.length - 1;
                    parent2Find.currentTierHistory[index].status = 'ACHIEVED';
                    parent2Find.currentTierHistory[index].activationFees = parent2Find.activationFees;
                    parent2Find.currentTierHistory[index].upgrationFees = parent2Find.upgrationFees;
                    parent2Find.currentTierHistory[index].rebirthFees = parent2Find.rebirthFees;
                    parent2Find.currentTierHistory[index].netRewardFees = parent2Find.netRewardFees;
                }
            } else {
                parent2Find.currentTierHistory.push({ tierCount: currentTier-1, usersCount: nextUsers.length - 1, status: 'WAITING',usersTargetCount:count-1,activationFees:parent2Find.activationFees,upgrationFees:parent2Find.upgrationFees,rebirthFees:parent2Find.rebirthFees,netRewardFees:parent2Find.netRewardFees });
            }
        }
        await parent2Find.save();

        if (nextUsers.length < count) return;

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
        parent2Find.history.push(newRebirth._id)
        parent2Find.slothistory.push(newSlotHistory._id);
        await newRebirth.save()
        await newSlotHistory.save()
        await finalEnterUser.save();
        await parentFind.save();
        await parent2Find.save();
        tier2.push(parentFind);
        await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
        // console.error("Error in packageTwoByTwoSlotMethod:", error.message);
    }
}
// ----------------------------------- TWO BY EIGHT METHOD CREATE END ------------------------------------------------------
