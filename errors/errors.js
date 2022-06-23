class InsufficientFundsError extends Error {
    constructor(message) {
      super(message);
    }
  }

  class RebalanceError extends Error {
    constructor(message) {
      super(message);
    }
  }

module.exports = {InsufficientFundsError, RebalanceError};