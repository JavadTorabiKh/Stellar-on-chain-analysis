const passport = require("passport");
const fetch = require("node-fetch");

const User = require("../models/User");

exports.login = (req, res) => {
    res.render("login", {
        pageTitle: "ورود به بخش مدیریت",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error"),
    });
};

exports.handleLogin = async (req, res, next) => {
    if (!req.body["g-recaptcha-response"]) {
        req.flash("error", "اعتبار سنجی captcha الزامی می باشد");
        return res.redirect("/users/login");
    }

    const secretKey = process.env.CAPTCHA_SECRET;
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}
    &remoteip=${req.connection.remoteAddress}`;

    const response = await fetch(verifyUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
    });

    const json = await response.json();

    if (json.success) {
        passport.authenticate("local", {
            failureRedirect: "/users/login",
            failureFlash: true,
        })(req, res, next);
    } else {
        req.flash("error", "مشکلی در اعتبارسنجی captcha هست");
        res.redirect("/users/login");
    }
};

exports.rememberMe = (req, res) => {
    if (req.body.remember) {
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000; // 1 day 24
    } else {
        req.session.cookie.expire = null;
    }

    res.redirect("/dashboard");
};

exports.logout = (req, res) => {
    req.session = null,
    req.logout();
    // req.flash("success_msg", "خروج موفقیت آمیز بود");
    res.redirect("/users/login");
};

exports.register = (req, res) => {
    res.render("register", {
        pageTitle: "ثبت نام کاربر جدید",
        path: "/register",
    });
};

exports.createUser = async (req, res) => {
    const errors = [];
    try {
        await User.userValidation(req.body);
        const { fullname, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            errors.push({ message: "کاربری با این ایمیل موجود است" });
            return res.render("register", {
                pageTitle: "ثبت نام کاربر",
                path: "/register",
                errors,
            });
        }

        // const hash = await bcrypt.hash(password, 10);
        // await User.create({ fullname, email, password: hash });
        await User.create({ fullname, email, password });
        req.flash("success_msg", "ثبت نام موفقیت آمیز بود.");
        res.redirect("/users/login");
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        });

        return res.render("register", {
            pageTitle: "ثبت نام کاربر",
            path: "/register",
            errors,
        });
    }
};
