const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const userTransactionsSchema = new Schema(
    {
        ReferenceNumber: {
            type: String,
            unique: true,
        },
        Description: {
            type: String,
        },
        Mcc: {
            type: String,
        },
        TransactionTypeCode: {
            type: String,
        },
        TransactionAmount: {
            type: Number,
        },
        RewardPoints: {
            type: Number,
        },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        TransactionDate: {
            type: String,
        },
        isFake: { type: Boolean, default: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'userTransactions',
    }
);

userTransactionsSchema.plugin(uniqueValidator);
module.exports = mongoose.model('userTransactions', userTransactionsSchema);
