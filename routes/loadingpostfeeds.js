var express = require('express');
var router = express.Router();



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

router.get('/loadnewsfeed', function(req,res) {
    if (isSess(req)) { 
        users.findOne({_id: req.session.UserId}, function(err, data) {
            if (data == null)
                res.send("Invalid session");
            else  {
                var subs = data.FollowingAccs;
                 var arr = subs.Users.concat(subs.Companies, subs.Groups);
                 arr.push(data.Username);
                posts.find({Tags: {$elemMatch: {$in: arr}}}, function(err,user) {
                    if (user == null)
                        res.send("");
                    else {
                        var arr  = user.sort(function(a, b) {return b.Time - a.Time});
                        var newarr  = [];
                        for (var x =0; x < arr.length; x++) {
                            newarr.push(arr[x]._id);
                        }
                       // console.log(newarr);
                        res.send(newarr);
                    }
                });
            }
        });
        
    }
    else
        res.send("Invalid session");
});

router.get('/postscreated', function(req,res) {
    if (isSess(req)) {
        var username = req.query.Username;
        users.findOne({Username: username}, function(err, data1) {
            if (data1 == null) 
                res.send("Invalid username");
            else {
                var arr = [];
                posts.find({'PosterUsername': data1.Username}, "_id Time", function(err, data) {
                    var newarr  = data.sort(function(a, b) {return b.Time - a.Time});
                    for (var x =0; x < newarr.length; x++)
                        arr.push(newarr[x]._id);
                    res.send(arr);
                });
            }
        });
    }
    else
        res.send("Invalid session");
});


router.get('/postsliked', function(req,res) {
    if (isSess(req)) {
        var username = req.query.Username;
        users.findOne({Username: username}, function(err, data1) {
            if (data1 == null) 
                res.send("Invalid username");
            else {
                var arr = [];
                posts.find({'Votes.WhoUpvoted': data1.Username}, "_id Time", function(err, data) {
                    var newarr  = data.sort(function(a, b) {return b.Time - a.Time});
                    for (var x =0; x < newarr.length; x++)
                        arr.push(newarr[x]._id);
                    res.send(arr);
                });
            }
        });
    }
    else
        res.send("Invalid session");
});


router.get('/postsdisliked', function(req,res) {
    if (isSess(req)) {
        var username = req.query.Username;
        users.findOne({Username: username}, function(err, data1) {
            if (data1 == null) 
                res.send("Invalid username");
            else {
                var arr = [];
                posts.find({'Votes.WhoDownvoted': data1.Username}, "_id Time", function(err, data) {
                    var newarr  = data.sort(function(a, b) {return b.Time - a.Time});
                    for (var x =0; x < newarr.length; x++)
                        arr.push(newarr[x]._id);
                    res.send(arr);
                });
            }
        });
    }
    else
        res.send("Invalid session");
});


router.get('/postscommented', function (req, res) {
    users.findOne({Username: req.query.Username}, function (err, data) {
        if (data == null)
            res.send("Invalid username");
        else {
            var arr = data.Notifications.PostUserCommentedOrPosted;
            var myarr = [];
            if (arr != null) {
                for (var x =0; x< arr.length; x++) {
                    if (arr[x].wasComment == true) {

                        myarr.push(mongoose.Types.ObjectId((arr[x].PostId)));
                    }
                }
               posts.find({'_id': {$in: myarr}}, "Time _id" , function(err,user) {
                    //console.log(user);
                    if (user == null)
                       res.send("SORRY, could not find anything");
                    else {
                        var newarr  = user.sort(function(a, b) {return b.Time - a.Time});
                        var newarr2  = [];
                        for (var x =0; x < newarr.length; x++) {
                            newarr2.push(newarr[x]._id);
                        }
                        res.send(newarr2);
                    }
                });
            }
            else {
                res.send([]);
            }
        }
    });
});

module.exports = router;
