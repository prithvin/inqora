var express = require('express');
var router = express.Router();
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:7888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


function isSess (req) {
    if (req.session.UserId == null)
        return false;
    else if(req.session.UserId.length > 2)
        return true;
    else
        return false;
}



router.get('/search/tags/post/recent', function(req,res) {
    if (isSess(req)) { 
        var arr = req.query.search;
        users.findOne({_id: req.session.UserId}, function(err, user) {
            if (user == null)
                res.send("Invalid session");
            else  {
                posts.find({Tags: {$elemMatch: {$in: arr}}}, function(err,user) {
                    if (user == null)
                        res.send("");
                    else {
                        var arr  = user.sort(function(a, b) {return b.Time - a.Time});
                        var newarr  = [];
                        for (var x =0; x < arr.length; x++) {
                            newarr.push(arr[x]._id);
                        }
                        res.send(newarr);
                    }
                });
            }
        });
        
    }
    else
        res.send("Invalid session");
});
module.exports = router;
