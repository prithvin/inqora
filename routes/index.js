var express = require('express');
var router = express.Router();
cors = require('cors');

var yahooFinance = require('yahoo-finance');

function isSess (req) {
    if (req.session.UserId == null)
        return false;
    else if(req.session.UserId.length > 2)
        return true;
    else
        return false;
}

router.get('/logout', function(req,res ) {
	req.session.destroy(function () {
			res.send("Session destroyed");
		});
});

router.get('/test', function (req, res) {
	//console.log(req.headers.host);
	yahooFinance.snapshot(
		{
			symbol: 'AAPL'
			///fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
		}, 
		function (err, snapshot) {
			//console.log(snapshot.lastTradePriceOnly);
			res.send(snapshot);
		}
	);
});

router.get('/numpoints', function(req, res) {
	var username = "";
	var sessionid = req.session.UserId;
	if (req.query.Username != null && req.query.Username != "") {
		username = req.query.Username;
		//console.log("HEYHEYHEY");
		sessionid = null;
	}
	if(isSess(req)) {
		users.findOne({$or: [{_id: sessionid},  {"Username" : username}]}, function (err, data) {
			if (data == null)
				res.send("user not valid");
			else {
				posts.find({ PosterId: data._id}, function (err, data2) {
					var postpts = 0;
					for (var x = 0; x  < data2.length; x++) 
						postspts += 1 + (0.65 * (data2[x].Votes.WhoUpvoted.length - data2[x].Votes.WhoDownvoted.length)) + (0.45 * data2[x].Comments.length);
					var numberfollowers = data.Followers.length / 10.0;
					var percentgain = 0;
					getPercentChanges(data.StockFollowing, 0, res, [], percentgain, numberfollowers, postpts,data._id);
				});
			}
		});
	}
});

function getPortfolioChang(StockFollowing, x, res, avgarr, percentgain, numberfollowers, postpts, userid){
	if (StockFollowing.length -1 < x) {
		avg = 0;
		for (var x = 0;  x < avgarr.length; x++) 
			avg += avgarr[x];
		percentgain = (avg/avgarr.length) * 100;
		var mypoints = (postpts * 0.65) + (percentgain * 0.25) + (numberfollowers * 0.1) 
		res.send(mypoints);
		var points = {
			NumPoints: mypoints,
			LastCalculated: (new Date).getTime()
		}
		users.update({_id: userid}, {$set: {Points: points}}, function (err, up) {	});
	}
	else {
		var tempobj = StockFollowing[x];
		if (tempobj.StockEnd != null) {
			percentstockchange = ((tempobj.StockEnd - tempobj.StockStart)/(temp.StockStart));
			spchange = ((tempobj.SPEnd - tempobj.SPStart)/(temp.SPStart));
			avgarr.push(percentstockchange - spchange);
			getPercentChanges(StockFollowing, x+1, res, avgarr, obj);
		}
		else {
			yahooFinance.snapshot({
					symbol: '^GSPC',
					fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
			}, function (err, snapshot) {
				spchange = ((snapshot.lastTradePriceOnly - tempobj.SPStart)/(temp.SPStart));
				yahooFinance.snapshot({
					symbol: tempobj.CompanyUsername,
					fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
				}, function (err, snapshot2) {
					percentstockchange = ((snapshot2.lastTradePriceOnly - tempobj.StockStart)/(temp.StockStart));
					avgarr.push(percentstockchange - spchange);
					getPercentChanges(StockFollowing, x+1, res, avgarr, obj);
				});
			});
		}
	}
}

