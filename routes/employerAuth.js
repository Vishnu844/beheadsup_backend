const router = require('express').Router();
const employerController = require('../controller/employerController');

//Register and login
router.post('/employer/register', employerController.registerEmployer);
router.post('/employer/login', employerController.loginEmployer);//

module.exports = router;