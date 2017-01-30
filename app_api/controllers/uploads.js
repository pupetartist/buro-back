var multer  =   require('multer');
var mongoose = require('mongoose');
var files = mongoose.model('File');
var images = mongoose.model('Images');
var fs = require('fs');
var Gridfs = require('gridfs-stream');
var multiparty = require('connect-multiparty')();

mongoose.createConnection("mongodb://localhost/uploads/");
var db = mongoose.connection.db;
var mongoDriver = mongoose.mongo;
var gfs = new Gridfs(db, mongoDriver);

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};


// Images

var path;
var uploadId;
var storage =  function(req,res,next){multer.diskStorage({
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
};
var upload = function(req,res,next){multer({ storage 
    : storage}).single(uploadId)
}

module.exports.searchImages = function(req, res) {
    if (req.params) {
        console.log("GET - /search");
        images
            .find()
            .populate('image') //populate 
            .exec(function(err, report) {
                if (!report) {
                    sendJsonResponse(res, 404, {
                        "message": "photoid not found"
                        });
                return;
                } 
                else if (err) {
                    sendJsonResponse(res, 500, err);
                    console.log('Internal error(%d): %s',res.statusCode,err.message); 
                return;
                }
                    sendJsonResponse(res, 200, report);
                });
    } 
    else {
        sendJsonResponse(res, 404, {
            "message": "No photoid in request"
        });
    }
};
module.exports.downloadImage = function(req,res,next){
      if (req.params && req.params.photoid) {
        console.log("GET - /search");
        console.log(req.params);
        images
            .findById(req.params.photoid)
            .populate('image') //populate 
            .exec(function(err, report) {
                if (!report) {
                    sendJsonResponse(res, 404, {
                        "message": "photoid not found"
                        });
                return;
                } 
                else if (err) {
                    sendJsonResponse(res, 500, err);
                    console.log('Internal error(%d): %s',res.statusCode,err.message); 
                return;
                }
                    sendJsonResponse(res, 200, report);
                });
    } 
    else {
        sendJsonResponse(res, 404, {
            "message": "No photoid in request"
        });
    }
};

module.exports.uploadImage = function(req, res, next){
    path = './uploads/images/';
    uploadId = 'reportedImage';
    console.log('file',req.file); //form files
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname,
      aliases: req.body.aliases,
      metadata: req.body.metadata,
      content_type: req.file.mimetype,  
    });
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream(path + req.file.filename)
      .pipe(writestream);
        images.create({
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          destination:req.file.destination,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
          photoid: req.file.id,
        }, 
            
        function(err, report) {
          if (err) {
            sendJsonResponse(res, 400, err);
          } 
          else {
            sendJsonResponse(res, 201, report);
          }
        });
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
            res.redirect('/');
        }
        if (req.file) {
          fs.unlink(path + req.file.filename);
          console.log('Profile image uploaded');
        }
        res.end("File is uploaded");
    });
};

module.exports.deleteImage = function(req, res, next){
  console.log(db.fs)
  console.log(req.params.photoid)
  console.log(req.body)
  console.log(req.params)
  console.log(req.query)
    gfs.findOne({_id: req.params.photoid}, function(err, found){
      found ? console.log('File exists') : console.log('File does not exist');
      if(err) return res.send("Error occured");
      if(found){
        gfs.remove({filename: req.params.photoid}, function(err){
          if(err) return res.send("Error occured");
          res.send("Image deleted!");
        });
      } else{
        res.send("No image found with that title");
      }
    });
  }


//PDF
module.exports.uploadDocument = function(req, res, next){
   for ( i in req.files ){
    //console.log('files', req.files);
    //console.log('file',req.files[i]);
    console.log('filename', i,  req.files[i].filename);
    path = './uploads/documents/';
    uploadId = 'reportedDocument';
    var writestream = gfs.createWriteStream({  
      filename: req.files[i].originalname,
      aliases: req.body.aliases,
      content_type: req.files[i].mimetype,
      mode: 'w',
      metadata: req.body.metadata,
    });
    fs.createReadStream(path + req.files[i].filename)
      .pipe(writestream);
      Doc = "Doc" + i;
          files.create(Doc=[{
            fieldname: req.files[i].fieldname,
            originalname: req.files[i].originalname,
            encoding: req.files[i].encoding,
            mimetype: req.files[i].mimetype,
            destination:req.files[i].destination,
            filename: req.files[i].filename,
            path: req.files[i].path,
            size: req.files[i].size,
            documentid: req.files[i].id,}
          ], function(err,report){
           for (j in req.files){
            console.log(Doc);
            console.log(j, "--", req.files.length -1);
            console.log(res);
              if (err && j == (req.files.length - 1)) {
                sendJsonResponse(res, 400, err);
              } 
              else if (j == (req.files.length - 1)) {
                sendJsonResponse(res,201, report);
              }
           }
          });    
  } 
};



//pdf

module.exports.downloadDocument = function(req, res, next) {
   var readstream = gfs.createReadStream({
      _id: req.params.documentid
   });
   readstream.pipe(res);
};

require('../models/profile');