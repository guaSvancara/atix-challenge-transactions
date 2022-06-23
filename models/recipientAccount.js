class RecipientAccount {
    
    accountId = '';
    credit = 0;

    constructor( id, credit ) {
        this.accountId = id;
        this.credit = credit;
    }
}

module.exports = RecipientAccount;