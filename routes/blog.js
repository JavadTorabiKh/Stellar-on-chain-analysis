const { Router } = require("express");

const router = new Router();

//  @desc   Weblog Index Page
//  @route  GET /
router.get("/", (req, res) => {
    res.render("index", {
        pageTitle: "وبلاگ",
        path: "/",
    });
});

module.exports = router;
