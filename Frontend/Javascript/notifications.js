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
			top: $("#navsearchmainsearch").height() + "px",
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
			top: $("#navsearchmainsearch").height() + "px",
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




















// Defaults to sessionStorage for storing the Facebook token
     openFB.init({appId: '649452745161437'});

    //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
    //  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});
 

    function errorHandler(error) {
        alert(error.message);
    }


    function login() {
        openFB.login(function(response) {
            if(response.status === 'connected') {
                alert('Facebook login succeeded');
                loginTry();
            } else {
                alert('Facebook login failed: ' + response.error);
            }
        }, {scope: 'email,public_profile'});
    }
    function loginTry() {
        openFB.api({
            path: '/me',
            success: function(data) {
                callAJAX ("POST", "/users/authenticate", {User: data.email, FBAuth:data.id}, function (data) {
                    console.log(data);
                    if (data == "Successfully authenticated") {
                        if (window.location.href.indexOf("index.html") != -1)
                            window.location = "newsfeed.html";
                        else 
                            window.location.replace(window.location.href);
                    }
                    else
                        alert("No account connected to Facebook profile");
                });
            },
            error: errorHandler
        });
         
    }
