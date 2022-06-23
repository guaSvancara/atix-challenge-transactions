const ClosingAccount = require('../models/closingAccount.js');
const RecipientAccount = require('../models/recipientAccount.js');
const {sufficientFunds, newRebalancingTx} = require('./operations.js');
const {RebalanceError} = require('../errors/errors.js');

const main = function() {
  console.clear();
  const closingAccounts = [];
  const recipientAccounts = [];
  closingAccounts.push(new ClosingAccount(('acc1'), 1000));
  recipientAccounts.push(new RecipientAccount(('rec1'), 500));
  recipientAccounts.push(new RecipientAccount(('rec2'), 400));

  // closingAccounts.push(new ClosingAccount(('acc2'), 500));
  // closingAccounts.push(new ClosingAccount(('acc3'), 500));
  // recipientAccounts.push(new RecipientAccount(('rec3'), 400));

  // closingAccounts.push(new ClosingAccount(('acc1'), 1000));
  // recipientAccounts.push(new RecipientAccount(('rec1'), 500));
  // recipientAccounts.push(new RecipientAccount(('rec2'), 480));

  // closingAccounts.push(new ClosingAccount(('acc1'), 1000));
  // recipientAccounts.push(new RecipientAccount(('rec1'), 500));
  // recipientAccounts.push(new RecipientAccount(('rec2'), 490));


  const sufficient = sufficientFunds(closingAccounts, recipientAccounts);
  if (!sufficient) {
    throw new RebalanceError('Not enough funds for rebalance');
  } else {
    const result = newRebalancingTx(closingAccounts, recipientAccounts);
    console.log(result);
  }
};

main();
