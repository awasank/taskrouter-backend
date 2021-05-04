const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema(
    {
        /*
			Personal Information
			This Encapsulation is from the signup form
		*/
        gender: { type: String },
        first_name: { type: String },
        middle_name: { type: String },
        last_name: { type: String },
        emboss: { type: String },
        email: { type: String, unique: true },
        phone_number: { type: String },
        dob: { type: Date },
        sin: { type: String },
        why_do_you_want_the_card: { type: String },
        how_did_you_hear_about_us: { type: String },
        other_source: { type: String },

        /*
			Address Information
			This Encapsulation is from the signup form
		*/
        street_address: { type: String },
        suite_number: { type: String },
        city: { type: String },
        province: { type: String },
        postal_code: { type: String },

        /*
		 Employment Information
		 This Encapsulation is from the signup form
	 */
        employment_status: { type: String },
        industry: { type: String },
        job_description: { type: String },
        current_employer: { type: String },
        employment_year: { type: String },
        employment_month: { type: String },

        // Financial Information
        credit_limit: { type: Number },
        received_amount: { type: Number, default: 0 },
        other_house_income: { type: String },
        annual_salary_before_tax: { type: String },
        mortgage: { type: String },
        rent_on_mortgage: { type: String },
        directCreditId: { type: String },
        // Other Necessary Information
        password: { type: String, select: false },
        ip: { type: String },
        picture_url: { type: String },
        equifax_disclaimer: { type: Date },
        tnc: { type: Date },
        disclosure_agreement: { type: Date },
        order_number: { type: String },
        referral_code: { type: String },
        referred_by: { type: String },
        email_opened: { type: Boolean },
        affiliate_id: { type: String },
        status: { type: String, default: 'Funds Requested' },
        password_reset: { type: Boolean, default: false },
        email_verified: { type: Boolean, default: false },
        email_verification_sent: { type: Boolean, default: false },
        totp: { type: String },
        //hubspot Information
        hubspotupdated: { type: String },
        // Equifax Information
        equifax_status: { type: String, default: 'Not Verified' },
        // Bank Information
        security_id: { type: String, default: '' },
        applicant_id: { type: String, default: '' },
        application_id: { type: String, default: '' },
        customer_number: { type: String, default: '' },
        last_four_digits: { type: String, default: '' },
        wallet_number: { type: String, default: '' },
        security_number: { type: String, default: '' },
        card_id: { type: String, default: '' },
        card_number: { type: String, default: '' },
        card_type: { type: String, default: '1' },
        accountNumber: { type: String, default: '' },
        tnc_plastk: { type: String },
        interac_reference_number: {
            type: Array,
            default: '',
        },
        isPaymentPartial:{
            type:Boolean,
            default:false
        },
        userTransactions: [{ type: Schema.Types.ObjectId, ref: 'userTransactions' }],
        is_free_user: {
            type: Boolean,
            default: false,
        },
        free_credit_user_signup: {
            type: Date,
        },
        StatementPeriodEnd: {
            type: Date,
        },
        AvailableCreditLimit: {
            type: Number,
        },
        Balance: {
            type: Number,
        },
        CardBalance: {
            type: Number,
        },
        sms_subscription: { type: Boolean, default: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'user',
    }
);

module.exports = mongoose.model('user', userSchema);
