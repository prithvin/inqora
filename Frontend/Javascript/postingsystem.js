
function createCommentPanel(panel, postid) {
	callAJAX ("GET", "/posting/getcomments", {PostId: postid}, function (data) {
		panel.innerHTML = "";
		$("<p>").addClass("hr2").appendTo(panel);
		if (data.length > 3) {
			var arr = [];
			for (var x = 0; x < data.length - 3; x++) 
				arr.push(data[x]);
			var prevcomments = $("<a>").attr("href", "#").html("<i class='fa fa-cubes'></i> View Previous Comments").attr("data-array", JSON.stringify(arr).toString()).appendTo(panel).attr("name", postid).addClass("viewpreviouscomments");
			
			$("<hr>").addClass("hr3").appendTo(panel);
		}
		start = data.length - 3;
		if (data.length - 3 < 0)
			start = 0;
		for (var x = start; x < data.length; x++) {
			var divvy= $("<div>").css("min-height", "50px").appendTo(panel);
			var tably = $("<table>").css("width", "100%").appendTo(divvy);
				var td2 = $("<td>").appendTo(tably);
				makeToolTip(td2, "zeromargin", "@" + data[x].PosterUsername + "(" + data[x].PosterName + "):" , "userpage.html?user=" + data[x].PosterUsername, data[x].PosterUsername);
				var content = $("<span>").html(linkify(data[x].Content)).appendTo(td2);




				var upvoteclass = "commentvotespan";
				var downvoteclass = "commentvotespan";
				if (data[x].Status == 1) 
					upvoteclass += " selected";
				else if (data[x].Status == -1)
					downvoteclass += " selected";

				var ul1 = $("<div>").css("margin-top", "5px").appendTo(divvy);
					var lisecond = $("<span>").appendTo(ul1);
						var linknet = $("<span>").addClass("votespan").html(data[x].NetVotes + " Votes").appendTo(lisecond).attr("id", "netvotecounter-" +  postid + "-" + x).attr("name", postid).attr("value", x);

					$(ul1).append(" - ");
					var lifirst = $("<span>").appendTo(ul1).attr("id", postid + "-" + x + "-upvote").attr("name", postid).attr("value", x).addClass("lifirst");
						var linkup = $("<a>").addClass(upvoteclass).attr("href" , "").html("<i class='fa fa-arrow-up'></i> Upvote").appendTo(lifirst);
					$(ul1).append(" - ");
					var lithird = $("<span>").appendTo(ul1).attr("id", postid + "-" + x + "-downvote").attr("name", postid).attr("value", x).addClass("lithird");
						var linkdown = $("<a>").addClass(downvoteclass).attr("href" , "").html("<i class='fa fa-arrow-down'></i> Downvote").appendTo(lithird).attr("id", "netvotecounter-" +  postid + "-" + x);

		
		
			var time = $("<i>").appendTo(ul1).html("<span class='commenttime'>" + msToTime((new Date).getTime() - data[x].Time) + "</span><hr class='hr3'>");
		}
		var z = $("<span>").attr("id", "appendhere-" + postid).appendTo(panel);

	var form = $("<form>").attr("id", "newcommentform-"+ postid).addClass("pure-form").appendTo(panel);
		var submit = $("<textarea>").attr("type", "text").attr("id", "newcomment-" + postid).css("width", "100%").css("resize", "none").attr("placeholder", "New Comment").appendTo(form).attr("name", postid);
		$("<input>").attr("type", "submit").css("display","none").appendTo(form);
	$(submit).keypress(function(e){
		if(e.keyCode==13 && e.shiftKey == false) {
			var obj = {
				Comment: $(this).val(),
				PostId: $(this).attr("name")
			};
			var button = this;
			callAJAX("GET", "/posting/newcomment", obj, function (data) {
				var comments = document.getElementsByClassName("commenttime");
				newComment (data, $("#appendhere-" + $(button).attr("name")), $(button).attr("name"), comments.length);
				$(button).val("").attr("value", "");
				var lol = $("#appendhere-" + $(button).attr("name"));
				$(lol).remove();
				$(lol).insertBefore("#newcommentform-" + $(button).attr("name"));
			});
		}
	});
	callAJAX("GET", "/companygroup/getSearch", {}, function (searchres) {
		var textarea = document.getElementById("newcomment-" + postid);
		var arr = [];
		for (var x = 0 ;x  < searchres.length; x++) {
			var img = "<img src='"+getLocalhost()+ "/companygroup/getThumbnailAct?Username=" + searchres[x].Username +  "'>";
			arr.push(img + " " + searchres[x].Name + " (@"  + searchres[x].Username + ") - " + searchres[x].Type);
		}
		$(textarea).textcomplete([
		    { // html
		        mentions: arr,
		        match: /\B@(\w*)$/,
		        search: function (term, callback) {
		            callback($.map(this.mentions, function (mention) {
		                return mention.toLowerCase().indexOf(term.toLowerCase()) != -1 ? mention : null;
		            }));
		        },
		        index: 1,
		        replace: function (mention) {
		            return '@' + mention.substring(mention.indexOf("(@") + 2, mention.indexOf(") - ")) + ' ';
		        }
		    }
		], { appendTo: 'body' }).overlay([
		    {
		        match: /\B@\w+/g,
		        css: {
		            'background-color': '#d8dfea'
		        }
		    }
		]);
	});


	});	
}


