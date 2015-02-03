var express = require('express');
var router = express.Router();
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:7888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
var yahooFinance = require('yahoo-finance');


function isSess (req) {
    if (req.session.UserId == null)
        return false;
    else if(req.session.UserId.length > 2)
        return true;
    else
        return false;
}

router.get("/buycompany", function (req, res) {
	if (isSess(req)) {
		var companyname = req.query.CompanyUsername;
		console.log(req.query.CompanyUsername);
		companies.findOne({UserId: companyname}, "Name", function (err, data) {
			if (data == null)
				res.send("Error. Company does not exist");
			else {
				users.findOne({_id: req.session.UserId}, function (err, data2) {
					if (data2 == null)
						res.send("Error. This user does not exist");
					else {
						var obj = {
							CompanyName: data.Name,
							CompanyUsername: companyname,
							FollowingDate: (new Date).getTime(),
							EndDate: -1,
							StockStart: 0,
							StockEnd: -1
						};
						stockdata = data2.StockFollowing;
						var done = false;
						console.log(stockdata);
						if (stockdata != null) {
							for (var x =0 ; x < stockdata.length; x++) {
								console.log("StockData" + stockdata[x].CompanyUsername);
								console.log("LOL" + companyname);
								console.log("HAHAH" + stockdata[x].StockEnd);
								if (stockdata[x].CompanyUsername == companyname && stockdata[x].StockEnd == -1) {
									done = true;
								}
							}
						}
						if (done == false) {
							yahooFinance.snapshot({symbol: companyname}, function (err, snapshot) {
								console.log(companyname);
								if (snapshot == null)
									res.send("Error. TKGL");
								else {
									obj.StockStart = snapshot.lastTradePriceOnly;
									users.update({_id : req.session.UserId}, {$push: {StockFollowing: obj}}, function (err,up) {console.log(up);});
									res.send(obj);
								}
							});
						}
						else {
							res.send("Error. Already own stock");
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

router.get('/companydata', function (req, res) {
	var companyusername = req.query.CompanyUsername;
	if (isSess(req)) {
		users.findOne({_id: req.session.UserId}, function (err, data) {
			if (data == null)
				res.send("Error. This user does not exist");
			else {
				var stockdata = data.StockFollowing;
				var arr = [];
				for (var x =0 ; x < stockdata.length; x++) {
					if (stockdata[x].CompanyUsername == companyusername) {
						arr.push(stockdata[x]);
					}
				}
				checkAndSendStocks(arr, 0, companyusername, res);
			}
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

function checkAndSendStocks (arr, x, companyusername, res) {
	if (x < arr.length) {
		if (arr[x].StockEnd == -1) { // Stock not sold
			yahooFinance.snapshot({symbol: companyusername}, function (err, snapshot) {
				if (snapshot == null)
					res.send("TKGL");
				else {
					arr[x].CurrentPrice = snapshot.lastTradePriceOnly;
					checkAndSendStocks(arr, x+1, companyusername, res);
				}
			});
		}
		else {
			checkAndSendStocks(arr, x+1,companyusername, res);
		}
	}
	else {
		res.send(arr);
	}
}

router.get('/sellcompany', function (req, res) {
	var companyusername = req.query.CompanyUsername;
	if (isSess(req)) {
		users.findOne({_id: req.session.UserId}, function (err, data) {
			if (data == null)
				res.send("Error. This user does not exist");
			else {
				var arr = data.StockFollowing;
				yahooFinance.snapshot({symbol: companyusername}, function (err, snapshot) {
					if (snapshot == null)
						res.send("Error TKGL");
					else {
						var done = false;
						for (var x =0 ; x < arr.length; x++) {
							if (arr[x].CompanyUsername == companyusername && arr[x].StockEnd == -1) {
								done = true;
								arr[x].EndDate =  (new Date).getTime();
								arr[x].StockEnd = snapshot.lastTradePriceOnly;
								users.update({_id : req.session.UserId}, {$set: {StockFollowing: arr}}, function (err,up) {console.log(up);});
								res.send("Success");
							}
						}
						if (done == false)
							res.send("Error No stock found to update");
					}
				});
			}
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.get('/isOwnedNow', function(req, res){
	var companyusername = req.query.CompanyUsername;
	if (isSess(req)) {
		users.findOne({_id: req.session.UserId}, function (err, data) {
			if (data == null)
				res.send("Error. This user does not exist");
			else {
				var stockdata = data.StockFollowing;
				var done = false;
				for (var x =0 ; x < stockdata.length; x++) {
					if (stockdata[x].CompanyUsername == companyusername && stockdata[x].StockEnd == -1) {
						done = true;
						res.send("Yes");
					}
				}
				if (done == false)
					res.send("No");
			}
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.get('/allcompanydata', function (req, res) {
	var username = "aqeasfsdfasdfasdfasdfasdfasdfasdfsadfasdfasdfasdfasdfasdf";
	console.log(req.query.Username);
	if (req.query.Username != null && req.query.Username != "") {
		username = req.query.Username;
		console.log("HEYHEYHEY");
	}
	if(isSess(req)) {
		users.findOne({$or: [{_id: req.session.UserId}, {"Username" : username}]}, function (err, data) {
			if (data == null)
				res.send("Error. This user does not exist");
			else {
				var stockdata = data.StockFollowing;
				var arr = [];
				for (var x =0 ; x < stockdata.length; x++) {
					arr.push(stockdata[x]);
				}
				checkAndSendStocksAllCompanies(arr, 0, res);
			}
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

function checkAndSendStocksAllCompanies (arr, x, res) {
	if (x < arr.length) {
		arr[x].CurrentPrice = -1;
		if (arr[x].StockEnd == -1) { // Stock not sold
			yahooFinance.snapshot({symbol: arr[x].CompanyUsername}, function (err, snapshot) {
				if (snapshot == null)
					res.send("TKGL");
				else {
					arr[x].CurrentPrice = snapshot.lastTradePriceOnly;
					checkAndSendStocksAllCompanies(arr, x+1, res);
				}
			});
		}
		else {
			checkAndSendStocksAllCompanies(arr, x+1, res);
		}
	}
	else {
		var obj = [];
		var parallelobj = [];
		for (var x =0; x < arr.length; x++) {
			if (parallelobj.indexOf((arr[x].CompanyUsername)) == -1) {
				parallelobj.push(arr[x].CompanyUsername);
				var newobj = {
					CompanyName: arr[x].CompanyName,
					CompanyUsername: arr[x].CompanyUsername,
					RestData: []
				};
				var tinyobj = {
					FollowingDate: arr[x].FollowingDate,
					EndDate: arr[x].EndDate,
					StockStart: arr[x].StockStart,
					StockEnd: arr[x].StockEnd,
					CurrentPrice: arr[x].CurrentPrice
				};
				newobj.RestData.push(tinyobj);
				obj.push(newobj);
			}
			else {
				var tinyobj = {
					FollowingDate: arr[x].FollowingDate,
					EndDate: arr[x].EndDate,
					StockStart: arr[x].StockStart,
					StockEnd: arr[x].StockEnd,
					CurrentPrice: arr[x].CurrentPrice
				};
				obj[parallelobj.indexOf((arr[x].CompanyUsername))].RestData.push(tinyobj);
			}
		}
		console.log(obj);
		res.send(obj);
	}
}


module.exports = router;