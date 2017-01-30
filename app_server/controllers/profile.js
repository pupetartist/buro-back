var request = require('request');
var apiOptions = {
    server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "url-to-deplpoyment";
}

var _showError = function (req, res, status) {
var title, content;
if (status === 404) {
  title = "404, page not found";
  content = "Oh dear. Looks like we can't find this page. Sorry.";
} 
else {
  title = status + ", something's gone wrong";
  content = "Something, somewhere, has gone just a little bit wrong.";
}
res.status(status);
res.render('generic-text', {
  title : title,
  content : content
});
};

/* GET 'profiles' page */
module.exports.profiles = function(req, res){
    res.render('index', { title: 'Perfiles' });
};
/* GET 'reportList' page */
module.exports.reportList = function(req, res){
    res.render('index', { title: 'Lista de Malas Palabras' });
};
/* GET 'addreport' page */

var renderReviewForm = function (req, res) {
    res.render('index', {
        title: 'reportin',
        pageHeader: { title: 'ver reportes' },
        error: req.query.err
    });
};
/* GET 'Add review' page */
module.exports.addReport = function(req, res){
    res.render('index', { title: 'Agregar reporte' });
};


/* GET 'addReportConfirmation' page */
module.exports.addReportConfirmation = function(req, res){
    res.render('index', { title: 'Confirmar Reporte' });
};

module.exports.doAddReport = function(req, res){
    var requestOptions, path, reportid, postdata;
    reportid = req.params.reportid;
    path = "/api/locations/" + reportid + '/reviews';
    postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    if (!postdata.author || !postdata.rating || !postdata.reviewText) {
        res.redirect('/location/' + locationid + '/reviews/new?err=val');
    } 
    else {
        requestOptions = {
            url : apiOptions.server + path,
            method : "POST",
            json : postdata
        };
        request(requestOptions, function(err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/location/' + locationid);
            } 
            else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
                res.redirect('/location/' + locationid + '/reviews/new?err=val');
            }    
            else {
                console.log(body);
                _showError(req, res, response.statusCode);
            }
        });
    };
};

module.exports.doAddProfile = function(req, res){};
