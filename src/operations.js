const {InsufficientFundsError} = require('../errors/errors.js');

const sufficientFunds = function(closingAccounts, recipientAccounts) {
  let totalClosingFunds = 0;
  let totalRecipientFunds = 0;

  for (let i=0; i<closingAccounts.length; i++) {
    totalClosingFunds += closingAccounts[i].amount;
  }

  for (let i=0; i<recipientAccounts.length; i++) {
    totalRecipientFunds += recipientAccounts[i].credit;
  }

  return (totalClosingFunds >= totalRecipientFunds);
};

const newRebalancingTx = function(closingAccounts, recipientAccounts) {
  let closingAcc;
  let recipientAcc;
  const transferInfo = {
    transfers: [],
    operationalFee: 0,
  };
  let nextFee;
  let remainderAmount;
  let chargeFee = false;

  for (let i=0; i<closingAccounts.length; i++) {
    closingAcc = closingAccounts[i];
    do {
      // operationalFee after next transfer
      nextFee = transferInfo.operationalFee + 10;
      // closing account amount after charging operationalFee
      remainderAmount = closingAcc.amount - nextFee;

      if (closingAcc.amount < transferInfo.operationalFee) {
        throw new InsufficientFundsError('Not enough funds for rebalance');
      }

      // find a recipientAccount with enough credit
      recipientAcc = recipientAccounts.find(
          (recipientAccount) =>
            (recipientAccount.credit > 0) &&
          (recipientAccount.credit <= closingAcc.amount),
      );
      if (recipientAcc) {
        // transfer from closingAccount to recipientAccount
        closingAcc.amount = closingAcc.amount - recipientAcc.credit;
        transferInfo.transfers.push([
          closingAcc.accountId,
          recipientAcc.accountId,
          recipientAcc.credit,
        ]);
        recipientAcc.credit = 0;
      } else {
        // recipients accounts covered
        if (remainderAmount > 0 &&
            closingAcc.amount > transferInfo.operationalFee) {
          // transfer if there is remainder amount
          transferInfo.transfers.push([
            closingAcc.accountId,
            null,
            closingAcc.amount,
          ]);
        } else {
          // fee charge pending
          chargeFee = true;
        }
        closingAcc.amount = 0;
      }
      transferInfo.operationalFee = transferInfo.transfers.length * 10;

      // finish when closing account has ran out of amount
    } while (closingAcc.amount > 0);
  }
  if (!chargeFee) {
    // charge fee to last recipient
    const lastTransferIndex = transferInfo.transfers.length - 1;
    const currentAmount = transferInfo.transfers[lastTransferIndex][2];
    const newAmount = currentAmount - transferInfo.operationalFee;
    transferInfo.transfers[transferInfo.transfers.length - 1][2] = newAmount;
  }
  return transferInfo;
};

module.exports = {sufficientFunds, newRebalancingTx};
