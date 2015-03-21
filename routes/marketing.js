
var express = require('express');
var router = express.Router();


function emailsend (messagebody, messageattachment, toname, toemail, subject) {
	var mailOptions = {
    from: 'Prithvi Narasimhan <prithvi@inqora.com>', // sender address
    to: toname + " <" + toemail +  ">", // list of receivers
   	subject: "Thank You for joining Inqora",
    text: "", // plaintext body
    html: messagebody // html body
};
if (subject != null)
	mailOptions.subject = subject;

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info.response);
	    }
	});
}



var webshot = require('webshot');
var fs      = require('fs');



router.post('/webshot', function (req, res) {
	if (req.body.URL == null || req.body.URL.length < 5) {
		res.send("Error");
	}
	else {
	webshot(req.body.URL, function(err, renderStream) {
		 // var file = fs.createWriteStream('yahoo.png', {encoding: 'binary'});
		 console.log(err);
		 if (err != null) {
		 	res.write("Uhoh");
		 	res.end();
		 }
		 else {
		  var chunks = [];
		  renderStream.on('data', function(data) {
		  	 chunks.push(data);
		  //  file.write(data.toString('binary'), 'binary');
		  });
		  renderStream.on('end', function() {
		  	var result = Buffer.concat(chunks); 
               console.log('final result:', result.length);
               res.write("data:image/PNG;base64," + result.toString('base64'));  
               res.end(); 
		  });
		}
	});
}
});



router.get('/user/:Username', function (req, res) {
	users.findOne({Username: req.params.Username}, function (err, data) {
		res.send(data);
	});
});
/* GET users listing. */
router.get('/', function(req, res) {
	  console.log(req.session);
	  req.session.Bob = "HEY";
	  req.session.save();
  res.send('respond with a resource');
});

router.get('/lol', function(req, res) {
	res.send(req.session.Bob);
});

router.get('/newemail', function (req, res) {
	var newemail = req.query.Email;
	emailmodal.find({_id: '54c9b5b664617400a4030000'}, function (err, data2) {
		if (data2 == null)
			res.send("Sorry. We are overloaded with invite requests. Please try again in 5 minutes.");
		else {
			data = data2[0];
			console.log(data2);
			var obj = {
				Address: newemail,
				Time: (new Date).getTime()
			}
			emailmodal.update({_id: '54c9b5b664617400a4030000'}, {$push: {Email: obj}}, function (err, up) {res.send("good");console.log(up);})
			emailsend("", "<p>Hi,</p><p>Welcome to Inqora&#39;s investment community!&nbsp;We hope that with the help of Inqora, you can make better investment decisions through interactions with other investors. Whether you are just starting out or already an expert, Inqora provides&nbsp;a broad spectrum of investment topics.</p><p>Also with our new revolutionary Incentive system, we&nbsp;<strong>pay you</strong>&nbsp;for your insightful contributions to our community!&nbsp;</p><p><a href='http://inqora.com/new.html' target='_blank'>http://inqora.com/new.html </a></p><p>Stay tuned for email updates about Inqora&#39;s progress and the beta release.</p><p>Also stay tuned for our<strong>&nbsp;Amazon gift cards giveaway</strong>!</p><p>-Dale</p>", "", newemail)
		}
	});
});

router.get('/viewemail', function (req, res) {
	var newemail = req.query.Email;
	emailmodal.find({_id: '54c9b5b664617400a4030000'}, function (err, data2) {
		if (data2 == null)
			res.send("Sorry. We are overloaded with invite requests. Please try again in 5 minutes.");
		else {
			res.send(data2[0]);
		}
	});
});

	var request = require('request');

router.get('/image', function (req, res) {
	if (req.query.url.indexOf("data:image/") == 0)
		res.send(req.query.url);
	else {
		loadBase64Image(req.query.url, function (image, prefix) {
			res.send(prefix + image);
			console.log(image + prefix);

		});
	}
});

router.post('/image', function (req, res) {
	if (req.body.url.indexOf("data:image/") == 0)
		res.send(req.body.url);
	else {
		loadBase64Image(req.body.url, function (image, prefix) {
			res.send(prefix + image);
			console.log(image + prefix);

		});
	}
});


var loadBase64Image = function (url, callback) {
    // Required 'request' module


    // Make request to our image url
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            // So as encoding set to null then request body became Buffer object
            var base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
                , image = body.toString('base64');
            if (typeof callback == 'function') {
                callback(image, base64prefix);
            }
        } else {
            throw new Error('Can not download image');
        }
    });
};


extractor = require('unfluff');
var SummaryTool = require('node-summary');


router.get('/lollol', function (req, res) {

	request({
		uri: req.query.url,
	}, function(error, response, body) {
		data = extractor(body);
		SummaryTool.summarize("", data.text, function(err, summary) {
			console.log("HEYHEYHEY");
			if(err) 
				console.log("Something went wrong man!");
			//console.log(data.Title);
			var obj = {
				Summary: summary,
				Title: data.title
			};
			res.send(obj);
			
		});
	});

});

router.get('/summarization', function (req, res) {
	var url = req.query.URL;
	//threshold_lines=2
	request({'url':'http://www.tools4noobs.com/?action=ajax_summarize&theshold=70&min_sentence_length=50&min_word_length=4&url=' + req.query.URL,
        'proxy':'http://www.tools4noobs.com'}, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	       res.send(cleanIt(body));
	    }
	})
});

function cleanIt (string) {
var result = "";
while (string.indexOf("<li>") != -1) {
result += string.substring(string.indexOf("<li>") + 4, string.indexOf("</li>")) +  " ";
string = string.substring(string.indexOf("</li>") + 5);
}
return result.toString().replace(new RegExp("&amp;quot;", 'g') , "'");
}

router.get('/replaceampersand', function (req, res) {
	companies.find({}, function (err, data) {
		for (var x =0; x < data.length; x++) {
			if (data[x].Industry != null && data[x].Industry.indexOf("&amp;") != -1) {
				console.log(data[x].Industry);
				var str = (data[x].Industry.replace(new RegExp("&amp;", 'g') , "and"));
				companies.update({UserId: data[x].UserId}, {$set: {Industry: str}}, function (err, up) {});
			}
			console.log(x);
		}
	});
});
module.exports = router;


