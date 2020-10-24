
const ADCA=  function (req, res) {
    res.render("./AllCourses/ADCA");
}

const ADCHN= function (req, res) {
    res.render("./AllCourses/ADCHN");
}

const BCC=  function (req, res) {
    res.render("./AllCourses/BCC");
}

const DCA= function (req, res) {
    res.render("./AllCourses/DCA");
}

const DOAAP= function (req, res) {
    res.render("./AllCourses/DOAAP");
}

const DTP= function (req, res) {
    res.render("./AllCourses/DTP");
}

const MDCA= function (req, res) {
    res.render("./AllCourses/MDCA");
}

const otherCourses= function (req, res) {
    res.render("./AllCourses/other-courses");
}

module.exports= {
    ADCA,
    ADCHN,
    BCC,
    DCA,
    DOAAP,
    DTP,
    MDCA,
    otherCourses
}