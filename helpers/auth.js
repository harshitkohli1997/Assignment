//function to check whether user session exist or not
module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){ 
      return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/login');
  }
}