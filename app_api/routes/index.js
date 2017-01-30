var express = require('express');
var multiparty = require('connect-multiparty')();
var router = express.Router();
var multer  = require('multer');

var ctrlSearch = require('../controllers/search');
var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentification');
var ctrlUploads = require('../controllers/uploads');

var path;
var uploadId;

if (router.post('/upload/document/')){
  path = './uploads/documents/';
  uploadId = 'reportedDocument';
}
else{
   path = './uploads/images/';
  uploadId = 'reportedImage';
}

var storage =  multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, path);
    },
    filename: function (req, file, callback) {
      var originalname = file.originalname;
      var extension = originalname.split(".");
      filename = Date.now() + '.' + extension[extension.length-1];
      callback(null, filename);
    }
  }); 

var upload = multer({ storage : storage});
// search
router.get('/searchs', ctrlSearch.searchList);
router.post('/search', ctrlSearch.searchCreate);
router.get('/search/:reportid', ctrlSearch.searchReadOne);
router.put('/search/:reportid', ctrlSearch.searchUpdateOne);
router.delete('/search/:reportid', ctrlSearch.searchDeleteOne);

router.get('/profile/:profileid', ctrlProfile.profileReadOne);
router.put('/profile/:profileid', ctrlProfile.profileUpdateOne);
router.delete('/profile/:profileid', ctrlProfile.profileDeleteOne);

//auth
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//images
router.get('/download/images', ctrlUploads.searchImages);
router.get('/download/image/:photoid', ctrlUploads.downloadImage);
router.post('/upload/image/', upload.single(uploadId), ctrlUploads.uploadImage);
router.delete('/delete/image/:photoid', ctrlUploads.deleteImage);

//documents
router.get('/download/document/:documentid', ctrlUploads.downloadDocument);
router.post('/upload/document/', upload.any(uploadId), ctrlUploads.uploadDocument);

module.exports = router;