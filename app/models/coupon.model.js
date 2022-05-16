const { string } = require("joi");
const { Schema } = require("mongoose");

module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            customerId: { type:Schema.Types.ObjectId,ref:"customer"},
            offername: String,
            couponcode: String,
            startdate: String,
            enddate: String,
            discountPercent: Number,
            discountAmount: Number,
            termsandcond: String,
            imgName: String,
            status: { type: Number, default: 0 }
        },
        { timestamps: true }
    );
    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const User = mongoose.model("coupon", schema);
    return User;
};