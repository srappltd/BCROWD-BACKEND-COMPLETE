/**
 * Calculate reward distribution based on ratio.
 * @param {number} investment - Total investment by the new user.
 * @param {Object} ratio - Reward distribution ratio (e.g., { parent: 1, grandParent: 1 }).
 * @returns {Object} - Parent and grandparent share.
 */
function calculateDistribution(investment, ratio) {
    const totalRatio = ratio.parent + ratio.grandParent;
    const parentShare = (investment * ratio.parent) / totalRatio;
    const grandParentShare = (investment * ratio.grandParent) / totalRatio;
    return { parentShare, grandParentShare };
  }
  
  module.exports = calculateDistribution;
  