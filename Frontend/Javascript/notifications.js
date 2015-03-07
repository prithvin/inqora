var notifkeeper = $("<div>").css("display", "none").appendTo("#admin").attr("id", "notifkeeper");
var audiocontrols = $("<audio>").appendTo(notifkeeper).attr("id", "audiocontrlonotif").attr("controls", "false");
var source = $("<source>").attr("type", "audio/mpeg").attr("src", "Javascript/notif.mp3").appendTo("#audiocontrlonotif");

function getNotifsLOOOOOOL(calledfirs) {
	callAJAX ("GET", "/users/notifications", {}, function (data) {
		var len = 0;
		$("#menu").html("");

		len += neworOld(true, 0, data, calledfirs);
		neworOld(false, 0, data);
		$("#numnotifs").html(" " + len);
	

	});
}

 (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  function autoFill () {
    FB.api('/me', function(data) {
     	callAJAX ("POST", "/users/authenticate", {User: data.email, FBAuth:data.id}, function (data) {
			if (data == "Successfully authenticated") {
				if (window.location.href.indexOf("login.html") != -1)
					window.location = "newsfeed.html";
				else 
					window.location.replace(window.location.href);
			}
			else
				alert(data);
		});
    });
  }
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '649452745161437',
      cookie     : true,  // enable cookies to allow the server to access the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.2' // use version 2.2
    });
    FB.getLoginStatus(function(response) {
      if (response.status == "connected") {
        callAJAX ("POST", "/users/authenticate", {User: data.email, FBAuth:data.id}, function (data) {
			if (data == "Successfully authenticated") {
				if (window.location.href.indexOf("login.html") != -1)
					window.location = "newsfeed.html";
				else 
					window.location.replace(window.location.href);
			}
			else
				console.log(data);
		});
      }
    });
  };
/*
 Notification.requestPermission(function (perm) {
    if (perm == "granted") {
      var notification = new Notification("<a href='http://www.google.com'>Hello! How are you today?</a>" , {
        dir: "auto",
        lang: "hi",
        icon: "http://api.randomuser.me/0.2/portraits/women/31.jpg",
        
      });
      notification.onshow = function(){
        var self = this;
        setTimeout(function(){
          self.close();
        }, 20000);
      }
       notification.onclick = function () {
       	console.log("HEYHEYHEY");
       }
    }
  })
  */
function createNotif (image, text, link) {
	$("#audiocontrlonotif").get(0).currentTime=0;
$("#audiocontrlonotif").get(0).play();
	Notification.requestPermission(function (perm) {
    if (perm == "granted") {
      var notification = new Notification(text , {
        dir: "auto",
        lang: "hi",
        icon: image,
        
      });
      notification.onshow = function(){
        var self = this;
        setTimeout(function(){
          self.close();
        }, 20000);
      }
       notification.onclick = function () {
       	window.location = link;
       }
    }
  })
}



