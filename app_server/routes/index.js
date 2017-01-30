var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlSearch = require('../controllers/search');
var ctrlAuth = require('../controllers/auth');
var ctrlProfile = require('../controllers/profile');
var ctrlOthers = require('../controllers/others');

//  Home page // About page. 

router.get('/', ctrlHome.home);

// Search page // Results

router.get('/search', ctrlSearch.search);
router.get('/results/', ctrlSearch.resultList);
router.get('/result/:reportid', ctrlSearch.resultUser);

//Auth Sign in, Log in //Password Reset

router.get('/register', ctrlAuth.register);
router.get('/register/confirmation', ctrlAuth.registerConfirmation);
router.get('/recover', ctrlAuth.recover);
router.get('/recover/confirmation', ctrlAuth.recoverConfirmation);

//Profiles

router.get('/profile', ctrlProfile.profiles);
router.post('/profile/new/:profileid', ctrlProfile.doAddProfile);
router.get('/profile/reportlist', ctrlProfile.reportList);
router.get('/profile/addreport', ctrlProfile.addReport);
router.post('/profile/addreport/new/:reportid', ctrlProfile.doAddReport);
router.get('/profile/addreport//new/:reportid/confirmation', ctrlProfile.addReportConfirmation);

// others

router.get('/about', ctrlOthers.about);
router.get('/contact', ctrlOthers.contact);

module.exports = router;
