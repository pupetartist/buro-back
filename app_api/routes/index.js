var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({ secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var multer  = require('multer');
var multiparty = require('connect-multiparty')();
var ctrlSearch = require('../controllers/search');
var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentification');
var ctrlUploads = require('../controllers/uploads');

var storageImage = multer.diskStorage({
          destination: function (req, file, callback) { 
          path = './uploads/images/';
          callback(null, path);
        },filename: function (req, file, callback) {
            var originalname = file.originalname;
            var extension = originalname.split(".");
            filename = extension[extension.length-2] + '_' + Date.now() + '.' + extension[extension.length-1];
            callback(null, filename);
        }
        });
var uploadImage = multer({storage : storageImage});
var storageDocument = multer.diskStorage({
          destination: function (req, file, callback) { 
          path = './uploads/documents/';
          callback(null, path);
        },filename: function (req, file, callback) {
            var originalname = file.originalname;
            var extension = originalname.split(".");
            filename = extension[extension.length-2] + '_' + Date.now() + '.' + extension[extension.length-1];
            callback(null, filename);
        }
        });
var uploadDocument = multer({storage : storageDocument});




// search
router.get('/searchs', ctrlSearch.searchList);
router.post('/search', ctrlSearch.searchCreate);
router.get('/search/:reportid', ctrlSearch.searchReadOne);
router.put('/search/:reportid', auth,  ctrlSearch.searchUpdateOne);
router.delete('/search/:reportid', auth,ctrlSearch.searchDeleteOne);

router.get('/profile/:profileid', ctrlProfile.profileReadOne);
router.put('/profile/:profileid', auth,  ctrlProfile.profileUpdateOne);
router.delete('/profile/:profileid', auth, ctrlProfile.profileDeleteOne);

//auth
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//images
router.get('/download/images/:photoid', ctrlUploads.searchImages);
router.get('/download/image/:photoid', ctrlUploads.downloadImage);
router.post('/upload/image/', uploadImage.single('reportedImage'), ctrlUploads.uploadImage);
router.delete('/delete/image/:photoid', auth, ctrlUploads.deleteImage);

//documents
router.get('/download/document/:documentid', ctrlUploads.downloadDocument);
router.post('/upload/document/', uploadDocument.any("reportedDocument"), ctrlUploads.uploadDocument);

module.exports = router;