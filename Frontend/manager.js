		function getLocalhost() {
			//return "http://localhost:3000";
		//return "https://inqora2.herokuapp.com"
			return "http://27171590.ngrok.com";
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
$(".fixedtop").css("top", $("#navsearchmainsearch").height() + "px");
$(window).resize(function(){
	$(".fixedtop").css("top", $("#navsearchmainsearch").height() + "px");
});

callAJAX ("GET", "/accounts/isverified", {}, function (data) {
	if (data == "N") {
		$("#verifyemailbar").show();
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
	callAJAX ("POST", "/users/authenticate", {User: $("#username-modal-window").val(), Password:$("#password-modal-window").val()}, function (data) {
		if (data == "Successfully authenticated")
			window.location.replace(window.location.href);
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
