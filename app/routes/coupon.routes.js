module.exports = app => {
  const coupon = require("../controllers/coupon.controller.js");
  const VerifyToken = require("../middleware/VerifyToken.js");

  var router = require("express").Router();

  router.post("/create", VerifyToken, coupon.create);
  router.post("/delete", VerifyToken, coupon.delete);
  router.post("/status", VerifyToken, coupon.status);
  router.put("/update/:id", VerifyToken, coupon.update);
  router.post("/imageUpload/:id", VerifyToken, coupon.import);
  router.post("/searchRecord", VerifyToken, coupon.searchRecord);
  router.post("/pagiRecord", VerifyToken, coupon.pagiRecord);
  router.get("/sortRecord", VerifyToken, coupon.sortRecord);


  app.use('/api/coupon/', router);
};