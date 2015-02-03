var express = require('express');
var router = express.Router();

var xss = require('xss');


function isSess (req) {
    if (req.session.UserId == null)
        return false;
    else if(req.session.UserId.length > 2)
        return true;
    else
        return false;
}


router.get('/getinbox', function (req, res) {
	users.findOne({_id: req.session.UserId}, "Messaging" , function(err, user) {
		if (user == null)
			res.send("Invalid session");
		else  {
			var datatosend = [];
			for (var x =0; x < user.Messaging.length; x++) {
				var obj = {
					'Name' : user.Messaging[x].PartnerName,
					'Username' : user.Messaging[x].PartnerId,
					'New' : user.Messaging[x].New,
					'Time' : user.Messaging[x].Chat[user.Messaging[x].Chat.length - 1].Time
				}
				datatosend.push(obj);
				console.log(obj);
			}
			res.send(datatosend);
		}
	});
});

router.get('/getbyusername', function (req,res) {
	var username = req.query.Username;
	users.findOne({_id: req.session.UserId}, function(err, user) {
		if (user == null)
			res.send("Invalid session");
		else {
			var messages = user.Messaging;
			var liveData = [];
			for( var x =0; x < messages.length; x++ ){
		   	 	if(messages[x].PartnerId == username) {
		        	res.send(messages[x]);
		    	}
			}
		}
	});
});

router.get('/makeold', function (req, res) {
	var otherperson = req.body.Username;
	users.findOne({_id: req.session.UserId}, function (err, user) {
		if (user == null) 
			res.send("Invalid session");
		else {
			messages = user.Messaging;
			var index = getIndex(otherperson, messages);
			if (index == -1) {
				res.send("You never messaged this user before");
			}
			else {
				res.send("Success");
				messages[index].New = false;
				users.update({'_id': req.session.UserId}, {$set: {'Messaging' : messages}}, function (err, up) {console.log(up); });
			}
		}
	});
});
router.post('/new', function (req,res) {
	var otherperson = req.body.Username;
	var message = req.body.Message;
	var messages; 
	users.findOne({_id: req.session.UserId}, function (err, user) {
		if (user == null) 
			res.send("Invalid session");
		else {
			messages = user.Messaging;
			var index = getIndex(otherperson, messages);
			if (index == -1) {
				users.findOne({Username: otherperson} , function (err, otheruser) {
					if (otheruser == null)
						res.send("The user you are trying to commmunicate with is not on the Inqora system. Please try again later");
					else {
						var newthread = {
							PartnerName: otheruser.Name,
							PartnerId: otherperson,
							New: false,
							Chat: [ 
								{
									Message: xss(message),
									ByYou: true,
									Time: (new Date).getTime()
								}
							]
						}
						messages.push(newthread);
						users.update({'_id': req.session.UserId}, {$set: {'Messaging' : messages}}, function (err, up) {console.log(up); });
						newthread.Chat[0].ByYou = false;
						newthread.PartnerName = user.Name;
						newthread.PartnerId = user.Username;
						newthread.New = true;
						var otherpersonmessages = otheruser.Messaging;
						otherpersonmessages.push(newthread);
						users.update({'Username' : otherperson}, {$set: {'Messaging' : otherpersonmessages}}, function (err, up) {console.log(up); });
						res.send("Message Sent. Thanks for starting a conversation and helping the Inqora community!");
					}
				});
			}
			else {
				var newchat = {
					Message: xss(message),
					ByYou: true,
					Time: (new Date).getTime()
				};
				messages[index].New = false;
				messages[index].Chat.push(newchat);
				users.update({'_id': req.session.UserId}, {$set: {'Messaging' : messages}}, function (err, up) {console.log(up); });

				users.findOne({Username: otherperson} , function (err, otheruser) {
					if (otheruser == null)
						res.send("The user you are trying to commmunicate with is not on the Inqora system. Please try again later");
					else {
						var otherpersonmessages = otheruser.Messaging;
						var index = getIndex(user.Username, otherpersonmessages);
						var newchat = {
							Message: message,
							ByYou: false
						};
						otherpersonmessages[index].New = true;
						otherpersonmessages[index].Chat.push(newchat);
						users.update({'Username' : otherperson}, {$set: {'Messaging' : otherpersonmessages}}, function (err, up) {console.log(up); });
						res.send("Message Sent");
					}
				});
			}
		}
	});
});



function getIndex (otherperson, messages) {
	for( var items = 0; items < messages.length; items++){
		if (messages[items].PartnerId == otherperson) 
			return items;
	}
	return -1;
}








function ContainsKeyValue( obj, key, value ){
    if( obj[key] === value ) return true;
    for( all in obj )
    {
        if( obj[all] != null && obj[all][key] === value ){
            return true;
        }
        if( typeof obj[all] == "object" && obj[all]!= null ){
            var found = ContainsKeyValue( obj[all], key, value );
            if( found == true ) return true;
        }
    }
    return false;
}


module.exports = router;
