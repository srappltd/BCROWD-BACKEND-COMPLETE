const { TeamIncomeModel } = require('../models/team.model');
const { UserModel } = require('../models/user.model');
const { getDownlineUsers } = require('./binaryTreeTeam');
const cron = require('node-cron');
const { LevelIncomeDistribute } = require('./levelIncome.directdistritute');
const { getDownlineUsersBinary } = require('./getDownlineUsersBinary');
// Function to dynamically pair based on ratio, ensuring used items are not counted

const updateMatchingTeam = async () => {
    try {
        const users = await UserModel.find();
        for (const user of users) {
            const { left, right } = await getDownlineUsersBinary(user._id);

            // console.log({left,right,user:user.name});

            if (!left.length && !right.length) continue;
            const existingUserIds = new Set();
            user.teams.forEach(team => {
                team.leftTeam.forEach(member => existingUserIds.add(member.toString()));
                team.rightTeam.forEach(member => existingUserIds.add(member.toString()));
            });
            const filteredLeft = left.filter(member => !existingUserIds.has(member.toString()));
            const filteredRight = right.filter(member => !existingUserIds.has(member.toString()));

            const leftIds = new Set(filteredLeft.map(user => user.toString()));
            const rightIds = new Set(filteredRight.map(user => user.toString()));

            const finalLeft = filteredLeft.filter(user => !rightIds.has(user.toString()));
            const finalRight = filteredRight.filter(user => !leftIds.has(user.toString()));

            if (!finalLeft.length || !finalRight.length) continue;

            const pairs = [];
            let leftIndex = 0;
            let rightIndex = 0;

            // Step 1: Try 2:1 pair
            if (leftIndex + 1 < finalLeft.length && rightIndex < finalRight.length) {
                pairs.push({
                    ratio: '2:1',
                    leftTeam: [finalLeft[leftIndex], finalLeft[leftIndex + 1]],
                    rightTeam: [finalRight[rightIndex]],
                    createdAt: new Date()
                });
                leftIndex += 2;
                rightIndex += 1;
            }

            // Step 2: Try 1:2 if 2:1 wasn't made
            else if (pairs.length === 0 && leftIndex < finalLeft.length && rightIndex + 1 < finalRight.length) {
                pairs.push({
                    ratio: '1:2',
                    leftTeam: [finalLeft[leftIndex]],
                    rightTeam: [finalRight[rightIndex], finalRight[rightIndex + 1]],
                    createdAt: new Date()
                });
                leftIndex += 1;
                rightIndex += 2;
            }
            // Step 3: Create 1:1 pairs if a combo was already made
            if (pairs.length > 0) {
                while (leftIndex < finalLeft.length && rightIndex < finalRight.length) {
                    pairs.push({
                        ratio: '1:1',
                        leftTeam: [finalLeft[leftIndex]],
                        rightTeam: [finalRight[rightIndex]],
                        createdAt: new Date()
                    });
                    leftIndex += 1;
                    rightIndex += 1;
                }
            }
            // Save if new valid pairs were created
            if (pairs.length > 0) {
                user.teams.push(...pairs);
                await user.save();
                // console.log(`Updated user ${user._id} with new pairs`, pairs);
            }
        }
    } catch (error) {
        console.error('Error updating teams:', error);
    }
};


const calculateLevelInvestmentShare = async () => {
    try {
        const users = await UserModel.find();
        for (const user of users) {
            if (user.teams.length == 0) {
                continue
            };
            if (user.parchases.length == 0) {
                continue
            }
            const teamNull = user.teams.filter(user => user.checked == false);
            if (teamNull.length == 0) {
                continue
            }

            

            // if (user.lastTeamIncomeDate && new Date() - user.lastTeamIncomeDate < 6 * 60 * 60 * 1000) {
            //     continue
            // }
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
            // console.log('Team Income is created.');
        }
    } catch (error) {
        console.log(error)
    }
};

module.exports = { calculateLevelInvestmentShare, updateMatchingTeam };