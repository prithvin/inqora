var express = require('express');
var router = express.Router();
var yahooFinance = require('yahoo-finance');
var base64 = require('base-64');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

function isSess (req) {
    if (req.session.UserId == null)
        return false;
    else if(req.session.UserId.length > 2)
        return true;
    else
        return false;
}


router.get('/getCompsGroupsNewPost', function(req,res) {
	if (isSess(req)) {
		searchresmod.find({"Type" : "Company"}, "Picture Name UserId Industry", function(err,results) {
			if (results == null)
				res.send("Error. Unable to fetch results.");
			else {
				var arr = results.slice(0);
				for (var x =0 ; x< arr.length;x ++) 
					arr[x]['id'] = x;
				res.send(arr);
			}
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.post('/updatePic', function (req, res) {
	if (isSess(req)) {
		searchresmod.find({'_id': req.body.postid}, function (err, results) {
			if (results != null)
				searchresmod.update({'_id': req.body.postid} , {$set: {Picture: req.body.URL}}, function (err, up){res.send(up + "good");});
			else 
				res.send("Erorr. Company or group not found");
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.post('/updateThumbnail', function (req, res) {
	if (isSess(req)) {
		searchresmod.find({'_id': req.body.postid}, function (err, results) {
			if (results != null)
				searchresmod.update({'_id': req.body.postid} , {$set: {Thumbnail: req.body.URL}}, function (err, up){res.send(up + "good");});
			else 
				res.send("Erorr. Company or group not found");
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.get('/getSearch', function(req,res) {
		var arr = [];
		searchresmod.find({}, "Name Type UserId Username", function(err,results) {
			for (var x = 0; x < results.length; x++) {
				var temp = {};
				temp.id = x;
				temp.Type = results[x].Type;
				temp.Name = results[x].Name;
				if (temp.Type == "Company" || temp.Type == "Group")
					temp.Username = results[x].UserId;
				else if (temp.Type == "User") 
					temp.Username = results[x].Username;
				arr.push(temp);
			}
			res.send(arr);
		});

});

router.get('/getType', function(req,res) {
	var newsub = req.query.Username;
	searchresmod.findOne({$or: [{'Username' : newsub},{'UserId' : newsub}]}, "Type UserId Username", function(err,results) {
		if (results == null) 
			res.send("ERROR");
		else
		res.send(results.Type);
	});
});

router.get('/getThumbnail' ,function (req, res) {
	if (isSess(req)) {
		searchresmod.findOne({ $or: [{'Username' : req.query.Username}, {'UserId' : req.query.Username}]}, 'Thumbnail', function (err, rez) {
			if (rez == null)
				res.send("Error");
			else 
				res.send(rez.Thumbnail);
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.get('/getThumbnailAct' ,function (req, res) {
	if (isSess(req)) {
		searchresmod.findOne({ $or: [{'Username' : req.query.Username}, {'UserId' : req.query.Username}]}, 'Thumbnail', function (err, data) {
			if (data == null || data.Thumbnail == null)
				res.send("Error");
			else {
				if (data.Thumbnail.indexOf("http") != -1) {
					res.send(data.Thumbnail);
				}
				else {
					var contenttype =  data.Thumbnail.substring(data.Thumbnail.indexOf("data:") + 5, data.Thumbnail.indexOf(";base64"));
					if (contenttype.toLowerCase().indexOf("image") == -1)
						contenttype = "image";
					res.writeHead(200, {
				    	'Content-Type': contenttype
				  	});
					var bar = new Buffer(data.Thumbnail.substring(data.Thumbnail.indexOf(";base64,") + 8), 'base64');
					res.end(bar);
				}
			}
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.post('/group/create', function(req, res) {
	var newuser = new groups ({
		Type: "Group",
		Name: req.body.Name,
		UserId: req.body.UserID.toUpperCase(),
		Description: req.body.Description,
		Picture: req.body.Picture,
		Thumbnail: req.body.Thumbnail,
		Industry: req.body.Industry,
		NumFollowers: 0,
		NumOwnStock: 0
	});
	newuser.pre("save", function(next) {
		groups.findOne({UserId: req.body.UserID.toUpperCase()}, function (err,results) {
			if  (results) 
				res.send("Unique User ID already in use");
			else
				next();
		});
	});
	newuser.save(function (err) {
		if (err)
			return res.send(error.message);
		return res.send("Account successfully created")
	});
});

router.post('/company/create', function(req, res) {
	var newuser = new companies ({
		Type: "Company",
		Name: req.body.Name,
		UserId: req.body.UserID.toUpperCase(),
		Description: req.body.Description,
		Picture: req.body.Picture,
		Thumbnail: req.body.Thumbnail,
		Industry: req.body.Industry,
		NumFollowers: 0,
		NumOwnStock: 0
	});
	newuser.pre("save", function(next) {
		companies.findOne({UserId: req.body.UserID.toUpperCase()}, function (err,results) {
			if  (results) 
				res.send("Unique User ID already in use");
			else
				next();
		});
	});
	newuser.save(function (err) {
		if (err)
			return res.send(error.message);
		return res.send("Account successfully created")
	});
});


//data.Subscribed (true or false)


router.get('/group/get/:username', function(req,res) {
	var username = req.params.username;
	groups.findOne({UserId : username}, function(err, result) {
		if (result == null)
			res.send("Error. Company does not exist");
		else {
			var obj = {
				Name: result.Name,
				Username: result.UserId,
				Description: result.Description,
				Picture: result.Picture,
				NumFollowers: result.NumFollowers,
				Subscribed: false
			};
			users.findOne({_id: req.session.UserId}, "FollowingAccs", function (err, data) {
				if (data == null)
					res.send("Error. Not in session");
				else {
					if (data.FollowingAccs.Groups != null && data.FollowingAccs.Groups.indexOf(username) != -1 )
						obj.Subscribed = true;
					res.send(obj);
				}
			});
		}
	});

});


router.get('/company/get/:stock', function(req,res) {
	companies.findOne({UserId : req.params.stock}, function(err, result) {
		if (result == null)
			res.send("Error. Company does not exist");
		else {
			var obj = {
				Name: result.Name,
				Ticker: result.UserId,
				Description: result.Description,
				Picture: result.Picture,
				Industry: result.Industry,
				NumFollowers: result.NumFollowers,
				NumOwnStock: result.NumOwnStock,
				PreviousClose: 0,
				Open:0,
				PricePerBook: 0,
				PEGRatio: 0,
				PERatio: 0,
				PricePerSales: 0,
				DividendYield:0,
				MarketCap:0,
				StockPrice:0,
				ChangeThing: 0,
				Subscribed: false,
				OwnPortfolio: false,
				PercentChangeIfOwnVirtualPortfolio: 0
			};
			users.findOne({_id: req.session.UserId}, "FollowingAccs StockFollowing", function (err, data) {
				if (data == null)
					res.send("Error. Not in session");
				else {
					yahooFinance.snapshot({symbol: req.params.stock}, function (err, snapshot) {
						if (snapshot == null)
							res.send("TKGL");
						else {
							obj.PreviousClose = snapshot.previousClose;
							obj.Open = snapshot.open;
							obj.PricePerBook = snapshot.pricePerBook;
							obj.PEGRatio = snapshot.pegRatio;
							obj.PERatio = snapshot.peRatio;
							obj.PricePerSales = snapshot.pricePerSales;
							obj.DividendYield = snapshot.dividendYield;
							obj.MarketCap = snapshot.marketCapitalization;
							obj.StockPrice = snapshot.lastTradePriceOnly;
							obj.ChangeThing = snapshot.change.toFixed(2) + "(" + (snapshot.changeInPercent *100).toFixed(2) + "%)";
						}
						if (data.FollowingAccs.Companies != null && data.FollowingAccs.Companies.indexOf(req.params.stock) != -1 )
							obj.Subscribed = true;
						stockdata = data.StockFollowing;
						if (stockdata != null) {
							for (var x =0 ; x < stockdata.length; x++) {
								if (stockdata[x].CompanyUsername == req.params.stock && stockdata[x].StockEnd == -1) {
									obj.OwnPortfolio = true;
									obj.PercentChangeIfOwnVirtualPortfolio = (snapshot.lastTradePriceOnly - stockdata[x].StockStart)/ (stockdata[x].StockStart);
								}
							}
						}
						res.send(obj);
					});
				}
			});
		}
	});

});

module.exports = router;
