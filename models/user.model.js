const mongoose = require('mongoose');
const { Schema } = mongoose;

const userTwoByTwoSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  investment: { type: Number, default: 0 },
  activationFees: { type: Number, default: 0 },
  upgrationFees: { type: Number, default: 0 },
  rebirthFees: { type: Number, default: 0 },
  netRewardFees: { type: Number, default: 0 },
  currentTierCount: { type: Number, default: 0 },
  maxUsersLength: { type: Number, default: 0 },
  currentTierType: { type: String, enum: ['PARENT', 'CHILD'], default: 'CHILD' },
  rebirthAuto: { type: String, default: null },
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RebirthTwoByTwo', default: null }],
  slothistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SlothistoryTwoByTwo', default: null }],
  currentTierHistory: [{
    tierCount: {
      type: Number,
      default: 0
    },
    usersCount: {
      type: Number,
      default: 0
    },
    usersTargetCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['ACHIEVED', 'WAITING'],
      default: 'WAITING'
    },
    activationFees: { type: Number, default: 0 },
    upgrationFees: { type: Number, default: 0 },
    rebirthFees: { type: Number, default: 0 },
    netRewardFees: { type: Number, default: 0 },
  }],
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserTwoByTwo', default: null },
  leftChild: { type: mongoose.Schema.Types.ObjectId, ref: 'UserTwoByTwo', default: null },
  rightChild: { type: mongoose.Schema.Types.ObjectId, ref: 'UserTwoByTwo', default: null },
  status: { type: String, enum: ['ACHIEVED', 'WAITING'], default: 'WAITING' },
}, { timestamps: true, versionKey: false });
exports.UserTwoByTwoModel = mongoose.model('UserTwoByTwo', userTwoByTwoSchema);








const userTwoByEightSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  investment: { type: Number, default: 0 },
  activationFees: { type: Number, default: 0 },
  upgrationFees: { type: Number, default: 0 },
  rebirthFees: { type: Number, default: 0 },
  netRewardFees: { type: Number, default: 0 },
  currentTierCount: { type: Number, default: 0 },
  currentTierType: { type: String, enum: ['PARENT', 'CHILD'], default: 'CHILD' },
  currentTierHistory: [{
    tierCount: {
      type: Number,
      default: 0
    },
    usersCount: {
      type: Number,
      default: 0
    },
    usersTargetCount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ['ACHIEVED', 'WAITING'],
      default: 'WAITING'
    },
    activationFees: { type: Number, default: 0 },
    upgrationFees: { type: Number, default: 0 },
    rebirthFees: { type: Number, default: 0 },
    netRewardFees: { type: Number, default: 0 },
  }],
  rebirthAuto: { type: String, default: null },
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RebirthTwoByEight', default: null }],
  slothistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SlothistoryTwoByTwo', default: null }],
}, { timestamps: true, versionKey: false });
exports.UserTwoByEightModel = mongoose.model('UserTwoByEight', userTwoByEightSchema);



const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number: { type: String, required: true },
  wallet_address: { type: String, required: true },
  referred_by: { type: String, default: null },
  referral_code: { type: String, default: null },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  is_active: { type: Boolean, default: false },
  active_date: { type: Date, default: null },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  left_child: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  right_child: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  partners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }],
  parchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', default: [] }],
  invastment: { type: Number, default: 0 },
  teamsIncome:{
    history:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"TeamIncome",
      default:[]
    }],
    income:{ type: Number, default: 0 }
  },
  joiningMode: {
    type: String,
    enum: ['left', 'right'],
  },
  teams: [{
    ratio: { type: String, enum: ['2:1', '1:2', '1:1'], default: '1:1' },
    // leftTeam: [{ userId: mongoose.Schema.Types.ObjectId, name: String }],
    // rightTeam: [{ userId: mongoose.Schema.Types.ObjectId, name: String }],
    leftTeam: [{ type: mongoose.Schema.Types.ObjectId, ref:'Users' }],
    rightTeam: [{ type: mongoose.Schema.Types.ObjectId, ref:'Users' }],
    checked: { type: Boolean, default: false },
  }],
  lastTeamIncomeDate:{
    type:Date,
    default:null
  },
  rewardReceived: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });


// Add to binary tree recursively
userSchema.methods.addToBinaryTree = async function (newUser, joiningMode,UserModel) {
  try {
      if (!this.left_child && joiningMode == 'left') {
        this.left_child = newUser._id;
        await this.save();
        return this.left_child;
      }
  
      if (!this.right_child && joiningMode == 'right') {
        this.right_child = newUser._id;
        await this.save();
        return this.right_child;
      }
      // If both left and right are filled, check if the left child has space
      if (this.left_child && joiningMode == 'left') {
        const leftChild = await UserModel.findById(this.left_child);
        if (leftChild) {
          const result = await leftChild.addToBinaryTree(newUser,joiningMode,UserModel); // Recursively add to the left child
          if (result) return result;
        }
      }

  
      // If left child does not have space, check if the right child has space
      if (this.right_child && joiningMode == 'right') {
        const rightChild = await UserModel.findById(this.right_child);
        if (rightChild) {
          const result = await rightChild.addToBinaryTree(newUser, joiningMode, UserModel); // Recursively add to the right child
          if (result) return result;
        }
      }
  
      // If no spots are available, check the sponsor’s tree
      if (this.sponsorUserId) {
        const sponsor = await UserModel.findOne({referral_code:this.referral_code});
        if (sponsor) {
          return sponsor.addToBinaryTree(newUser,joiningMode,UserModel); // Recursively check sponsor
        }
      }
      // If no available spot is found, throw an error
      throw new Error('Unable to add user. Both left and right are filled.');
    } catch (error) {
      throw error;
    }
};

exports.UserModel = mongoose.model('User', userSchema);



