var request = require('request');
var apiOptions = {
    server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "url-to-deplpoyment";
}


/* GET 'register' page */
module.exports.register = function(req, res){
    res.render('index', { title: 'Registro' });
};

/* GET 'registerConfirmation' page */
module.exports.registerConfirmation = function(req, res){
    res.render('index', { title: 'Confirmar Registro' });
};

/* GET 'recover' page */
module.exports.recover = function(req, res){
    res.render('index', { title: 'Recuperar contraseña' });
};

/* GET 'recoverConfirmation' page */
module.exports.recoverConfirmation = function(req, res){
    res.render('index', { title: 'Se recupero la contraseña' });
};