function neworOld (typer, len, data, calledfirs) {
	if (data.WhoJoined != null) {
		for (var x =0; x < data.WhoJoined.length; x++) {
			if (data.WhoJoined[x].isNew == typer) {
				var img = $("<img>").attr("name", data.WhoJoined[x].Username);
				setImage(img);
				var link = $("<a>").append(img).append(" @" + data.WhoJoined[x].Username + " has accepted your Inqora invite.").attr("href", "userpage.html?id=" + data.WhoJoined[x].Username).appendTo("#menu");
				link.attr("data-type", "WhoJoined").attr("data-notif", JSON.stringify(data.WhoJoined[x])).addClass(typer + "-false");
				if(typer) {len++};
				link.addClass("notif");

				var linkjusttext = $(link).html().substring($(link).html().indexOf("\">") + 2);
				if(typer == true && $("#notifkeeper").html().indexOf(linkjusttext) == -1 && calledfirs != null && calledfirs == false) {
					$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
					$(img).val(linkjusttext).attr("data-href", $(link).attr("href"));
					setImage(img, null, function (maindiv, data) {
						createNotif($(data).attr("src"), $(data).val(), $(data).attr("data-href"));
					});
				}
				if (typer == true  && calledfirs != null  &&  calledfirs == true) {
					$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
				}
			}
		}
	}

	if (data.NewMessages != null && typer == true) {
		for (var x= 0; x < data.NewMessages.length; x++) {
			var img = $("<img>").attr("name", data.NewMessages[x]);
			var link = $("<a>").append(img).append(" @" + data.NewMessages[x] + " messaged you.").appendTo("#menu").attr("name", data.NewMessages[x]).addClass("messagingnotif");
			link.attr("data-type", "NewMessages").attr("data-notif", JSON.stringify(data.NewMessages[x])).addClass(typer + "-false");
			link.attr("href" , "messaging.html?id=" +  data.NewMessages[x]);
			if(typer) {len++};
			link.addClass("notif");

			var linkjusttext = $(link).html().substring($(link).html().indexOf("\">") + 2);
			if(typer == true && $("#notifkeeper").html().indexOf(linkjusttext) == -1 && calledfirs != null && calledfirs == false) {
				$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
				$(img).val(linkjusttext).attr("data-href", $(link).attr("href"));
				setImage(img, null, function (maindiv, data) {
					createNotif($(data).attr("src"), $(data).val(), $(data).attr("data-href"));
				});
			}
			if (typer == true  && calledfirs != null  &&  calledfirs == true) {
				$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
			}
		}
	}
	if (data.NewFollowers != null) {
		for (var x =0; x < data.NewFollowers.length; x++) {
			if (data.NewFollowers[x].isNew == typer) {
				var img = $("<img>").attr("name", data.NewFollowers[x].Username);
				setImage(img);
				var link = $("<a>").append(img).append(" @" + data.NewFollowers[x].Username + " followed you.").attr("href", "userpage.html?id=" + data.NewFollowers[x].Username).appendTo("#menu");
				link.attr("data-type", "NewFollowers").attr("data-notif", JSON.stringify(data.NewFollowers[x])).addClass(typer + "-false");
				if(typer) {len++};
				link.addClass("notif");

				var linkjusttext = $(link).html().substring($(link).html().indexOf("\">") + 2);
				if(typer == true && $("#notifkeeper").html().indexOf(linkjusttext) == -1 && calledfirs != null && calledfirs == false) {
					$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
					$(img).val(linkjusttext).attr("data-href", $(link).attr("href"));
					setImage(img, null, function (maindiv, data) {
						createNotif($(data).attr("src"), $(data).val(), $(data).attr("data-href"));
					});
				}
				if (typer == true  && calledfirs != null  &&  calledfirs == true) {
					$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
				}
			}	
		}
	}
	if (data.TaggedInPost != null) {
		for (var x =0; x < data.TaggedInPost.length; x++) {
			if (data.TaggedInPost[x].isNew == typer) {
				var showpost = "Javascript:showPost('" + data.TaggedInPost[x].PostId + "')";
				var img = $("<img>").attr("name", data.TaggedInPost[x].WhoTagged);
				setImage(img);
				var link = $("<a>").append(img).append(" @" + data.TaggedInPost[x].WhoTagged + " tagged you in " + data.TaggedInPost[x].PostTitle + ".").attr("href", showpost).appendTo("#menu");
				link.attr("data-type", "TaggedInPost").attr("data-notif", JSON.stringify(data.TaggedInPost[x])).addClass(typer + "-false");
				if(typer) {len++};
				link.addClass("notif");

				var linkjusttext = $(link).html().substring($(link).html().indexOf("\">") + 2);
				if(typer == true && $("#notifkeeper").html().indexOf(linkjusttext) == -1 && calledfirs != null && calledfirs == false) {
					$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
					$(img).val(linkjusttext).attr("data-href", $(link).attr("href"));
					setImage(img, null, function (maindiv, data) {
						createNotif($(data).attr("src"), $(data).val(), $(data).attr("data-href"));
					});
				}
				if (typer == true  && calledfirs != null  &&  calledfirs == true) {
					$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
				}
			}
		}
	}
	if (data.TaggedInComment != null) {
		for (var x =0; x < data.TaggedInComment.length; x++) {
			if (data.TaggedInComment[x].isNew == typer) {
				var showpost = "Javascript:showPost('" + data.TaggedInComment[x].PostId + "')";
				var img = $("<img>").attr("name", data.TaggedInComment[x].WhoTagged);
				setImage(img);
				var link = $("<a>").append(img).append(" @" + data.TaggedInComment[x].WhoTagged + " tagged you in comments of " + data.TaggedInComment[x].TitleOfPost + ".").attr("href", showpost).appendTo("#menu");
				link.attr("data-type", "TaggedInComment").attr("data-notif", JSON.stringify(data.TaggedInComment[x])).addClass(typer + "-false");
				if(typer) {len++};
				link.addClass("notif");

				var linkjusttext = $(link).html().substring($(link).html().indexOf("\">") + 2);
				if(typer == true && $("#notifkeeper").html().indexOf(linkjusttext) == -1 && calledfirs != null && calledfirs == false) {
					$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
					$(img).val(linkjusttext).attr("data-href", $(link).attr("href"));
					setImage(img, null, function (maindiv, data) {
						createNotif($(data).attr("src"), $(data).val(), $(data).attr("data-href"));
					});
				}
				if (typer == true  && calledfirs != null  &&  calledfirs == true) {
					$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
				}
			}
		}
	}
	if (data.PostUserCommentedOrPosted != null  && typer == true) {
		for (var x =0; x < data.PostUserCommentedOrPosted.length; x++) {
			var temp  = data.PostUserCommentedOrPosted[x];
			if ((temp.CurrentLen - temp.LastComment) != 0) {
				var showpost = "Javascript:showPost('" + temp.PostId + "')";
				if ((temp.CurrentLen - temp.LastComment) > 1)
					var innertext = " @" + temp.LastCreator + " and " + ((temp.CurrentLen - temp.LastComment)-1) + " others ";
				else
					var innertext = " @"  + temp.LastCreator;
				var img = $("<img>").attr("name", temp.LastCreator);
				setImage(img);
				var link = $("<a>").append(img).append(innertext + " commented on " + temp.TitleOfPost).attr("href", showpost).appendTo("#menu");
				link.attr("data-type", "PostUserCommentedOrPosted").attr("data-notif", temp.PostId).addClass(typer + "-false");
				if(typer) {len++};
				link.addClass("notif");

				var linkjusttext = $(link).html().substring($(link).html().indexOf("\">") + 2);
				if(typer == true && $("#notifkeeper").html().indexOf(linkjusttext) == -1 && calledfirs != null && calledfirs == false) {
					$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
					$(img).val(linkjusttext).attr("data-href", $(link).attr("href"));
					setImage(img, null, function (maindiv, data) {
						createNotif($(data).attr("src"), $(data).val(), $(data).attr("data-href"));
					});
				}
				if (typer == true  && calledfirs != null  &&  calledfirs == true) {
					$("#notifkeeper").html($("#notifkeeper").html() + " " + linkjusttext);
				}
			}
		}
	}
	return len;

}

