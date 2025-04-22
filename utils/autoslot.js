const { PackageTwoByTwoModel,PackageTwoByEightModel } = require("../models/package.model");
const { packageTwoByTwoSlotMethod,packageTwoByEightSlotMethod } = require("./package.slotmethod");

const twoByTwoHandSlot = async () => {
    try {
        const package = await PackageTwoByTwoModel.findOne({amount:25});
        if(!package) return
        await packageTwoByTwoSlotMethod({ tier1: package.tier1, tier2: package.tier2, count: 3, doubleAmount: 1, dataInsert:true, currentTier: 2 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier2, tier2: package.tier3, count: 5, doubleAmount: 2, dataInsert:false, currentTier: 3 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier3, tier2: package.tier4, count: 3, doubleAmount: 1, dataInsert:false, currentTier: 4 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier4, tier2: package.tier5, count: 5, doubleAmount: 2, dataInsert:false, currentTier: 5 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier5, tier2: package.tier6, count: 3, doubleAmount: 1, dataInsert:false, currentTier: 6 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier6, tier2: package.tier7, count: 5, doubleAmount: 2, dataInsert:false, currentTier: 7 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier7, tier2: package.tier8, count: 3, doubleAmount: 1, dataInsert:false, currentTier: 8 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier8, tier2: package.tier9, count: 5, doubleAmount: 2, dataInsert:false, currentTier: 9 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier9, tier2: package.tier10, count: 3, doubleAmount: 2, dataInsert:false, currentTier: 9 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier10, tier2: package.tier11, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 10 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier11, tier2: package.tier12, count: 3, doubleAmount: 2, dataInsert:false, currentTier: 11 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier12, tier2: package.tier13, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 12 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier13, tier2: package.tier14, count: 3, doubleAmount: 2, dataInsert:false, currentTier: 13 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier14, tier2: package.tier15, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 14 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier15, tier2: package.tier16, count: 3, doubleAmount: 2, dataInsert:false, currentTier: 15 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier16, tier2: package.tier17, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 16 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier17, tier2: package.tier18, count: 3, doubleAmount: 2, dataInsert:false, currentTier: 17 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier18, tier2: package.tier19, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 18 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier19, tier2: package.tier20, count: 3, doubleAmount: 2, dataInsert:false, currentTier: 19 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier20, tier2: package.tier21, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 20 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier21, tier2: package.tier22, count: 3, doubleAmount: 2, dataInsert:false, currentTier: 21 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier22, tier2: package.tier23, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 22 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier23, tier2: package.tier24, count: 3, doubleAmount: 2, dataInsert:false, currentTier: 23 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier24, tier2: package.tier25, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 24 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier25, tier2: package.tier26, count: 3, doubleAmount: 2, dataInsert:false, currentTier: 25 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier26, tier2: package.tier27, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 26 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier27, tier2: package.tier28, count: 3, doubleAmount: 2, dataInsert:false, currentTier: 17 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier28, tier2: package.tier29, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 28 })

        await packageTwoByTwoSlotMethod({ tier1: package.tier29, tier2: package.tier30, count: 3, doubleAmount: 2, dataInsert:false, currentTier: 29 })
        await packageTwoByTwoSlotMethod({ tier1: package.tier30, tier2: package.completedUser, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 30 })
        await package.save();
    } catch (err) {
        console.log(err.message);
    }
}
const twoByEightHandSlot = async () => {
    try {
        const package = await PackageTwoByEightModel.findOne({amount:25});
        if(!package) return
        await packageTwoByEightSlotMethod({ tier1: package.tier1, tier2: package.tier2, count: 3, doubleAmount: 1, dataInsert:true, currentTier: 1 });
        await packageTwoByEightSlotMethod({ tier1: package.tier2, tier2: package.tier3, count: 5, doubleAmount: 1, dataInsert:false, currentTier: 2 });

        await packageTwoByEightSlotMethod({ tier1: package.tier3, tier2: package.tier4, count: 9, doubleAmount: 2, dataInsert:false, currentTier: 3 });
        await packageTwoByEightSlotMethod({ tier1: package.tier4, tier2: package.tier5, count: 17, doubleAmount: 4, dataInsert:false, currentTier: 4 });

        await packageTwoByEightSlotMethod({ tier1: package.tier5, tier2: package.tier6, count: 33, doubleAmount: 8, dataInsert:false, currentTier: 5 });
        await packageTwoByEightSlotMethod({ tier1: package.tier6, tier2: package.tier7, count: 65, doubleAmount: 16, dataInsert:false, currentTier: 6 });

        await packageTwoByEightSlotMethod({ tier1: package.tier6, tier2: package.tier7, count: 129, doubleAmount: 32, dataInsert:false, currentTier: 7 });
        await packageTwoByEightSlotMethod({ tier1: package.tier7, tier2: package.tier8, count: 257, doubleAmount: 64, dataInsert:false, currentTier: 8 });

        await packageTwoByEightSlotMethod({ tier1: package.tier8, tier2: package.completedUser, count: 257, doubleAmount: 2, dataInsert:false, currentTier: 9 })
        await package.save();

        await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {twoByTwoHandSlot,twoByEightHandSlot}