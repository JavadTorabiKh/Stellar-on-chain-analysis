const { Router } = require("express");

const router = new Router();

//  @desc   Index Page
//  @route  GET /
router.get("/", (req, res) => {
    res.render("index", {
        pageTitle: "رهگیری تراکنش",
        path: "/",
    });
});

module.exports = router;
