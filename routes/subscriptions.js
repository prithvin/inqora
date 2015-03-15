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


router.post('/addreq', function (req, res) {
	var newmember = req.body.newmember;
	var groupname = req.body.groupname;
	users.findOne({Username: newmember}, function (err, data) {
		if (data == null)
			res.send("Error. User does not exist");
		else {
			groups.update({UserId: groupname}, {$pull: {Requests : { Username: newmember }}}, function (err, up) {
				console.log(groupname);
				console.log(newmember);
				console.log("GROUP updated");
				console.log(up);
				users.update({Username: newmember},{$push: {"FollowingAccs.Groups" : groupname}}, function (err, up) {
					companies.update({'UserId': groupname} , {$inc: {NumFollowers: 1}}, function (err, up){
						res.send("User added!");
					});
				});
			});
		}
	});
});


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
							if (typer.Type == 'Company')
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
							console.log(typer.Type);
							if (typer.Type == 'Company') {
								console.log("LOOOL");
								users.update({'Username' : data.Username}, {$pull: {'FollowingAccs.Companies' : newsub}}, function(err, ups)  {console.log(ups);});
							}
							else {
								console.log("OOOMG");
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
	var sessionid = req.session.UserId;
	if (req.query.Username != null && req.query.Username != "") {
		username = req.query.Username;
		console.log("HEYHEYHEY");
		sessionid = null;
	}
	if(isSess(req)) {
		users.findOne({$or: [{_id: sessionid}, {"Username" : username}]}, function (err, data) {
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
	var sessionid = req.session.UserId;
	if (req.query.Username != null && req.query.Username != "") {
		username = req.query.Username;
		console.log("HEYHEYHEY");
		sessionid = null;
	}
	if(isSess(req)) {
		users.findOne({$or: [{_id: sessionid},  {"Username" : username}]}, function (err, data) {
			var arr = {
				Companies: [],
				Groups: [],
				Users: []
			};
			var usernames = data.Followers;
			if (data._id == req.session.UserId) 
				getNameAndAdd(arr, usernames, 0, false, res, data.FollowingAccs);
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
