var mongoose = require('mongoose');
var report = mongoose.model('report');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.searchList = function(req, res) {
    if (req.params) {
        console.log("GET - /search");
        report
            .find()
            .populate('image') //populate 
            .exec(function(err, report) {
                if (!report) {
                    sendJsonResponse(res, 404, {
                        "message": "reportid not found"
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
            "message": "No reportid in request"
        });
    }
};

module.exports.searchReadOne = function(req, res) {
    if (req.params && req.params.reportid) {
        console.log("GET - /search/:reportid");
        report
            .findById(req.params.reportid)
            .populate('image') //populate 
            .exec(function(err, report) {
                if (!report) {
                    sendJsonResponse(res, 404, {
                        "message": "reportid not found"
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
            "message": "No reportid in request"
        });
    }
};

module.exports.searchCreate = function(req, res) {
    console.log('POST - /report');
    console.log(req.body);
    report.create({
        reportid: req.body.id,
        reportedName: req.body.reportedName,
        descriptionText: req.body.descriptionText,
        workPosition: req.body.workPosition,
        company: req.body.company,
        reportedImage: req.body.reportedImage,  
        createdOn:  req.body.createdOn,
        reportedDocument: req.body.reportedDocument,
        workPosition: req.body.workPosition,
    }, 
    
    function(err, report) {
    if (err) {
        sendJsonResponse(res, 400, err);
    } 
    else {
        sendJsonResponse(res, 201, report);
    }
    
    });
};

module.exports.searchUpdateOne = function (req, res) {
    console.log("PUT - /search/:report");
    console.log(req.body);
    if (!req.params.reportid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, reportid is required"
        });
    return;
    }
    report
        .findById(req.params.reportid)
        .select
        .exec(
            function(err, report) {
                if (!report) {
                    sendJsonResponse(res, 404, {
                        "message": "reportid not found"
                });
                return;
                }
                else if (err) {
                    sendJsonResponse(res, 400, err);
                return;
                }
                reportid= req.body.id,
                reportedName = req.body.reportedName,
                descriptionText = req.body.descriptionText,
                workPosition = req.body.workPosition,
                company = req.body.company,
                reportedImage = req.body.reportedImage,  
                createdOn =  req.body.createdOn,
                reportedDocument = req.body.reportedDocument,
                workPosition = req.body.workPosition,  
                report.report.save(function(err, report) {
                    if (err) {
                        console.log(err);
                        sendJsonResponse(res, 404, err);
                    } 
                    else {
                        sendJsonResponse(res, 200, report);
                    }
                });
            }
    );
};

module.exports.searchDeleteOne = function(req, res) {
    var searchid = req.params.searchid;
    console.log("DELETE - /search/:reportid");
    if (searchid) {
        search
            .findByIdAndRemove(searchid)
            .exec(
                function(err, search) {
            if (err) {
                sendJsonResponse(res, 404, err);
            return;
            }
                sendJsonResponse(res, 204, null);
            });
    } 
    else {
        sendJsonResponse(res, 404, {
            "message": "No searchid"
        });
    }
};


