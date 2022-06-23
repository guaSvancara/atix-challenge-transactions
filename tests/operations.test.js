const ClosingAccount = require('../models/closingAccount.js');
const RecipientAccount = require('../models/recipientAccount.js');
const {sufficientFunds, newRebalancingTx} = require('../src/operations.js');

test('sufficient funds', () => {
  const cl1 = new ClosingAccount(('acc1'), 500);
  const rec1 = new RecipientAccount(('rec1'), 400);
  const sufficient = sufficientFunds([cl1], [rec1]);
  expect(sufficient).toBeTruthy();
});

test('insufficient funds', () => {
  const cl1 = new ClosingAccount(('acc1'), 400);
  const rec1 = new RecipientAccount(('rec1'), 500);
  const sufficient = sufficientFunds([cl1], [rec1]);
  expect(sufficient).toBeFalsy();
});

test('example transactions case 1', () => {
  const cl1 = new ClosingAccount(('acc1'), 1000);
  const rec1 = new RecipientAccount(('rec1'), 500);
  const rec2 = new RecipientAccount(('rec2'), 400);
  const result = newRebalancingTx([cl1], [rec1, rec2]);
  const {transfers, operationalFee} = result;
  expect(transfers.length).toBe(3);
  const [t1, t2, t3] = transfers;
  expect(t1[0]).toBe('acc1');
  expect(t1[1]).toBe('rec1');
  expect(t1[2]).toBe(500);
  expect(t2[0]).toBe('acc1');
  expect(t2[1]).toBe('rec2');
  expect(t2[2]).toBe(400);
  expect(t3[0]).toBe('acc1');
  expect(t3[1]).toBeNull();
  expect(t3[2]).toBe(70);
  expect(operationalFee).toBe(30);
});

test('example transactions case 2', () => {
  const cl1 = new ClosingAccount(('acc1'), 500);
  const cl2 = new ClosingAccount(('acc2'), 500);
  const rec1 = new RecipientAccount(('rec1'), 400);
  const result = newRebalancingTx([cl1, cl2], [rec1]);
  const {transfers, operationalFee} = result;
  expect(transfers.length).toBe(3);
  const [t1, t2, t3] = transfers;
  expect(t1[0]).toBe('acc1');
  expect(t1[1]).toBe('rec1');
  expect(t1[2]).toBe(400);
  expect(t2[0]).toBe('acc1');
  expect(t2[1]).toBeNull();
  expect(t2[2]).toBe(100);
  expect(t3[0]).toBe('acc2');
  expect(t3[1]).toBeNull();
  expect(t3[2]).toBe(470);
  expect(operationalFee).toBe(30);
});

test('example transactions case 3', () => {
  const cl1 = new ClosingAccount(('acc1'), 1000);
  const rec1 = new RecipientAccount(('rec1'), 500);
  const rec2 = new RecipientAccount(('rec2'), 480);
  const result = newRebalancingTx([cl1], [rec1, rec2]);
  const {transfers, operationalFee} = result;
  expect(transfers.length).toBe(2);
  const [t1, t2] = transfers;
  expect(t1[0]).toBe('acc1');
  expect(t1[1]).toBe('rec1');
  expect(t1[2]).toBe(500);
  expect(t2[0]).toBe('acc1');
  expect(t2[1]).toBe('rec2');
  expect(t2[2]).toBe(480);
  expect(operationalFee).toBe(20);
});

test('failing transaction', () => {
  const cl1 = new ClosingAccount(('acc1'), 1000);
  const rec1 = new RecipientAccount(('rec1'), 500);
  const rec2 = new RecipientAccount(('rec2'), 490);
  expect(() => newRebalancingTx([cl1], [rec1, rec2])).toThrow();
});
