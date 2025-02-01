const { UserModel } = require('../models/user.model');

// 🔹 Find the correct position for the new user under a referrer
const findPositionUnderReferrer = async (referrerId) => {
    const referrer = await UserModel.findById(referrerId);
    if (!referrer) return null;

    // Assign user to the left first, then right if left is occupied
    if (!referrer.left_child) {
        return { parentId: referrer._id, position: "left_child" };
    } else if (!referrer.right_child) {
        return { parentId: referrer._id, position: "right_child" };
    }

    // If referrer's both sides are full, assign to right-most available rightChild
    let rightmost = referrer.right_child;
    while (rightmost) {
        const nextRight = await UserModel.findById(rightmost.right_child);
        if (!nextRight) {
            return { parentId: rightmost._id, position: "right_child" };
        }
        rightmost = nextRight;
    }

    return null;
};

// 🔹 Function to assign users to teams based on structure
const assignUserToTeam = async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    let leftTeam = user.left_child ? await getDownlineUsers(user.left_child, 2) : [];
    let rightTeam = user.right_child ? await getDownlineUsers(user.right_child, 2) : [];

    let team = "1:1";
    if (leftTeam.length >= 2 && rightTeam.length === 1) {
        team = "2:1";
    } else if (leftTeam.length === 1 && rightTeam.length >= 2) {
        team = "1:2";
    }

    user.teams = {
        parentUserId: user.parent_id,
        ratio: team,
        leftTeam,
        rightTeam,
    };

    await user.save();
    return { success: true, message: `User added to team ${team}`, teams: user.teams };
};

const getDownlineUsers = async (userId, depth = 2) => {
    if (depth === 0) return { left: [], right: [] };
    const user = await UserModel.findById(userId);
    if (!user) return { left: [], right: [] };

    let left = user.left_child ? await getDownlineUsers(user.left_child) : { left: [], right: [] };
    let right = user.right_child ? await getDownlineUsers(user.right_child) : { left: [], right: [] };

    return {
        left: [user._id, ...left.left],
        right: [user._id, ...right.right]
    };
};






// Function to add the user to the binary tree structure
const addBinaryTree = async (parentId, newUserData) => {
    try {
        // Step 2: Find the parent user and assign the new user to the correct position
        const parent = await UserModel.findById(parentId).populate('left_child right_child');

        if (!parent) {
            throw new Error('Parent user not found');
        }

        // Check if the user is referred by the parent
        if (newUserData.referred_by !== parentId.toString()) {
            throw new Error('The referred user must be referred by the given parent');
        }

        // Step 3: Add the new user to the binary tree (left or right child or sub-tree)
        if (!parent.left_child) {
            parent.left_child = newUser._id;
            await parent.save();
            return { success: true, message: 'User added successfully as left child', newUser };
        }
        if (!parent.right_child) {
            parent.right_child = newUser._id;
            await parent.save();
            return { success: true, message: 'User added successfully as right child', newUser };
        }

        // Step 4: If both left and right children are occupied, add to the left or right sub-tree
        const addToChild = async (childId, side) => {
            const child = await UserModel.findById(childId).populate('left_child right_child');

            // Check where to assign the user based on the side (left child's left, right child's right)
            if (side === 'left' && !child.left_child) {
                child.left_child = newUser._id;
                await child.save();
                return { success: true, message: 'User added successfully to left child\'s left', newUser };
            }

            if (side === 'right' && !child.right_child) {
                child.right_child = newUser._id;
                await child.save();
                return { success: true, message: 'User added successfully to right child\'s right', newUser };
            }

            return null; // No space found in this child node
        };

        // Step 5: Try adding under the left child (left child's left)
        let result = await addToChild(parent.left_child, 'left');
        if (result) return result;

        // Step 6: Try adding under the right child (right child's right)
        result = await addToChild(parent.right_child, 'right');
        if (result) return result;

        return { success: false, message: 'No space available in both children\'s sub-trees' };

    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};






module.exports = { findPositionUnderReferrer, assignUserToTeam, getDownlineUsers, addBinaryTree };
