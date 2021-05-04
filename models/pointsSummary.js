const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const pointsSummarySchema = new Schema(
    {
        id: {
            type: Object,
        },
        totalPoints: {
            type: Number,
        },
        totalRedeemedPoints: {
            type: Number,
        },
        totalPendingPoints: {
            type: Number,
        },
    },
    {
        timestamps: { updatedAt: 'updated_at' },
        collection: 'pointsSummary',
    }
);

module.exports = mongoose.model('pointsSummary', pointsSummarySchema);