function newComment (data, panel, postid, x) {
	var divvy= $("<div>").css("min-height", "50px").insertAfter(panel);
	var tably = $("<table>").css("width", "100%").appendTo(divvy);
		var td2 = $("<td>").appendTo(tably);
		makeToolTip(td2, "zeromargin", "@" + data.PosterUsername + "(" + data.PosterName + "):" , "userpage.html?user=" + data.PosterUsername, data.PosterUsername);
		var content = $("<span>").html(linkify(data.Content)).appendTo(td2);
		var upvoteclass = "commentvotespan";
		var downvoteclass = "commentvotespan";
		if (data.Status == 1) 
			upvoteclass += " selected";
		else if (data.Status == -1)
			downvoteclass += " selected";

		var ul1 = $("<div>").css("margin-top", "5px").appendTo(divvy);
			var lisecond = $("<span>").appendTo(ul1);
				var linknet = $("<span>").addClass("votespan").html(data.NetVotes + " Votes").appendTo(lisecond).attr("id", "netvotecounter-" +  postid + "-" + x).attr("name", postid).attr("value", x);

			$(ul1).append(" - ");
			var lifirst = $("<span>").appendTo(ul1).attr("id", postid + "-" + x + "-upvote").attr("name", postid).attr("value", x).addClass("lifirst");
				var linkup = $("<a>").addClass(upvoteclass).attr("href" , "").html("<i class='fa fa-arrow-up'></i> Upvote").appendTo(lifirst);
			$(ul1).append(" - ");
			var lithird = $("<span>").appendTo(ul1).attr("id", postid + "-" + x + "-downvote").attr("name", postid).attr("value", x).addClass("lithird");
				var linkdown = $("<a>").addClass(downvoteclass).attr("href" , "").html("<i class='fa fa-arrow-down'></i> Downvote").appendTo(lithird).attr("id", "netvotecounter-" +  postid + "-" + x);

			

	var time = $("<i>").appendTo(ul1).html("<span class='commenttime'>" + msToTime((new Date).getTime() - data.Time) + "</span><hr class='hr3'>");

}


function updateVote(addthis, postid, noshowvotes) {
	var numvotes =parseInt($("#netvotecounter-" + postid).html());
	if (noshowvotes == true) 
		$("#netvotecounter-" + postid).html((numvotes+addthis));
	else
		$("#netvotecounter-" + postid).html((numvotes+addthis) + " Votes");
}

function getStatus(upvotestatus, postid) {
	if (upvotestatus) 
	 	return $("#" + postid + "-upvote").find("a").hasClass("selected");
	else 
		return $("#" + postid + "-downvote").find("a").hasClass("selected");
}
function selectWhich (selectlike, selectdislike, postid) {
	var upvote = $("#" + postid + "-upvote").find("a");
	var downvote = $("#" + postid + "-downvote").find("a");
	if (selectlike)
		$(upvote).addClass("selected");
	else if (!selectlike) 
		$(upvote).removeClass("selected");

	if (selectdislike)
		$(downvote).addClass("selected");
	else if (!selectdislike) 
		$(downvote).removeClass("selected");
}
function linkwithfontawesome (maindiv, fontawesomeclass, linkclass, innerHTML) {
	var a = $("<a>").attr("href" , "").addClass(linkclass).appendTo(maindiv);
	var i = $("<i>").addClass(fontawesomeclass).appendTo(a);
	$(a).append(" " + innerHTML);
}

