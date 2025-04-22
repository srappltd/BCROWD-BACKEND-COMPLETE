const cron = require('node-cron');
const { updateMatchingTeam, calculateLevelInvestmentShare } = require('./createPairMatchingLevelIncome');
const { twoByTwoHandSlot, twoByEightHandSlot } = require('./autoslot');
const { rebirthAutoUserTwoByTwoCreate, rebirthAutoUserTwoByEightCreate } = require('./rebirth.autocreate');

// ----- Schedule to run every 6 hours Start Level and Matching Income -----
let isProcessing1 = false;
let isProcessing2 = false;
// */5 * * * *
cron.schedule('* * * * * *', async () => {
    if (isProcessing1) return;
    isProcessing1 = true;
    try {
        await calculateLevelInvestmentShare();
    } catch (error) {
        console.log(error);
    } finally {
        isProcessing1 = false;
    }
});
// 0 */6 * * *
cron.schedule('* * * * * *', async () => {
    if (isProcessing2) return;
    isProcessing2 = true;
    try {
        await updateMatchingTeam();
        // console.log('fg')
    } catch (error) {
        console.log(error);
    } finally {
        isProcessing2 = false;
    }
});
// ----- Schedule to run every 6 hours Level and Matching End  -----




// ----- Schedule to run every 1 Seconds Start TwoByTwo and Rebirth TwoByTwo Income -----
let isTwoByTwoProcessing = false;
cron.schedule('* * * * * *', async () => {
    if (isTwoByTwoProcessing) return;
    isTwoByTwoProcessing = true;
    try {
        await twoByTwoHandSlot();
    } catch (error) {
        console.log(error);
    } finally {
        isTwoByTwoProcessing = false;
    }
});
let isTwoByTwoRebirthProcessing = false;
cron.schedule('* * * * * *', async () => {
    if (isTwoByTwoRebirthProcessing) return;
    isTwoByTwoRebirthProcessing = true;
    try {
        await rebirthAutoUserTwoByTwoCreate();
    } catch (error) {
        console.log(error);
    } finally {
        isTwoByTwoRebirthProcessing = false;
    }
});
// ----- Schedule to run every 1 Seconds TwoByTwo and Rebirth TwoByTwo End  -----



// ----- Schedule to run every 1 Seconds Start TwoByEight and Rebirth TwoByEight Income -----
let isTwoByEightProcessing = false;
cron.schedule('* * * * * *', async () => {
    if (isTwoByEightProcessing) return;
    isTwoByEightProcessing = true;
    try {
        await twoByEightHandSlot();
    } catch (error) {
        console.log(error);
    } finally {
        isTwoByEightProcessing = false;
    }
});

let isTwoByEightRebirthProcessing = false;
cron.schedule('* * * * * *', async () => {
    if (isTwoByEightRebirthProcessing) return;
    isTwoByEightRebirthProcessing = true;
    try {
        await rebirthAutoUserTwoByEightCreate();
    } catch (error) {
        console.log(error);
    } finally {
        isTwoByEightRebirthProcessing = false;
    }
});
// ----- Schedule to run every 1 Seconds Start TwoByEight and Rebirth TwoByEight Income -----