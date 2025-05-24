const { FinalEnterTwoByTwoModel, FinalEnterTwoByEightModel } = require("../models/finalenteruser.model");
const { PackageTwoByTwoModel, PackageTwoByEightModel } = require("../models/package.model");
const { UserTwoByTwoModel, UserTwoByEightModel } = require("../models/user.model");

exports.rebirthAutoUserTwoByTwoCreate = async ()=>{
    try {
        const users = await FinalEnterTwoByTwoModel.find();
        if(users.length == 0) return
        for (const user of users) {
            const finalEnterUser = await FinalEnterTwoByTwoModel.findOne({ userId: user.userId });
            if(!finalEnterUser) return
            const restCount = Math.floor(finalEnterUser.restrebirthFees / 5);
            if (restCount > 0) {
                for (let index = 0; index < restCount; index++) {
                    const newUserData = new UserTwoByTwoModel({ userId: finalEnterUser.userId, username: finalEnterUser.username, investment: 25, activationFees: 0, netRewardFees: 0, rebirthFees: 0, upgrationFees: 0, rebirthAuto: 'Auto', currentTierCount: 1 })
                    // console.log("rebirth user count check", index);
                    const packageTwoByEight = await PackageTwoByTwoModel.findOne();
                    // TWO BY TWO LOGIC
                    if (!packageTwoByEight) {
                        const newPackage = new PackageTwoByTwoModel({ amount: 25 });
                        newPackage.tier1.push(newUserData);
                        await newPackage.save();
                    } else {
                        packageTwoByEight.tier1.push(newUserData);
                        await packageTwoByEight.save();
                    }
                    await newUserData.save();
                    await finalEnterUser.save();
                }
            } else {
                // console.log("no user found for rebirth!");
            }
            finalEnterUser.restrebirthFees -= (restCount * 5)
            await finalEnterUser.save();
            await user.save();
        await new Promise((resolve) => setTimeout(resolve, 100));
        }
    } catch (error) {
        console.log(error);
    }
}

exports.rebirthAutoUserTwoByEightCreate = async ()=>{
    try {
        const users = await FinalEnterTwoByEightModel.find();
        if(users.length == 0) return
        for (const user of users) {
            const finalEnterUser = await FinalEnterTwoByEightModel.findOne({ userId: user.userId });
            if(!finalEnterUser) return
            const restCount = Math.floor(finalEnterUser.restrebirthFees / 5);
            if (restCount > 0) {
                for (let index = 0; index < restCount; index++) {
                    const newUserData = new UserTwoByEightModel({ userId: finalEnterUser.userId, username: finalEnterUser.username, investment: 25, activationFees: 0, netRewardFees: 0, rebirthFees: 0, upgrationFees: 0, rebirthAuto: 'Auto', currentTierCount: 1 })
                    // console.log("rebirth user count check", index);
                    const packageTwoByEight = await PackageTwoByEightModel.findOne();
                    if (!packageTwoByEight) {
                        const newPackage = new PackageTwoByEightModel({ amount: 25 });
                        newPackage.tier1.push(newUserData);
                        await newPackage.save();
                    } else {
                        packageTwoByEight.tier1.push(newUserData);
                        await packageTwoByEight.save();
                    }
                    await newUserData.save();
                    await finalEnterUser.save();
                }
            } else {
                // console.log("no user found for rebirth!");
            }
            finalEnterUser.restrebirthFees -= (restCount * 5)
            await finalEnterUser.save();
            await user.save();
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    } catch (error) {
        console.log(error);
    }
}