function createPost(postid, maindiv, appendafter) {
	callAJAX ("GET", "/posting/getpost", {PostId: postid}, function (data) {
		if (appendafter) {
			var section = $("<section>").attr("id", postid).addClass("post head card viewpost").insertAfter(maindiv);
		}
		else {
			var section = $("<section>").attr("id", postid).addClass("post head card viewpost").appendTo(maindiv);
		}
		var h1 = $("<h1>").addClass("align-center").html(data.Title).appendTo(section);
		var h2 = $("<h2>").addClass("description align-center").appendTo(section);
			var timeposted = $("<span>").html("Posted " + msToTime((new Date).getTime() - data.TimePosted) + " by ").appendTo(h2);
			makeToolTip(h2, "", "@" + data.PosterUsername + " (" + data.PosterName + ")","userpage.html?user=" + data.PosterUsername, data.PosterUsername);

		var lol = $("<p>").html(linkify(data.Content)).appendTo(section).addClass("lol");
		var hr1 = $("<p>").addClass("hr1").appendTo(section);
		var misc = $("<p>").addClass("lol data").appendTo(section).css("font-weight", "bold");
			var commentvotespan = $("<span>").html(data.NumComments + " comments  / <span style='color:#2574A9' id='netvotecounter-" + postid + "'>" + data.NetVotes + " Votes </span>  / Tags: ").appendTo(misc);
			for (var x =0; x < data.Tags.length; x++)
				makeToolTip(commentvotespan, "", "@" + data.Tags[x] + " , ","userpage.html?user=" + data.Tags[x], data.Tags[x]);
		var hr2again = $("<p>").addClass("hr2").appendTo(section);
		var menu = $("<div>").addClass("pure-menu pure-menu-open pure-menu-horizontal menu").appendTo(section);
			var ul1 = $("<ul>").css("width", "100%").appendTo(menu);
			
			var upvoteclass = "";
			var downvoteclass = "";
			if (data.VoteStatus == 1) 
				upvoteclass = "selected";
			else if (data.VoteStatus == -1)
				downvoteclass = "selected";

			var upvote = $("<li>").addClass("mostmenu upvotebutton").appendTo(ul1).attr("id" ,postid + "-upvote").attr("name", postid);
				linkwithfontawesome(upvote, "fa fa-arrow-up", upvoteclass, "Upvote");
				


			var downvote = $("<li>").addClass("mostmenu downvotebutton").appendTo(ul1).attr("id" ,postid + "-downvote").attr("name", postid);
				linkwithfontawesome(downvote, "fa fa-arrow-down", downvoteclass, "Downvote");
				

			var commentpost = $("<li>").addClass("mostmenu commentpost").attr("id", "commentpost-" + postid).attr("name",postid).appendTo(ul1);
				linkwithfontawesome(commentpost, "fa fa-comment", "", "Comment");
				

			var sharepost = $("<li>").addClass("sharepost").attr("id", "sharepost-" + postid).attr("name",postid).appendTo(ul1);
				linkwithfontawesome(sharepost, "fa fa-share-square-o", "", "Share");
				

			var sharepanel = $("<div>").addClass("sharepanel").attr("id" , "sharepanel-" + postid).appendTo(section);
			var myString ="<p class='hr2'></p>";
			myString +=	"<span class='st_twitter_large' displayText='Tweet'></span>"
			myString +=	"<span class='st_reddit_large' displayText='Reddit'></span>"
			myString +=	"<span class='st_facebook_large' displayText='Facebook'></span>"
			myString +=	"<span class='st_linkedin_large' displayText='LinkedIn'></span>"
			myString += "<span class='st_googleplus_large' displayText='Google +'></span>"
			myString += "<span class='st_email_large' displayText='Email'></span>"
			$(sharepanel).html(myString);
			
			var commentpanel = $("<div>").addClass("commentpanel").attr("id" , "commentpanel-" + postid).appendTo(section);
	});
}