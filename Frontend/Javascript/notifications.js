callAJAX ("GET", "/users/notifications", {}, function (data) {

	var len = 0;
	$("#menu").html("");

	len += neworOld(true, 0, data);
	neworOld(false, 0, data);
	$("#numnotifs").html(" " + len)

});
$(document).on("click", ".messagingnotif", function (ev) {
				ev.preventDefault();
				$('#messagingmodalbutton').click();
				setUser($(this).attr("name"));
			});

function neworOld (typer, len, data) {
	if (data.WhoJoined != null) {
		for (var x =0; x < data.WhoJoined.length; x++) {
			if (data.WhoJoined[x].isNew == typer) {
				var img = getLocalhost() + "/companygroup/getThumbnailAct?Username=" + data.WhoJoined[x].Username;
				var imgwrap = "<img src='" + img + "'></img>";
				var link = $("<a>").html(imgwrap + " @" + data.WhoJoined[x].Username + " has accepted your Inqora invite.").attr("href", "userpage.html?id=" + data.WhoJoined[x].Username).appendTo("#menu");
				link.attr("data-type", "WhoJoined").attr("data-notif", JSON.stringify(data.WhoJoined[x])).addClass(typer + "-false");
				if(typer) {len++};
				link.addClass("notif");
			}
		}
	}

	if (data.NewMessages != null && typer == true) {
		for (var x= 0; x < data.NewMessages.length; x++) {
			var img = getLocalhost() + "/companygroup/getThumbnailAct?Username=" + data.NewMessages[x];
			var imgwrap = "<img src='" + img + "'></img>";
			var link = $("<a>").html(imgwrap + " @" + data.NewMessages[x] + " messaged you.").appendTo("#menu").attr("name", data.NewMessages[x]).addClass("messagingnotif");
			link.attr("data-type", "NewMessages").attr("data-notif", JSON.stringify(data.NewMessages[x])).addClass(typer + "-false");
			if(typer) {len++};
			link.addClass("notif");
		}
	}
	if (data.NewFollowers != null) {
		for (var x =0; x < data.NewFollowers.length; x++) {
			if (data.NewFollowers[x].isNew == typer) {
				var img = getLocalhost() + "/companygroup/getThumbnailAct?Username=" + data.NewFollowers[x].Username;
				var imgwrap = "<img src='" + img + "'></img>";
				var link = $("<a>").html(imgwrap + " @" + data.NewFollowers[x].Username + " followed you.").attr("href", "userpage.html?id=" + data.NewFollowers[x].Username).appendTo("#menu");
				link.attr("data-type", "NewFollowers").attr("data-notif", JSON.stringify(data.NewFollowers[x])).addClass(typer + "-false");
				if(typer) {len++};
				link.addClass("notif");
			}	
		}
	}
	if (data.TaggedInPost != null) {
		for (var x =0; x < data.TaggedInPost.length; x++) {
			if (data.TaggedInPost[x].isNew == typer) {
				var img = getLocalhost() + "/companygroup/getThumbnailAct?Username=" + data.TaggedInPost[x].WhoTagged;
				var imgwrap = "<img src='" + img + "'></img>";
				var showpost = "Javascript:showPost('" + data.TaggedInPost[x].PostId + "')";
				var link = $("<a>").html(imgwrap + " @" + data.TaggedInPost[x].WhoTagged + " tagged you in " + data.TaggedInPost[x].PostTitle + ".").attr("href", showpost).appendTo("#menu");
				link.attr("data-type", "TaggedInPost").attr("data-notif", JSON.stringify(data.TaggedInPost[x])).addClass(typer + "-false");
				if(typer) {len++};
				link.addClass("notif");
			}
		}
	}
	if (data.TaggedInComment != null) {
		for (var x =0; x < data.TaggedInComment.length; x++) {
			if (data.TaggedInComment[x].isNew == typer) {
				var img = getLocalhost() + "/companygroup/getThumbnailAct?Username=" + data.TaggedInComment[x].WhoTagged;
				var imgwrap = "<img src='" + img + "'></img>";
				var showpost = "Javascript:showPost('" + data.TaggedInComment[x].PostId + "')";
				var link = $("<a>").html(imgwrap + " @" + data.TaggedInComment[x].WhoTagged + " tagged you in comments of " + data.TaggedInComment[x].TitleOfPost + ".").attr("href", showpost).appendTo("#menu");
				link.attr("data-type", "TaggedInComment").attr("data-notif", JSON.stringify(data.TaggedInComment[x])).addClass(typer + "-false");
				if(typer) {len++};
				link.addClass("notif");
			}
		}
	}
	if (data.PostUserCommentedOrPosted != null  && typer == true) {
		for (var x =0; x < data.PostUserCommentedOrPosted.length; x++) {
			var temp  = data.PostUserCommentedOrPosted[x];
			if ((temp.CurrentLen - temp.LastComment) != 0) {
				var img = getLocalhost() + "/companygroup/getThumbnailAct?Username=" + temp.LastCreator;
				var imgwrap = "<img src='" + img + "'></img>";
				var showpost = "Javascript:showPost('" + temp.PostId + "')";
				if ((temp.CurrentLen - temp.LastComment) > 1)
					var innertext = " @" + temp.LastCreator + " and " + ((temp.CurrentLen - temp.LastComment)-1) + " others ";
				else
					var innertext = " @"  + temp.LastCreator;
				var link = $("<a>").html(imgwrap + innertext + " commented on " + temp.TitleOfPost).attr("href", showpost).appendTo("#menu");
				link.attr("data-type", "PostUserCommentedOrPosted").attr("data-notif", temp.PostId).addClass(typer + "-false");
				if(typer) {len++};
				link.addClass("notif");
			}
		}
	}
	return len;

}

$( " #admin" ).on( "click", function() {
	var left = $(this).offset().left;
	console.log(left+290);
	console.log($(window).width());
	if ((left + 290) > $(window).width()) 
		left = $(window).width()- 290;
	console.log(left+290);
    //show the menu directly over the placeholder
    $("#menu").css({
        position: "absolute",
        top: ($(this).offset().top+30) + "px",
        left: left + "px",
        "z-index":9999
    });

  $( "#menu" ).fadeToggle( "fast" );
});
$(document).on("click", ".notif",  function () {
	 $( "#admin" ).click();
	 var notifthis = $(this);
	 //console.log("HEYHEYHEY");
	 var obj = {
	 	notifdata: ($(notifthis).attr("data-notif")), 
	 	notiftype: $(notifthis).attr("data-type")
	};
	 //console.log(obj);
	callAJAX ("GET", "/users/removenotif", obj, function (data) {
		console.log(data);
		callAJAX ("GET", "/users/notifications", {}, function (data) {
			var len = 0;
			$("#menu").html("");
			len += neworOld(true, 0, data);
			neworOld(false, 0, data);
			$("#numnotifs").html(" " + len) ;
		});
	});
});