function isBreakpoint( alias ) {
    return $('.device-' + alias).is(':visible');
}

$( " #admin" ).on( "click", function() {
	if( isBreakpoint('xs') ) {
		$("#menu").css({
			position: "absolute",
			top: ($(this).offset().top+30) + "px",
			left: "0px",
			"z-index":9999,
			width: "100% !IMPORTANT"
		});
		
		$("#menu a").css({
			width: "100% !IMPORTANT"
		});
	}
	else {
		var left = $(this).offset().left;
		if ((left + 290) > $(window).width()) 
			left = $(window).width()- 290;

		$("#menu").css({
			position: "absolute",
			top: ($(this).offset().top+30) + "px",
			left: left + "px",
			"z-index":9999,
			width: "260px !IMPORTANT"
		});

		$("#menu a").css({
			width: "260px !IMPORTANT"
		});
	}

	$( "#menu" ).fadeToggle( "fast" );
});



$(document).on("click", ".notif",  function () {
	 $( "#admin" ).click();
	 var notifthis = $(this);
	 var obj = {
	 	notifdata: ($(notifthis).attr("data-notif")), 
	 	notiftype: $(notifthis).attr("data-type")
	};
	callAJAX ("GET", "/users/removenotif", obj, function (data) {
		callAJAX ("GET", "/users/notifications", {}, function (data) {
			var len = 0;
			$("#menu").html("");
			len += neworOld(true, 0, data);
			neworOld(false, 0, data);
			$("#numnotifs").html(" " + len) ;
		});
	});
});
