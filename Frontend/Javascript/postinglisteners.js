$(document).on("click", ".upvotebutton", function (ev) {
	ev.preventDefault();
	var postid = $(this).attr("name")
	
	callAJAX ("GET", "/posting/like", {PostId: postid}, function (data) {
		if (getStatus(true, postid)) {
			updateVote(-1, postid);
			selectWhich (false, false, postid);		
		}
		else if (getStatus(false, postid)) {
			updateVote(2, postid);
			selectWhich (true, false, postid)
		}
		else {
			updateVote(1, postid);
			selectWhich (true, false, postid);
		}
		alert(data);
	});
});



$(document).on("click", ".downvotebutton", function (ev) {
	ev.preventDefault();
	var postid = $(this).attr("name");
	
	callAJAX ("GET", "/posting/dislike", {PostId: postid}, function (data) {
		if (getStatus(false, postid)) {
			updateVote(1, postid);
			selectWhich (false, false, postid);
		}
		else if (getStatus(true, postid)) {
			updateVote(-2, postid);
			selectWhich (false, true, postid);
		}
		else {
			updateVote(-1, postid);
			selectWhich (false, true, postid);
		}
		alert(data);
	});
});

$(document).on("click", ".sharebuttonpress", function (ev) {
		ev.preventDefault(); 
		var clicker = this;
		callAJAX("GET", "/automate/shorturl", {URL: window.location.href}, function (data) {
			var str = $(clicker).attr("href").replace("HAILINQORA", data);
			$("#sharethisframe").attr("src", str);
			$("#sharethismodal").click();
	
		});
	});

$(document).on("click", ".commentpost", function (ev) {
	ev.preventDefault();
	var id = $(this).attr("name");
	//history.pushState('', 'Inqora', updateURLParameter(window.location.href, "userpostid", id));
	$("#sharepanel-" + id).hide();
	$("#commentpanel-" + id).toggle();
	if($("#commentpanel-" + id).is(":visible")) {
		$(this).find("a").addClass("selected");
		$("#sharepost-" + id).find("a").removeClass("selected")
	}
	else
		$(this).find("a").removeClass("selected");
	createCommentPanel($("#commentpanel-" + id).get(0), id);
});

$(document).on("click", ".sharepost", function (ev) {
	ev.preventDefault();
	var id = $(this).attr("name");
	history.pushState('', 'Inqora', updateURLParameter(window.location.href, "userpostid", id));
	$("#sharepanel-" + id).toggle();
	if($("#sharepanel-" + id).is(":visible")) {
		$(this).find("a").addClass("selected");
		$("#commentpost-" + id).find("a").removeClass("selected");
	}
	else  {
		$(this).find("a").removeClass("selected");
	}
	$("#commentpanel-" + id).hide();
});

$(document).on("click", ".viewpreviouscomments" , function (ev) {
				ev.preventDefault();
				var arr = JSON.parse($(this).attr("data-array"));
				for (var x = 0; x < arr.length; x++) {
					newComment(arr[x], this, $(this).attr("name"),x);
				}
				$(this).css("display", "none");
			});


$(document).on("click", ".lifirst", function (ev) {
		ev.preventDefault();
		var elementby = $(this).attr("name") + "-" + $(this).attr("value");
		if (getStatus(true, elementby)) {
			updateVote(-1, elementby);
			selectWhich (false, false, elementby);		
		}
		else if (getStatus(false, elementby)) {
			updateVote(2, elementby);
			selectWhich (true, false, elementby)
		}
		else {
			updateVote(1, elementby);
			selectWhich (true, false, elementby);
		}
		callAJAX ("GET", "/posting/comment/like/" + $(this).attr("value"), {PostId: $(this).attr("name")}, function (data2) {
			alert(data2);
		});
	});

$(document).on("click", ".sharepost", function (ev) {
	ev.preventDefault();
});

$(document).on("click", ".lithird",function (ev) {
	ev.preventDefault();
	var elementby = $(this).attr("name") + "-" + $(this).attr("value");
	if (getStatus(false, elementby)) {
		updateVote(1, elementby);
		selectWhich (false, false, elementby);
	}
	else if (getStatus(true, elementby)) {
		updateVote(-2, elementby);
		selectWhich (false, true, elementby);
	}
	else {
		updateVote(-1, elementby);
		selectWhich (false, true, elementby);
	}
	callAJAX ("GET", "/posting/comment/dislike/" + $(this).attr("value"), {PostId: $(this).attr("name")}, function (data2) {
		alert(data2);
	});
});