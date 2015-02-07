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
		$("#subscribe").on("click", function (ev) {
			ev.preventDefault();
			var button = this;
			if ($(this).html() == "Subscribe") {
				callAJAX("POST", "/subscriptions/addsub", {newsub: id}, function (data) {
					if (data.trim() == "Success") {
						$(button).html("Unsubscribe");
						$("#numfollowers").html(parseInt($("#numfollowers").html()) + 1);
					}
					else 
						alert(data);
				});
			}
			else if ($(this).html() == "Unsubscribe") {
				callAJAX("POST", "/subscriptions/removesub", {newsub: id}, function (data) {
					if (data == "Success") {
						button.innerHTML = "Subscribe";
						$("#numfollowers").html(parseInt($("#numfollowers").html()) -1);
					}
					else 
						alert(data);
				});
			}
		});
		$("#messageuser").attr("name", id);
		$("#messageuser").on("click", function (ev) {
			ev.preventDefault();
			$('#messagingmodalbutton').click();
			setUser($(this).attr("name"));
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

	