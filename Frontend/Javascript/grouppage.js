
function showGroup (companyname, noposts, id) {
	callAJAX ("GET", "/companygroup/group/get/" + companyname, "" , function (data) {
		

		arr = [id];
		console.log(data);
		subscribetext = "Subscribe";
		if (data.isPrivate == true && data.isPrivate != null) {
			arr.push("PRIVATE");
			subscribetext = "Request Access";
			$("#privgroupnotif").show();
			$(".companypanel").css("border-top" , "10px solid green");
			$("#isprivategroup").show();

			
		}

		console.log("LOL");
		
		if (!noposts && ((data.isPrivate == false || data.isPrivate == null) || (data.isPrivate == true && data.Subscribed == true))) {
			showPostingSystem([id]);
			$("#requesttojoinpanel").show();
			var requests = data.Requests;
			for (var x =0; x < requests.length; x++) {
				var newuser = createRequestUser(companyname, requests[x].Name,requests[x].Username, false, $("#requesttojoin"), "userpage.html?id=" + requests[x].Username);
			}
		}
		else
			$("#nopostsee").show();
		

		$("#companymaindata").html(data.Name + " (@" + data.Username + ")");
		$("title").html("Inqora - " + data.Name)
		$("#profilepic").attr("src", data.Picture);
		if (data.Subscribed == true)
			$("#subscribe").html("Unsubscribe");
		else
			$("#subscribe").html(subscribetext);
		$("#description").html(" " + linkify(data.Description));
		$("#numfollowers").html(data.NumFollowers);
		if ((data.isPrivate == true && data.Subscribed == true))
			subclick(data, companyname, "Re-Subscribe");
		else if ((data.isPrivate == false || data.isPrivate == null)) {
			subclick(data, companyname, "Subscribe");
		}
		else {
			requestAccess(companyname);
		}

		
	});
}

function requestAccess (companyname) {
	$("#subscribe").one("click", function (ev) {
		ev.preventDefault();
		callAJAX("POST", "/companygroup/addrequest", {GroupUsername: companyname}, function (data) {
			alert(data);
			$(this).html("Requested!");
		});
	});
}


			


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

function createRequestUser(companyname, name, username, subbed, maindiv, link) {
	var table = $("<table>").css("width", "100%");
		var tr = $("<tr>").appendTo(table);
			var td1 = $("<td>").css("font-size", "85%").appendTo(tr);
				var aperson = $("<a>").addClass("link").html(name + linkify(" ( " +  ("@" + username) + " )")).appendTo(td1).attr("href", link);
			var td2 = $("<td>").css("font-size", "85%").appendTo(tr);
				var button = $("<button>").addClass("badge pure-button pure-button-primary").css({'text-align': 'center', 'float': 'right', 'margin-right': '5px', 'padding': '3px 7px', 'margin-left' : '2px'}).html("<i class='fa'>Add to Group</i>").appendTo(td2);
				$(button).addClass("subbutton-" + username).addClass("user-requested-now-accept").val(username).attr("id", companyname);
				if (subbed == true) {
					$(button).html("<i class='fa fa-trash'></i>");
				}
				$(button).attr("name", subbed);
	$(maindiv).append(table);
}

$(document).on("click", ".user-requested-now-accept", function (ev) {
	ev.preventDefault();
	$(this).html("<i class='fa'>Added</i>");
	callAJAX("POST", "/subscriptions/addreq", {newmember: $(this).val(), groupname: $(this).attr("id")}, function (data) {
		alert(data);
	});
});