callAJAX ("GET", "/users/notifications", {}, function (data) {

	var len = 0;
	$("#menu").html("");

	len += neworOld(true, 0, data);
	neworOld(false, 0, data);
	$("#numnotifs").html(" " + len)



});

function neworOld (typer, len, data) {
	if (data.WhoJoined != null) {
		for (var x =0; x < data.WhoJoined.length; x++) {
			if (data.WhoJoined[x].isNew == typer) {
				var img = getLocalhost() + "/companygroup/getThumbnailAct?Username=" + data.WhoJoined[x].Username;
				var imgwrap = "<img src='" + img + "'></img>";
				var link = $("<a>").html(imgwrap + " @" + data.WhoJoined[x].Username + " has accepted your Inqora invite.").attr("href", "userpage.html?id=" + data.WhoJoined[x].Username).appendTo("#menu");
				if(typer) {len++};
			}
		}
	}
	if (data.NewFollowers != null) {
		for (var x =0; x < data.NewFollowers.length; x++) {
			if (data.NewFollowers[x].isNew == typer) {
				var img = getLocalhost() + "/companygroup/getThumbnailAct?Username=" + data.NewFollowers[x].Username;
				var imgwrap = "<img src='" + img + "'></img>";
				var link = $("<a>").html(imgwrap + " @" + data.NewFollowers[x].Username + " followed you.").attr("href", "userpage.html?id=" + data.NewFollowers[x].Username).appendTo("#menu");
				if(typer) {len++};
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
				if(typer) {len++};
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
				if(typer) {len++};
			}
		}
	}
	return len;

}

$( " #admin" ).on( "click", function()
{
	var left = $(this).offset().left;
	console.log(left+290);
	console.log($(window).width());
	if ((left + 290) > $(window).width()) 
		left = $(window).width()- 290;
	console.log(left+290);
    //show the menu directly over the placeholder
    $("#menu").css({
        position: "relative",
        top: ($(this).offset().top+30) + "px",
        left: left + "px",
        "z-index":9999
    });

  $( "#menu" ).fadeToggle( "fast" );
});