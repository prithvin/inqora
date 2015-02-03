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

router.post('/addsub', function (req, res){
	var newsub = req.body.newsub;
	if(isSess(req)) {
		users.findOne({'_id' : req.session.UserId}, function (err, data) {
			console.log(data.FollowingAccs);
			if (data.FollowingAccs != null && (data.FollowingAccs.Users.indexOf(req.body.newsub) != -1 || data.FollowingAccs.Companies.indexOf(req.body.newsub) != -1 || data.FollowingAccs.Groups.indexOf(req.body.newsub) != -1)) {
				res.send("Already subscribed");
			}
			else {
				searchresmod.findOne({$or: [{'Username' : newsub},{'UserId' : newsub}]}, "Type", function (err, typer) {
					if (typer == null)
						res.send("Error. Cannot subscribe");
					else {
						res.send("Success");
						if (typer.Type == "User") {
							var obj = {
								Username: data.Username,
								Name: data.Name,
								TimeAdded: (new Date).getTime(),
								isNew: true
							};
							users.update({'Username' : newsub}, {$push: {Followers : data.Username}}, function(err, ups)  {});
							users.update({'Username' : newsub}, {$push: {'Notifications.NewFollowers' : obj}}, function(err, ups)  {});
							users.update({'Username' : data.Username}, {$push: {'FollowingAccs.Users' : newsub}}, function(err, ups)  {});
						}
						else if (typer.Type == "Company" || typer.Type == "Group") {
							console.log("HEYA");
							companies.update({'UserId': newsub} , {$inc: {NumFollowers: 1}}, function (err, up){});
							if (typer.Type = 'Company"')
								users.update({'Username' : data.Username}, {$push: {'FollowingAccs.Companies' : newsub}}, function(err, ups)  {console.log(ups);});
							else {
								users.update({'Username' : data.Username}, {$push: {'FollowingAccs.Groups' : newsub}}, function(err, ups)  {console.log(ups);});
							}
						}
					}
				});
			}
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.post('/removesub', function (req, res){
	var newsub = req.body.newsub;
	if(isSess(req)) {
		users.findOne({'_id' : req.session.UserId}, function (err, data) {
			console.log(data.FollowingAccs);
			if (data.FollowingAccs.Users.indexOf(req.body.newsub) == -1 && data.FollowingAccs.Companies.indexOf(req.body.newsub) == -1 && data.FollowingAccs.Groups.indexOf(req.body.newsub) == -1) {
				res.send("Not subscribed");
			}
			else {
				searchresmod.findOne({$or: [{'Username' : newsub},{'UserId' : newsub}]}, "Type", function (err, typer) {
					if (typer == null)
						res.send("Error. Cannot unsubscribe");
					else {
						res.send("Success");
						if (typer.Type == "User") {
							users.update({'Username' : newsub}, {$pull: {Followers : data.Username}}, function(err, ups)  {});
							users.update({'Username' : data.Username}, {$pull: {'FollowingAccs.Users' : newsub}}, function(err, ups)  {});
						}
						else if (typer.Type == "Company" || typer.Type == "Group") {
							companies.update({'UserId': newsub} , {$inc: {NumFollowers: -1}}, function (err, up){});
							if (typer.Type = 'Company"')
								users.update({'Username' : data.Username}, {$pull: {'FollowingAccs.Companies' : newsub}}, function(err, ups)  {console.log(ups);});
							else {
								users.update({'Username' : data.Username}, {$pull: {'FollowingAccs.Groups' : newsub}}, function(err, ups)  {console.log(ups);});
							}
							users.update({'Username' : data.Username}, {$pull: {type : newsub}}, function(err, ups)  {});
						}
					}
				});
			}
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.get('/getsubs', function (req, res) {
	var username = "aqeasfsdfasdfasdfasdfasdfasdfasdfsadfasdfasdfasdfasdfasdf";
	console.log(req.query.Username);
	if (req.query.Username != null && req.query.Username != "") {
		username = req.query.Username;
		console.log("HEYHEYHEY");
	}
	if(isSess(req)) {
		users.findOne({$or: [{_id: req.session.UserId}, {"Username" : username}]}, function (err, data) {
			var arr = {
				Companies: [],
				Groups: [],
				Users: []
			};
			var subs = data.FollowingAccs;
			var usernames = subs.Users.concat(subs.Companies, subs.Groups);
			if (data._id == req.session.UserId) 
				getNameAndAdd(arr, usernames, 0, true, res, {Users: [], Companies: [], Groups:[]});
			else {
				users.findOne({_id: req.session.UserId}, function (err, data2) {
					if (data2 == null)
						res.send("Error. Not in session");
					else {
						if (data2.FollowingAccs == null)
							obj = {Users: [], Companies: [], Groups:[]};
						else 
							obj = data2.FollowingAccs;
						getNameAndAdd(arr, usernames, 0, false, res, obj);
					}
				});	
			}
		});
	}
});

router.get('/getfollowers', function (req, res) {
	var username = "aqeasfsdfasdfasdfasdfasdfasdfasdfsadfasdfasdfasdfasdfasdf";
	if (req.query.Username != null && req.query.Username != "") {
		username = req.query.Username;
	}
	if(isSess(req)) {
		users.findOne({$or: [{'_id': req.session.UserId}, {"Username" : username}]}, function (err, data) {
			var arr = {
				Companies: [],
				Groups: [],
				Users: []
			};
			var usernames = data.Followers;
			console.log(usernames);
			if (data._id == req.session.UserId) 
				getNameAndAdd(arr, usernames, 0, true, res, []);
			else {
				users.findOne({_id: req.session.UserId}, function (err, data2) {
					getNameAndAdd(arr, usernames, 0, false, res, data2.FollowingAccs);
				});	
			}
		});
	}
});

function getNameAndAdd (arr, usernames, x, alreadysubbed, res, sessarr){
	if (x < usernames.length)  {
		console.log(arr[x]);
		searchresmod.findOne({$or: [{'Username' : usernames[x]},{'UserId' : usernames[x]}]}, "Name Type", function (err, data) {
			console.log(data);
			if (data == null)
				console.log("ignore this one");
			else  if (alreadysubbed){
				var obj = {Username: usernames[x], Subbed: true, Name: data.Name};
				if (data.Type == "User")
					arr.Users.push(obj);
				else if (data.Type == "Company")
					arr.Companies.push(obj);
				else if (data.Type == "Group")
					arr.Groups.push(obj);
			}
			else {
				if (sessarr.Users.indexOf(usernames[x]) != -1 || sessarr.Companies.indexOf(usernames[x]) != -1  || sessarr.Groups.indexOf(usernames[x]) != -1 )
					var obj = {Username: usernames[x], Subbed: true, Name: data.Name};
				else
					var obj = {Username: usernames[x], Subbed: false, Name: data.Name};
				if (data.Type == "User")
					arr.Users.push(obj);
				else if (data.Type == "Company")
					arr.Companies.push(obj);
				else if (data.Type == "Group")
					arr.Groups.push(obj);
			}
			getNameAndAdd(arr, usernames, (x+1) , alreadysubbed, res, sessarr);
		});
	}
	else{
		res.send(arr);
	}
}
module.exports = router;
