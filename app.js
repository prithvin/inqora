path = require('path');
logger = require('morgan');
cookieParser = require('cookie-parser');
bodyParser = require('body-parser');
emailjs = require('emailjs');

var routes = require('./routes/index');
var userpage = require('./routes/users');
var postingsys = require('./routes/posting');
var postfeeds = require('./routes/loadingpostfeeds');
var subs = require('./routes/subscriptions');
var messaging = require('./routes/messaging');
var stockgame = require('./routes/stockgame');
var accounts = require('./routes/accounts');
var marketing = require('./routes/marketing');
var automate = require('./routes/automate')
var companygroup = require('./routes/companygroup');

cors = require('cors'); 
http = require('http');
compression = require('compression');
methodOverride = require("method-override")
express = require('express');
mongoose = require('mongoose');
session = require('express-session');
router = express.Router();


var app = express();

email = require('emailjs');
server  = email.server.connect({
    user: "prithvi@inqora.com",
    password:"earth2412",
   host:    "mail.inqora.com",
   port:26
});



//mongodump --host alcatraz.0.mongolayer.com:10033 --db InqoraDB -u inqora -pinqora -o /var/lib/mongodb
//mongoose.connect('mongodb://inqora:inqora@alcatraz.0.mongolayer.com:10033,alcatraz.1.mongolayer.com:10033/InqoraDB');
mongoose.connect('mongodb://104.131.30.72:27017/InqoraDB');
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {});
var Schema = mongoose.Schema;

usersch = new Schema ({
    Type: String,
    Name: String,
    Email: String,
    Username: String,
    Password: String,
    Verified: Boolean,
    FollowingAccs: {
        Users: [],
        Companies: [],
        Groups: []
    },
    Points: {
        NumPoints: Number,
        BonusPoints: Number,
        NumPointsRedeemed: Number,
        DatesRedeemed: []
        // 
        //    [
        //        {
        //            DateRedeemed:
        //            PointsRedeemed: 
        //        }
        //    ]
    },
    InvitesUsed: Number, 
    StockFollowing: [],
    Thumbnail: String,
    Picture: String,
    Followers: [],
    Notifications: {
        WhoJoined: [],
        NewFollowers: [],
        TaggedInPost: [],
        TaggedInComment: [],
        PostUserCommentedOrPosted: []
    },
    Messaging: [],
    MessagingSystem: {}
});
users = mongoose.model('User', usersch, 'usercol');

emailschema = new Schema ({
    Email: []
});
// Date of signup and actual email
emailmodal = mongoose.model('Email', emailschema, 'email');
//54c9b5b664617400a4030000


company = new Schema ({
    Type: String,
    Name: String,
    Thumbnail: String,
    UserId: String,
    Description: String,
    Picture: String,
    Industry: String,
    NumFollowers: Number,
    NumOwnStock: Number
});
companies = mongoose.model('Company', company, 'usercol');

group = new Schema ({
    Type: String,
    Thumbnail: String,
    Name: String,
    UserId: String,
    Description: String,
    Picture: String,
    Industry: String,
    NumFollowers: Number,
    NumOwnStock: Number
});
groups = mongoose.model('Group', group, 'usercol');

searchres = new Schema ({
    Type: String,
    Name: String,
    UserId: String,
    Picture: String,
    Thumbnail: String,
    Username: String
});
searchresmod = mongoose.model('Search', searchres, 'usercol');


post = new Schema ({
    Title: String,
    Content: String,
    PosterId: String,
    PosterUsername: String,
    PosterName: String,
    Tags: [],
    Votes: {
        WhoDownvoted: [],
        WhoUpvoted: []
    },
    Time: Number,
    Comments: [{
      Creator: String,
      CreatorUsername: String,
      CreatorName: String,
      Votes: {
        WhoUpvoted: [],
        WhoDownvoted: []
      },
      Time: Number,
      TagsDetected: [ ],
      Content: String
    }]
});
posts = mongoose.model('Post', post, 'postcol');


// Development 

app.all('*',  function (req, res, next) {
    if (req.headers.origin == null);
    else if (req.headers.origin.indexOf("localhost") != -1) 
         res.setHeader('Access-Control-Allow-Origin', 'http://localhost:7888');
     else if (req.headers.origin.indexOf("104.131.30.72") != -1) {
        if (req.headers.origin.indexOf("https") !=-1) 
            res.setHeader('Access-Control-Allow-Origin', 'https://104.131.30.72');
        else if (req.headers.origin.indexOf("http") != -1) 
            res.setHeader('Access-Control-Allow-Origin', 'http://104.131.30.72');
        
     }
    else if (req.headers.origin.indexOf("ngrok") != -1) 
         res.setHeader('Access-Control-Allow-Origin', 'http://5eeff2d4.ngrok.com');
    else if (req.headers.origin.indexOf("https") > -1 && req.headers.origin.indexOf("www") > -1)
        res.setHeader('Access-Control-Allow-Origin', 'https://www.inqora.com');
    else if (req.headers.origin.indexOf("https") > -1)
        res.setHeader('Access-Control-Allow-Origin', 'https://inqora.com');
    else if (req.headers.origin.indexOf("http") > -1 && req.headers.origin.indexOf("www") > -1)
        res.setHeader('Access-Control-Allow-Origin', 'http://www.inqora.com');
    else if (req.headers.origin.indexOf("http") > -1)
        res.setHeader('Access-Control-Allow-Origin', 'http://inqora.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(session({
    secret: "randomasssecretpassword",
    name: "muellerappcookie",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));


//Production
 /*
RedisStore = require('connect-redis')(session);
app.use(express.session({
  cookie: {
    httpOnly: false 
  },
  store: new RedisStore({
    host: 'greeneye.redistogo.com',
    port: 11374,
    pass:'3fb77c607f5079dc567ffd934f93b46b'
  }),
  secret: '1234567890QWERTY',
  saveUninitialized: false,
  resave:false
}));
*/
 

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(compression())
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', userpage);
app.use('/posting', postingsys);
app.use('/loadingpostfeeds', postfeeds);
app.use('/subscriptions', subs);
app.use('/messaging', messaging);
app.use('/stockgame', stockgame);
app.use('/accounts', accounts);
app.use('/companygroup', companygroup);
app.use('/marketing', marketing);
app.use('/automate', automate);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.send("Error 404: This API does not exist. Please review the documentation.")
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log('error', {
        message: err.message,
        error: {}
    });
});







http.createServer(app).listen(app.get('port'), function(){
    console.log("The Inqora backend has started on on port " + app.get('port'));
});


module.exports = app;
