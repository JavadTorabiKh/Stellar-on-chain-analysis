exports.get404 = (req,res)=>{
    res.render("error/404", { pageTitle: "صفحه پیدا نشد | 404", path: "/404" });
}

exports.get500 = (req,res)=>{
    res.render("error/500", { pageTitle: "صفحه پیدا نشد | 500", path: "/404" });
}