// ADD DETECTION -- SEE IF IT IS COMPANY, USER OR GROUP
router.get('/getusertooltip', function (req, res) {
	if (isSess(req)) {
		var username = req.query.Username;
		if (username == "PRIVATE") 
			res.send("<div class='mainspantool'>This post has been marked private. This means that the post was created in a private group, and is ONLY accessible from that private group.</div>")
		else {
			searchresmod.findOne({$or: [{Username: username}, {UserId: username}]}, "Type" , function (err, data1){
				if (data1 == null)
					res.send("ERROR. User does not exist");
				else if (data1.Type == "User") {
					users.findOne({Username: username}, "Name Username Picture Points Followers Thumbnail StockFollowing", function (err, data) {
						var obj = {
							Name: data.Name,
							Username: data.Username,
							Points: data.Points.NumPoints,
							Followers: data.Followers.length + " Followers",
							Thumbnail: data.Picture,
							StockFollowing: 0
						};
						getPercentChanges(data.StockFollowing, 0, res, [], obj, []);
					});
				}
				else if (data1.Type == "Company") {
					companies.findOne({UserId: username}, function (err, data) {
						var obj = {
							Name: data.Name,
							StockTicker: data.UserId,
							isFollowed: "Not Following",
							StockPriceAndPercent: 0,
							Thumbnail: data.Picture,
							NumFollowers: data.NumFollowers + " Followers",
							Industry: data.Industry
						};
						users.findOne({_id: req.session.UserId}, "FollowingAccs" , function (err, data2) {
							if (data2 == null)
								res.send("Not in session");
							else {
								if (data2.FollowingAccs.Companies != null && data2.FollowingAccs.Companies.indexOf(username) != -1)
									obj.isFollowed = "Following";
								yahooFinance.snapshot({
									symbol: username
								}, function (err, snapshot2) {
									if (snapshot2 != null) 
										obj.StockPriceAndPercent = "$" + snapshot2.lastTradePriceOnly + " PE: " + snapshot2.peRatio;
									var str = "<div class='mainspantool'><img class='imagetool' src='" + obj.Thumbnail + "'>";
									str += "<div class='contenttool link'>" + obj.Name + " (@" + obj.StockTicker + ")<br>";
									str += "Industry: " + obj.Industry + "<br>" + obj.StockPriceAndPercent + " <br>" + obj.NumFollowers+ " (" + obj.isFollowed + ") ";
									str += "</div></div>"
									res.send(str);
								});
							}
						});
					});
				}
				else if (data1.Type == "Group") {
					companies.findOne({UserId: username}, function (err, data) {
						var obj = {
							Name: data.Name,
							Username: data.UserId,
							isFollowed: "Not Following",
							Thumbnail: data.Picture,
							NumFollowers: data.NumFollowers + " Followers",
						};
						users.findOne({_id: req.session.UserId}, "FollowingAccs" , function (err, data2) {
							if (data2 == null)
								res.send("Not in session");
							else {
								if (data2.FollowingAccs.Groups != null && data2.FollowingAccs.Groups.indexOf(username) != -1)
									obj.isFollowed = "Following";
								var str = "<div class='mainspantool'><img class='imagetool' src='" + obj.Thumbnail + "'>";
								str += "<div class='contenttool link'>" + obj.Name + " (@" + obj.Username + ")<br>";
								str += "<br>" + obj.NumFollowers+ " (" + obj.isFollowed + ") ";
								str += "</div></div>"
								res.send(str);
							}
						});
					});
				}
			});
		}
	}
	else
		res.send("Error, not in session");
	
});

function getPercentChanges(StockFollowing, x, res, avgarr, obj, parallelarray){
	if (StockFollowing.length -1 < x) {
		var sumper = 0;
		for (var x =0; x < avgarr.length; x++) {
			var sum = 0;
			for (var y = 0; y < avgarr[x].PercentChanges.length; y++) {
				sum += avgarr[x].PercentChanges[y];
			}
			sumper += sum /avgarr[x].PercentChanges.length;
		}
		sumper = sumper/avgarr.length;
		obj.StockFollowing = (sumper * 100).toFixed(2);
		obj.Points = parseInt(obj.Points);
		if (isNaN(obj.Points) )
			obj.Points = 0;
		if (isNaN(obj.StockFollowing) )
			obj.StockFollowing = 0;
		var str = "<div class='mainspantool'><img class='imagetool' src='" + obj.Thumbnail + "'>";
		str += "<div class='contenttool link'>" + obj.Name + " (@" + obj.Username + ")<br>";
		str += obj.Followers + "<br>" + obj.StockFollowing + "% overall returns <br>" + obj.Points + " points";
		str += "</div></div>"
		res.send(str);
	}
	else {
		var tempobj = StockFollowing[x];
		if(parallelarray.indexOf(tempobj.CompanyUsername) == -1) {
			var objtemp = {
				CompanyUsername: tempobj.CompanyUsername,
				PercentChanges: []
			};
			parallelarray.push(tempobj.CompanyUsername);
			avgarr.push(objtemp)
		}
		if (tempobj.StockEnd != null && parseInt(tempobj.StockEnd) != -1) {
			percentstockchange = ((tempobj.StockEnd - tempobj.StockStart)/(tempobj.StockStart));
			avgarr[parallelarray.indexOf(tempobj.CompanyUsername)].PercentChanges.push(percentstockchange);
			getPercentChanges(StockFollowing, x+1, res, avgarr, obj, parallelarray);
		}
		else if (parseInt(tempobj.StockEnd) == -1) {
			yahooFinance.snapshot({
				symbol: tempobj.CompanyUsername
			}, function (err, snapshot2) {
				if (snapshot2 != null) {
				percentstockchange = ((snapshot2.lastTradePriceOnly - tempobj.StockStart)/(tempobj.StockStart));
				avgarr[parallelarray.indexOf(tempobj.CompanyUsername)].PercentChanges.push(percentstockchange);
				}
				getPercentChanges(StockFollowing, x+1, res, avgarr, obj, parallelarray);
			});
		}
	}
}




module.exports = router;
