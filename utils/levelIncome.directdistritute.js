const { LevelModel } = require("../models/level.model");
const { UserModel } = require("../models/user.model");
const { getCompleteSponsorArray } = require("./getSponsors");

exports.LevelIncomeDistribute = async ({ userId, amount,teamIncomeId }) => {
    try {
        const user = await UserModel.findById(userId);
        const allSponsor = await getCompleteSponsorArray(user.referred_by, 12);
        allSponsor.shift();
        if(allSponsor.length == 0) return
        const distributeArray = [
            { commition: amount * 0.11,percentage:0.11, level: "Level 01" },
            { commition: amount * 0.10,percentage:0.10, level: "Level 02" },
            { commition: amount * 0.09,percentage:0.09, level: "Level 03" },
            { commition: amount * 0.08,percentage:0.08, level: "Level 04" },
            { commition: amount * 0.07,percentage:0.07, level: "Level 05" },
            { commition: amount * 0.06,percentage:0.06, level: "Level 06" },
            { commition: amount * 0.05,percentage:0.05, level: "Level 07" },
            { commition: amount * 0.04,percentage:0.04, level: "Level 08" },
            { commition: amount * 0.03,percentage:0.03, level: "Level 09" },
            { commition: amount * 0.02,percentage:0.02, level: "Level 10" },
            { commition: amount * 0.01,percentage:0.01, level: "Level 11" },
        ];
        for (let i = 0; i < allSponsor.length; i++) {
            for (let j = 0; j < distributeArray.length; j++) {
                if (i == j) {
                    const sponsor = allSponsor[j];
                    const distributeAmount = distributeArray[j];
                    const sponsorFind = await UserModel.findById(sponsor);

                    sponsorFind.totalIncome += distributeAmount.commition;
                    sponsorFind.levelIncome.income += distributeAmount.commition;
                    const newLevelIncome = new LevelModel({
                        amount: distributeAmount.commition,
                        percentage:distributeAmount.percentage,
                        levelName: distributeAmount.level,
                        userId: sponsorFind._id,
                        teamIncomeId,
                        status:"Confirm"
                    });
                    sponsorFind.levelIncome.history.push(newLevelIncome._id);
                    await newLevelIncome.save();
                    await sponsorFind.save();
                };
            };
        };
        console.log('Level Income is created.');
    } catch (error) {
        console.log(error)
    };
};