const express= require('express');
const app= express.Router();
const allCourses= require('../controllers/allCourses');

app.get("/ADCA",allCourses.ADCA);
app.get("/ADCHN", allCourses.ADCHN);
app.get("/BCC", allCourses.BCC);
app.get("/DCA", allCourses.DCA);
app.get("/DOAAP", allCourses.DOAAP);
app.get("/DTP", allCourses.DTP);
app.get("/MDCA", allCourses.MDCA);
app.get("/other-courses", allCourses.otherCourses);

module.exports= app;