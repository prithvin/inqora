function loginandstuff () {

$.ajax ({
	type: "GET",
	url: getLocalhost() + "/accounts/issess",
	data: {},
	success: function (data) {
		$.getScript("cordova.js");

		var name = location.protocol + '//' + location.host + location.pathname;
		var index = name.lastIndexOf("/") + 1;
		var filename = name.substr(index);
		if (filename == "" || filename == "login.html" || filename == "createaccount.html");
		else if (data == "true")  {
			semiProp();
		}
		else if (data == "false") {
			callAJAX ("POST", "/users/authenticate", {User: "demo", Password:"demo"}, function (data) {
				semiProp();
				disableLinks();
				if (filename != "blog.html")
					$("#notloggedin").show();
			});
			
		}
		else if (data == "demo") {
			semiProp();
			disableLinks();
			if (filename != "blog.html")
					$("#notloggedin").show();
		}
	},
	xhrFields: {withCredentials: true},
	error:function(){
		console.log("ERROR");
	}
})
}
function semiProp () {
	getUserData();
	getNotifsLOOOOOOL(true);
		proper();
window.setInterval(function () {
	if ($("#menu").css("display") == "none") {
		getNotifsLOOOOOOL(false)
	}
}, 3000);

	//proper();
}




console.log("\n\n\nHey there! We could really use your help in developing the Inqora community. \nIf you see any bugs, please contact narasimhan.prithvi@gmail.com.\nHope you are enjoying Inqora as much as we enjoyed building it! Keep investing!! #inqora ")
		function getLocalhost() {
			//return "http://localhost:3000";
			//return "https://inqora2.herokuapp.com"
			return inqoraPage()
		}
		function inqoraPage () {
			if (window.location.href.indexOf("https") != -1)
				return "https://inqora.com/api";
			else
				return "https://inqora.com/api";
		}
function callAJAX (mytype, url, datastruct, callback) {
	$.ajax({
		type: mytype,
		url: getLocalhost() + url,
		data: datastruct,
		success: callback,
		xhrFields: {withCredentials: true},
		error:function(){
			console.log("ERROR");
		}
	});
}

$(document).on("click" , ".directtotype", function (ev) {
	ev.preventDefault();
	alert("One moment please...");
	runFile($(this).html());
});

function runFile (user) {
		var user = user.substring(1);
		$.ajax({
			type: "GET",
			url: getLocalhost() + "/companygroup/getType",
			data: {
				Username: user
			},
			success:function(data) {
				if (data.toString().toLowerCase() == "user") 
					window.location.assign("userpage.html?id=" + user);
				else if (data.toString().toLowerCase() == "company")
					window.location.assign("companypage.html?id=" + user);
				else if (data.toString().toLowerCase() == "group")
					window.location.assign("grouppage.html?id=" + user);
				else 
					window.history.back();
			},
			xhrFields: {withCredentials: true},
			error:function(){
				console.log("ERROR");
			}
		});
	}


$(".fixedtop").css("top", $("#navsearchmainsearch").height() + "px");
if ($("#messages").length != 0 && $("#messages").offset() != null)
	$("#messages").css("height",  Math.min(document.documentElement.clientHeight, window.innerHeight || 0) - $("#messages").offset().top - $("#messager").height() - 50);
$(window).resize(function(){
	$(".fixedtop").css("top", $("#navsearchmainsearch").height() + "px");
	if( isBreakpoint('xs') ) {
		$(".fixedtop").css("position", "relative");
	}
	else {
		$(".fixedtop").css("position", "absolute");
	}
	if ($("#messages").length != 0)
		$("#messages").css("height",  Math.min(document.documentElement.clientHeight, window.innerHeight || 0) - $("#messages").offset().top - $("#messager").height() - 50);
});

function isBreakpoint( alias ) {
    return $('.device-' + alias).is(':visible');
}

callAJAX ("GET", "/users/getuser", {}, function (data) {
	$("#myprof").attr("href", "userpage.html?id=" + data);	
	if (window.location.pathname.indexOf("userpage") != -1 && getQueryVariable("id") == data) {
			$("#subscribe").css("display", "none");
			$("#messageuser").css("display", "none");
	}
});


