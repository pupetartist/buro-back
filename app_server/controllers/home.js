var request = require('request');
var apiOptions = {
    server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "url-to-deplpoyment";
}


/* GET 'home' page */
module.exports.home = function(req, res){
    res.render('report-list', { title: 'Home' });
};
