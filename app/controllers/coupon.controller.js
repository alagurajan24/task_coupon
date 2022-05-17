const { coupon } = require("../models");
const db = require("../models");
const multer = require('multer');
const Coupon = db.coupon;
var status = 'failed';
var message = '';
var data = [];

exports.create = (req, res) => {
    Coupon.findOne({ offername: req.body.offername }, function (err, coupon) {
        if (err) return res.status(500).send({
            status: status,
            message: 'Something went wrong',
            data: data
        });
        if (coupon) return res.status(500).send({
            status: status,
            message: 'Coupon already placed',
            data: data
        });

        Coupon.create({
            customerId: req.customerId,
            offername: req.body.offername,
            couponcode: req.body.couponcode,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            discountPercent: req.body.discountPercent,
            discountAmount: req.body.discountAmount,
            termsandcond: req.body.termsandcond,
            status: req.body.status
        },
            function (err, user) {
                if (err) return res.status(500).send({
                    status: status,
                    message: 'Something went wrong',
                    data: data
                })

                res.status(200).send({
                    status: 'success',
                    message: 'Coupon Created successfully',
                    data: user
                });
            });
    });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Coupon.findOne({ offername: req.body.offername, _id: { $ne: id } }, function (err, coupon) {
        if (err) return res.status(500).send({
            status: status,
            message: 'Something went wrong',
            data: data
        });
        if (coupon) return res.status(500).send({
            status: status,
            message: 'Coupon already exist',
            data: data
        });

        var body = {
            customerId: req.customerId,
            offername: req.body.offername,
            couponcode: req.body.couponcode,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            discountPercent: req.body.discountPercent,
            discountAmount: req.body.discountAmount,
            termsandcond: req.body.termsandcond,
            status: req.body.status
        };

        Coupon.findByIdAndUpdate(id, body, { useFindAndModify: false })
            .then(coupon => {
                if (!coupon) {
                    res.status(404).send({
                        status: status,
                        message: 'Maybe addres was not found',
                        data: data
                    });
                } else {
                    status = "success";
                    res.send({
                        status: status,
                        message: 'Coupon updated successfully',
                        data: coupon
                    });
                }
            })
    });

}

exports.delete = (req, res) => {
    var newvalues = { $set: { status: 2 } };
    Coupon.updateOne({ _id: req.body.id }, newvalues, function (err, addres) {
        if (err) return res.status(500).send({
            status: status,
            message: 'Something went wrong',
            data: data
        });
        status = "success";
        res.send({
            status: status,
            message: 'Coupon deleted successfully',
            data: data
        });
    });
}

exports.status = (req, res) => {
    var newvalues = { $set: { status: req.body.status } };
    Coupon.updateOne({ _id: req.body.id }, newvalues, function (err, addres) {
        if (err) return res.status(500).send({
            status: status,
            message: 'Something went wrong',
            data: data
        });
        status = "success";
        res.send({
            status: status,
            message: 'Coupon status changed successfully',
            data: data
        });
    });
}

// exports.list = async (req, res) => {
//     Coupon.find({ status: { $ne: 2 } }).exec((err, docs) => {
//         res.send({
//             status: 'success',
//             message: 'Coupon listed successfully',
//             data: docs
//         });
//     });
// }

exports.import = (req, res) => {
    const id = req.params.id;

    var upload = multer({ storage: storage }).single("offer_image");
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send("Something went wrong!");
        }
        res.send(req.file);
        console.log(req.file.path, "ckeckpath")

        // update image path in document by Id
        var newvalues = { $set: { imgName: req.file.path } };
        Coupon.updateOne({ _id: id }, newvalues, function (err, data) {
            if (err) return res.status(500).send({
                status: "failure",
                message: 'Something went wrong',
                data: data
            });
        });
    });
};

var path = "C:/Node/task_coupon/uploads/"
global.__basedir = __dirname;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// search record 
exports.searchRecord = (req, res) => {
    try {
        if (!req.body) {
            responseObj = {
                status: "error",
                message: 'Input is missing.',
                data: {}
            }
            res.status(500).send(responseObj);
        } else {
            //exact match
            Coupon.find({ offername: { $regex: `^${req.body.search}`, $options: 'i' } }, (err, docs) => {
                if (err) {
                    responseObj = {
                        status: "error",
                        message: 'Something went wrong',
                        data: err
                    }
                    res.status(500).send(responseObj);
                } else {
                    responseObj = {
                        status: "success",
                        message: 'Record found.',
                        data: docs
                    }
                    res.status(200).send(responseObj);
                }
            })
        }
    } catch (error) {
        console.log('Error::', error);
    }
}

// pagination record
exports.pagiRecord =  (req, res) => {
    try {
        if (!req.body) {
            responseObj = {
                status: "error",
                message: 'Input is missing.',
                data: err
            }
            res.status(500).send(responseObj);
        } else {
            const currentPage = parseInt(req.body.currentPage);//2
            const pageSize = parseInt(req.body.pageSize); //10

            const skip = pageSize * (currentPage - 1);
            const limit = pageSize;

             Coupon.find({}).skip(skip).limit(limit).exec((err, docs) => {
                if (err) {
                    responseObj = {
                        status: "error",
                        message: 'Something went wrong',
                        data: err
                    }
                    res.status(500).send(responseObj);
                } else {
                    responseObj = {
                        status: "success",
                        message: 'Record found.',
                        data: docs
                    }
                    res.status(200).send(responseObj);
                }
            })
        }
    } catch (error) {
        console.log('Error::', error);
    }
}

// sorting record
exports.sortRecord = (req, res) => {
    try {
        Coupon.find({}).sort({ createdAt: -1 }).exec((err, docs) => {
            if (err) {
                responseObj = {
                    status: "error",
                    message: 'Input is missing.',
                    data: err
                }
                res.status(500).send(responseObj);
            } else {
                responseObj = {
                    status: "success",
                    message: 'Fetch Record.',
                    data: docs
                }
                res.status(200).send(responseObj);
            }
        })
    } catch (error) {
        console.log('Error', error);
    }
}