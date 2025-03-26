const cron = require('node-cron');
const { updateMatchingTeam, calculateLevelInvestmentShare } = require('./createPairMatchingLevelIncome');
const { twoByTwoHandSlot, twoByEightHandSlot } = require('./autoslot');
const { rebirthAutoUserTwoByTwoCreate, rebirthAutoUserTwoByEightCreate } = require('./rebirth.autocreate');

// ----- Schedule to run every 6 hours Start Level and Matching Income -----
let isProcessing1 = false;
let isProcessing2 = false;
cron.schedule('*/5 * * * *', async () => {
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
cron.schedule('0 */6 * * *', async () => {
    if (isProcessing2) return;
    isProcessing2 = true;
    try {
        await updateMatchingTeam();
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
        await rebirthAutoUserTwoByTwoCreate();
    } catch (error) {
        console.log(error);
    } finally {
        isTwoByTwoProcessing = false;
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
        await rebirthAutoUserTwoByEightCreate();
    } catch (error) {
        console.log(error);
    } finally {
        isTwoByEightProcessing = false;
    }
});
// ----- Schedule to run every 1 Seconds Start TwoByEight and Rebirth TwoByEight Income -----