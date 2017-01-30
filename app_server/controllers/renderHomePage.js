

var renderHomepage = function(req, res, responseBody){
    var message;
    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    }
    if (!responseBody.length) {
        message = "No se encontraron resultados";
    }
    }
    res.render('report-list', {
        title: 'Reporta malas personas',
        pageHeader: {
            title: 'reportin',
            strapline: 'No te dejes chamaquear'
            },
            sidebar: 'Reporta a las malas personas',
            reports: responseBody
    });

module.exports.homelist = function(req, res){
    renderHomepage(req, res);
    var requestOptions, path;
    path = '/api/searchs';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {
        }
    };
    request(requestOptions, function(err, response, body) {
        var i, data;
        data = body;
        if (response.statusCode === 200 && data.length){
            for (i=0; i<data.length; i++) {
            
            }

        }
        renderHomepage(req, res, body);
    });
};

