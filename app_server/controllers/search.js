var request = require('request');
var apiOptions = {
    server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "url-to-deplpoyment";
}


/* GET 'search' page */
module.exports.search = function(req, res){
        var requestOptions, path;
        path = "/api/search/" + req.params.reportid;
        requestOptions = {
            url : apiOptions.server + path,
            method : "GET",
            json : {}
        };
        request(requestOptions, function(err, response, body) {
            if (response.statusCode === 200) {
                /*data.coords = {
                    lng : body.coords[0],
                    lat : body.coords[1]
                };*/
            renderDetailPage(req, res);
            } 
            else {
            _showError(req, res, response.statusCode);
            }
        });  
};

/* GET 'results' page */
module.exports.resultList = function(req, res){
    res.render('index', { title: 'Resultados' });
};

/* GET 'reporteduser' page */
module.exports.resultUser = function(req, res){
    res.render('index', { title: 'Usuario Reportado' });
};
