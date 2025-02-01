
const mongoose = require('mongoose');
const { Schema } = mongoose;




const packageTwoByTwoSchema = new Schema({
    amount: { type: Number, default:0 },
    tier1:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier2:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier3:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier4:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier5:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier6:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier7:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier8:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier9:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier10:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier11:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier12:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier13:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier14:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier15:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier16:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier17:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier18:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier19:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier20:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier21:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier22:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier23:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier24:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier25:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier26:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier27:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier28:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier29:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    tier30:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }],
    completedUser:[
      { type: Schema.Types.ObjectId, ref: 'UserTwoByTwo',default:[] }
    ]
  },{timestamps:true,versionKey:false});
exports.PackageTwoByTwoModel = mongoose.model('PackageTwoByTwo', packageTwoByTwoSchema);







const packageTwoByEightSchema = new Schema({
    amount: { type: Number, default:0 },
    tier1:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByEight',default:[] }],
    tier2:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByEight',default:[] }],
    tier3:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByEight',default:[] }],
    tier4:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByEight',default:[] }],
    tier5:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByEight',default:[] }],
    tier6:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByEight',default:[] }],
    tier7:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByEight',default:[] }],
    tier8:[{ type: Schema.Types.ObjectId, ref: 'UserTwoByEight',default:[] }],
    completedUser:[
      { type: Schema.Types.ObjectId, ref: 'UserTwoByEight',default:[] }
    ]
  },{timestamps:true,versionKey:false});
  
exports.PackageTwoByEightModel = mongoose.model('PackageTwoByEight', packageTwoByEightSchema);
  