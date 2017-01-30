var mongoose = require( 'mongoose' );

var imageSchema = new mongoose.Schema({
    photoid: String,
    fieldname: String,
    originalname: String,
    encoding: String,
    mimeptype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    created_at: Date,
    updated_at: Date
});

//Documents

//define Model for metadata collection.
var documentSchema = new mongoose.Schema({
    documentid: String,
    fieldname: String,
    originalname: String,
    encoding: String,
    mimeptype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    created_at: Date,
    updated_at: Date
});



var profileSchema = new mongoose.Schema({ 
    profileid: String,
    profileName: {type:String, required: true},
    profileImg: {type: [imageSchema], required: true },
    descriptionText: String,
    workPosition: {type:String, required: true},
    company: {type:String, required: true},

});

var reportSchema = new mongoose.Schema({ 
    reportid: String,
    reportedName: {type:String},
    reportedImage:{type: [imageSchema], required: true},
    reportedDocument: [documentSchema],
    descriptionText: {type:String},
    workPosition: {type:String},
    company: {type:String},
    createdOn: {type: Date, "default": Date.now},

});


mongoose.model('profile', profileSchema);
mongoose.model('report', reportSchema);
mongoose.model('File', documentSchema);
mongoose.model('Images', imageSchema);

require('./profile');