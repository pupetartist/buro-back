var mongoose = require('mongoose');
var express = require('express');
var profile = mongoose.model('profile');
var app = express();



var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.profileReadOne = function(req, res) {
    if (req.params && req.params.profileid) {
        console.log("GET - /profile/:prfileid");
        profile
            .findById(req.params.profileid)
            .exec(function(err, profile) {
                if (!profile) {
                    sendJsonResponse(res, 404, {
                        "message": "profileid not found"
                        });
                return;
                } 
                else if (err) {
                    sendJsonResponse(res, 500 , err);
                    console.log('Internal error(%d): %s',res.statusCode,err.message);
                return;
                }
                    sendJsonResponse(res, 200, profile);
                });
    } 
     else {
        sendJsonResponse(res, 404, {
            "message": "No profileid in request"
        });
    }
};

module.exports.profileCreate = function(req, res) {
    console.log('POST - /profile');
    console.log(req.body);
    profile.create({
        profileid: req.body.id,
        profileName: req.body.profileName,
        descriptionText: req.body.descriptionText,
        workPosition: req.body.workPosition,
        company: req.body.workPosition,
        profileImg: req.body.profileImg,    
    },
    
    function(err, profile) {
    if (err) {
        sendJsonResponse(res, 400, err);
    } 
    else {
        sendJsonResponse(res, 201, profile);
    }
    
    });
};

module.exports.profileUpdateOne = function (req, res) {
    console.log("PUT - /profile/:profileid");
    console.log(req.body); 
    if (!req.params.profileid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, profileid is required"
        });
    return;
    }
    profile
        .findById(req.params.profileid)
        .select
        .exec(
            function(err, profile) {
                if (!profile) {
                    sendJsonResponse(res, 404, {
                        "message": "profileid not found"
                });
                return;
                }
                else if (err) {
                    sendJsonResponse(res, 400, err);
                return;
                }
                profile.profileid = req.body.id,
                profile.profileName = req.body.profileName;
                profile.descriptionText = req.body.descriptionText;
                profile.workPosition = req.body.workPosition;
                profile.company = req.body.workPosition;
                profile.img = req.body.profileImg; 
                profile.profile.save(function(err, profile) {
                    if (err) {
                        console.log(err);
                        sendJsonResponse(res, 404, err);
                    } 
                    else {
                        sendJsonResponse(res, 200, profile);
                    }
                });
            }
    );
};

module.exports.profileDeleteOne = function(req, res) {
    var profileid = req.params.profileid;
    console.log("DELETE - /profile/:profileid");
    if (profileid) {
        profile
            .findByIdAndRemove(profileid)
            .exec(
                function(err, profile) {
            if (err) {
                sendJsonResponse(res, 404, err);
            return;
            }
                sendJsonResponse(res, 204, null);
            });
    } 
    else {
        sendJsonResponse(res, 404, {
            "message": "No profileid"
        });
        }
};
