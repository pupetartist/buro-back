var request = require('request');
var apiOptions = {
    server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "url-to-deplpoyment";
}


/* GET about page */
module.exports.about = function(req, res){
    res.render('index', { title: 'About' });
};

/*GET contact page */
module.exports.contact = function(req,res){
    res.render('index',{ title: 'Contact'})
};

