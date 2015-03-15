function showUser(id) {
	callAJAX ("GET", "/accounts/getuserprofile/", {Username :id} , function (data) {
		$("#userprofilename").html(data.Name + " (@" + data.Username + ")");
		$("#profilepic").attr("src", data.Picture);
		$("title").html("Inqora - " + data.Name)
		$("#numpointsforuser").html(data.Points);
		$("#numfollowers").html(data.NumFollowers);
		if (data.Subscribed == true)
			$("#subscribe").html("Unsubscribe");
		else
			$("#subscribe").html("Subscribe");
		subclick(data, id, "Subscribe");
		$("#messageuser").attr("name", id);
		$("#messageuser").on("click", function (ev) {
			ev.preventDefault();
			//$('#messagingmodalbutton').click();
			//setUser($(this).attr("name"););
			window.location = "messaging.html?id=" + $(this).attr("name");
		});
		getSubs(id);
		getFollowers(id);
		updatePortfolio (id) 
	});
}
$(".menutabbar").on("click", function (ev) {
	$(".menutabbar").removeClass("pure-menu-selected");
	$(this).addClass("pure-menu-selected");
});

function subclick (data, companyname, subscribetext) {
	$("#subscribe").one("click", function (ev) {
		ev.preventDefault();
		var button = this;
		if ($(this).html() == subscribetext) {
			callAJAX("POST", "/subscriptions/addsub", {newsub: companyname}, function (data) {
				if (data.trim() == "Success") {
					$(button).html("Unsubscribe");
					$("#numfollowers").html(parseInt($("#numfollowers").html()) + 1);
				}
				else 
					alert(data);
				subclick(data, companyname, subscribetext);
			});
		}
		else if ($(this).html() == "Unsubscribe") {
			callAJAX("POST", "/subscriptions/removesub", {newsub: companyname}, function (data) {
				if (data == "Success") {
					button.innerHTML = subscribetext;
					$("#numfollowers").html(parseInt($("#numfollowers").html()) -1);
				}
				else 
					alert(data);
				subclick(data, companyname, subscribetext);
			});
		}
	});
}

function showUserLikes (id) {
	$("#posts").html("");
	$("#checkdiv").html("");
	callAJAX("GET", "/loadingpostfeeds/postsliked/", {Username: id}, function (data) {
		displayAll (data, $("#posts"), $("#checkdiv"));
	});
}
function showUserDislikes (id) {
	$("#posts").html("");
	$("#checkdiv").html("");
	callAJAX("GET", "/loadingpostfeeds/postsdisliked/", {Username: id}, function (data) {
		displayAll (data, $("#posts"), $("#checkdiv"));
	});
}
function showUserComments (id) {
	$("#posts").html("");
	$("#checkdiv").html("");
	callAJAX("GET", "/loadingpostfeeds/postscommented/", {Username: id}, function (data) {
		displayAll (data, $("#posts"), $("#checkdiv"));
	});
}

	