callAJAX ("GET", "/accounts/isverified", {}, function (data) {
	if (data == "N") {
		$("#verifyemailbar").css("display", "inline-block");
	}
});

$("#verifyemailbar").on("click", function (ev) {
	ev.preventDefault();
	callAJAX("POST", "/users/resendverification", {}, function (data) {
		if (data == "Success") {
			alert("Please check your email for further instructions.");
		}
	});
});

//

function msToTime(duration) {
	var minutes = parseInt((duration/(1000*60))%60)
	, hours = parseInt((duration/(1000*60*60)));
	hours = (hours < 10) ?  hours : hours;
	minutes = (minutes < 10) ? minutes : minutes;
	if (hours < 24)
		return hours + " hours and " + minutes + " minutes ago";
	else if (hours < 48)
		return parseInt(hours/24) + " day and " + hours%24 + " hours ago";
	else
		return parseInt(hours/24) + " days and " + hours%24 + " hours ago";
}
function setImage (image, maindiv, callback) {
	$.ajax({
	    type: "GET",
	    url: getLocalhost() + "/companygroup/getThumbnail",
	    data: {
	      Username: $(image).attr("name")
	    },
	    success: function (data) {
	      $(image).attr("src", data);
	      if (callback != null) {
	      	callback(maindiv, image);
	      }
	    },
	    xhrFields: {withCredentials: true},
	    error:function(){
	      console.log("ERROR");
	    }
	  });
}

function disableLinks () {
	$(document).one("click", function (event){ 
		event.preventDefault();
		$("#loginmodalbutton").click();
	});
}
$('#loginmodal').on('hidden.bs.modal', function () {
	disableLinks();
})
$('#loginform-modal-window').on('submit', function (ev) {
	ev.preventDefault();
	console.log("Signing in");
	callAJAX ("POST", "/users/authenticate", {User: $("#username-modal-window").val(), Password:$("#password-modal-window").val()}, function (data) {
		if (data == "Successfully authenticated") {
			if (window.location.href.indexOf("login.html") != -1 || window.location.href.indexOf("index.html") != -1)
				window.location = "newsfeed.html";
			else 
				window.location.replace(window.location.href);
		}
		else
			alert(data);
	});
});

var neccbutton = document.createElement("p");
neccbutton.className = "content";
(document.getElementsByTagName('body')[0]).appendChild(neccbutton);

function alert (message) {
	timeout = setTimeout(function () {removeBar() }, 4000);
	var _message_span = $(document.createElement('span')).addClass('jbar-content').html(message);
	_message_span.css({"color" : "#1E90FF"});
	var _wrap_bar;
	_wrap_bar	  = $(document.createElement('div')).addClass('jbar jbar-top') ;
	_wrap_bar.css({"background-color" 	: "#FFFFFF"});
	if(false){
		var _remove_cross = $(document.createElement('a')).addClass('jbar-cross');
		_remove_cross.click(function () {removeBar() })
	}
	else{				
		_wrap_bar.css({"cursor"	: "pointer"});
		_wrap_bar.click(function () {removeBar() })
	}	
	_wrap_bar.append(_message_span).append(_remove_cross).hide().insertBefore($('.content')).fadeIn('fast');
}

function removeBar() {
	if($('.jbar').length){
		clearTimeout(timeout);
		$('.jbar').fadeOut('fast',function(){
			$(this).remove();
		});
	}
}

function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
	}


function postButton () {
	$('#postingsystemdiv').removeClass('hidden-xs');$('#postingsystemdiv').addClass('col-xs-12');$('#mydatapanel').addClass('hidden-xs');$('#mydatapanel').removeClass('col-xs-12');
}

$(document).ready(function () {  
  var top = 0;
  $(window).scroll(function (event) {
    // what the y position of the scroll is
    var y = $(this).scrollTop();
  
    // whether that's below the form
    if ($(window).scrollTop() <= 0) 
    	 $('#navsearchmainsearch').removeClass('extrafluff').addClass("regularfluff");
   else  if (y >= top) {
      // if so, ad the fixed class
      $('#navsearchmainsearch').addClass('extrafluff', 1000, "easeInOutQuad" ).removeClass("regularfluff");
    } else {
      // otherwise remove it
      $('#navsearchmainsearch').removeClass('extrafluff').addClass("regularfluff");
    }
  });
});
