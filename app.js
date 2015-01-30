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



mongoose.connect('mongodb://inqora:inqora@alcatraz.0.mongolayer.com:10033,alcatraz.1.mongolayer.com:10033/InqoraDB');
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
        LastCalculated: Number,
        NumPoints: Number
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
        TaggedInComment: []
    },
    Messaging: []
});
users = mongoose.model('User', usersch, 'users');

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
companies = mongoose.model('Company', company, 'users');

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
groups = mongoose.model('Group', group, 'users');

searchres = new Schema ({
    Type: String,
    Name: String,
    UserId: String,
    Picture: String,
    Thumbnail: String,
    Username: String
});
searchresmod = mongoose.model('Search', searchres, 'users');


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
posts = mongoose.model('Post', post, 'posts');


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(cors());
app.use(compression())
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "randomasssecretpassword",
    name: "muellerappcookie",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin',      "*");
    res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin');
    next();
  });

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



app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
      //res.header('Access-Control-Allow-Origin', 'https://www.inqora.com');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
     res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin');
    next();
  });

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin',      "*");
         res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
           res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        next();
};
app.use(allowCrossDomain);




http.createServer(app).listen(app.get('port'), function(){
    console.log("The Inqora backend has started on on port " + app.get('port'));
});


module.exports = app;
