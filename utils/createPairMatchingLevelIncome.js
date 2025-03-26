const { TeamIncomeModel } = require('../models/team.model');
const { UserModel } = require('../models/user.model');
const { getDownlineUsers } = require('./binaryTreeTeam');
const cron = require('node-cron');
const { LevelIncomeDistribute } = require('./levelIncome.directdistritute');
// Function to dynamically pair based on ratio, ensuring used items are not counted
const updateMatchingTeam = async () => {
    try {
        const users = await UserModel.find();
        for (const user of users) {
            const { left, right } = await getDownlineUsers(user._id);
            const existingUserIds = new Set();
            user.teams.forEach(team => {
                team.leftTeam.forEach(member => existingUserIds.add(member.toString()));
                team.rightTeam.forEach(member => existingUserIds.add(member.toString()));
            });

            let filteredLeft = left.filter(member => !existingUserIds.has(member.toString()));
            let filteredRight = right.filter(member => !existingUserIds.has(member.toString()));

            const pairs = [];
            let leftIndex = 0;
            let rightIndex = 0;

            if (leftIndex + 1 < filteredLeft.length && rightIndex < filteredRight.length) {
                pairs.push({
                    ratio: '2:1',
                    leftTeam: [filteredLeft[leftIndex], filteredLeft[leftIndex + 1]],
                    rightTeam: [filteredRight[rightIndex]],
                    createdAt: new Date()
                });
                leftIndex += 2;
                rightIndex += 1;
            }
            else if (pairs.length === 0 && leftIndex < filteredLeft.length && rightIndex + 1 < filteredRight.length) {
                pairs.push({
                    ratio: '1:2',
                    leftTeam: [filteredLeft[leftIndex]],
                    rightTeam: [filteredRight[rightIndex], filteredRight[rightIndex + 1]],
                    createdAt: new Date()

                });
                leftIndex += 1;
                rightIndex += 2;
            }

            // **Step 3: Create remaining 1:1 pairs**
            while (leftIndex < filteredLeft.length && rightIndex < filteredRight.length) {
                pairs.push({
                    ratio: '1:1',
                    leftTeam: [filteredLeft[leftIndex]],
                    rightTeam: [filteredRight[rightIndex]],
                    createdAt: new Date()
                });
                leftIndex += 1;
                rightIndex += 1;
            }
            user.teams.push(...pairs);
            await user.save();
        }
    } catch (error) {
        console.log(error)
    }
};

const calculateLevelInvestmentShare = async () => {
    try {
        const users = await UserModel.find();
        for (const user of users) {
            if (user.teams.length == 0) {
                // console.log('Team is not exists.');
                continue
            };
            const teamNull = user.teams.filter(user => user.checked == false);
            if (teamNull.length == 0) {
                // console.log('Team is not created.');
                continue
            }
            if (user.parchases.length == 0) {
                // console.log('Package not found.');
                continue
            }
            if (user.lastTeamIncomeDate && new Date() - user.lastTeamIncomeDate < 6 * 60 * 60 * 1000) {
                // console.log('Date')
                continue
            }
            user.lastTeamIncomeDate = new Date()
            const rward = (user.invastment * 0.05) * teamNull.length;
            user.teamsIncome.income += rward;
            user.totalIncome += rward;
            user.teams.forEach(user => user.checked = true);
            const newTeam = new TeamIncomeModel({ amount: rward, client: user._id, totalTeam: teamNull.length });
            user.teamsIncome.history.push(newTeam._id);
            await newTeam.save();
            await LevelIncomeDistribute({userId:user._id,amount:rward,teamIncomeId:newTeam._id});
            await user.save();
            console.log('Team Income is created.');
        }
    } catch (error) {
        console.log(error)
    }
};

module.exports = { calculateLevelInvestmentShare, updateMatchingTeam };