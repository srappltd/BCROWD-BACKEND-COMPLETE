const { UserModel } = require("../models/user.model");

const getCompleteSponsorArray = async (sponsorId, limit, currentDepth = 0, result = []) => {
    if (currentDepth >= limit) {
        return result;
    }
    try {
        const user = await UserModel.findOne({ referral_code: sponsorId }).populate('referred_by', 'name email mobile wallet_address referred_by referral_code');
        if (!user) {
            return result;
        }
        result.push(user._id);
        if (user.referred_by) {
            await getCompleteSponsorArray(user.referred_by, limit, currentDepth + 1, result);
        }
        return result;
    } catch (error) {
        console.error('Error in getCompleteSponsorArray:', error.message);
        throw error;
    }
}
module.exports = { getCompleteSponsorArray }