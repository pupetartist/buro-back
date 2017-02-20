var multer  =   require('multer');
var mongoose = require('mongoose');
var files = mongoose.model('file');
var images = mongoose.model('images');
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
        //console.log("GET - /search");
        //console.log(req.params);
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
    //console.log("Iniciando post");
    //console.log('file', req.file); //form files
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname,
      aliases: req.body.aliases,
      metadata: req.body.metadata,
      content_type: req.file.mimetype,
      mode: 'w',  
    });
    //console.log("write creado");
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream(path + req.file.filename)
      .pipe(writestream);
      //console.log("createReadStream");
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
          console.log("antes del if");
          if (err) {
            //console.log("Sending json response 400");
            sendJsonResponse(res, 400, err);
            return;
          } 
          else {
            sendJsonResponse(res, 201, report);
            //console.log("Sending json response 201");
            return; 
            
          }
        });
};

module.exports.deleteImage = function(req, res, next){
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
    path = './uploads/documents/';
    console.log('filename', i,  req.files[i].filename);
    var writestream = gfs.createWriteStream({  
      filename: req.files[i].originalname,
      aliases: req.body.aliases,
      content_type: req.files[i].mimetype,
      mode: 'w',
      metadata: req.body.metadata,
    });
   }
    fs.createReadStream(path + req.files[i].filename)
      .pipe(writestream);
          console.log("createReadStream");
          files.insertMany({
            fieldname: req.files[i].fieldname,
            originalname: req.files[i].originalname,
            encoding: req.files[i].encoding,
            mimetype: req.files[i].mimetype,
            destination:req.files[i].destination,
            filename: req.files[i].filename,
            path: req.files[i].path,
            size: req.files[i].size,
            documentid: req.files[i].id,
          },function(err,report){
            //console.log("entre al loop: ", j);
            //console.log(j, "  ----   ", req.files.length -1, i);
            if (err ) {
              //console.log("entre al if");
              sendJsonResponse(res, 400, err);
              return;
            } 
            else {
              //console.log("entre al else");
              sendJsonResponse(res, 201, req.files);
              //console.log("report", report);
              //console.log("files: ", req.files);
              return;
            }   
          });
}


//pdf
module.exports.downloadDocument = function(req, res, next) {
   var readstream = gfs.createReadStream({
      _id: req.params.documentid
   });
   readstream.pipe(res);
};

require('../models/profile');