function getSubs (username) {
	callAJAX ("GET", "/subscriptions/getsubs/", {Username :username} , function (data) {
		for (var x =0; x < data.Companies.length; x++) {
			var newuser = createUser(data.Companies[x].Name,data.Companies[x].Username, data.Companies[x].Subbed, $("#companysubs"), makeLink(data.Companies[x].Username));
		}
		for (var x =0; x < data.Users.length; x++) {
			var newuser = createUser(data.Users[x].Name,data.Users[x].Username, data.Users[x].Subbed, $("#usersubs"), makeLink(null, null, data.Users[x].Username));
		}
		for (var x =0; x < data.Groups.length; x++) {
			var newuser = createUser(data.Groups[x].Name,data.Groups[x].Username, data.Groups[x].Subbed, $("#groupsubs"), makeLink(null, data.Groups[x].Username, null));
		}
		$("#usersubs")
	});
}
function getFollowers (username) {
	callAJAX ("GET", "/subscriptions/getfollowers/", {Username :username} , function (data) {
		for (var x =0; x < data.Users.length; x++) {
			var newuser = createUser(data.Users[x].Name,data.Users[x].Username, data.Users[x].Subbed, $("#followerpanel"), makeLink(null, null, data.Users[x].Username));
		}
	});
}
function makeLink (company, group, user) {
	if (company != null) 
		return "companypage.html?id=" + company;
	else if (group != null) 
		return "grouppage.html?id=" + group;
	else if (user != null) 
		return "userpage.html?id=" + user;
}
function createUser(name, username, subbed, maindiv, link) {
	var table = $("<table>").css("width", "100%");
		var tr = $("<tr>").appendTo(table);
			var td1 = $("<td>").css("font-size", "85%").appendTo(tr);
				var aperson = $("<a>").addClass("link").html(name + linkify(" ( " +  ("@" + username) + " )")).appendTo(td1).attr("href", link);
			var td2 = $("<td>").css("font-size", "85%").appendTo(tr);
				var button = $("<button>").addClass("badge pure-button pure-button-primary").css({'text-align': 'center', 'float': 'right', 'margin-right': '5px', 'padding': '3px 7px', 'margin-left' : '2px'}).html("<i class='fa fa-plus'></i>").appendTo(td2);
				$(button).addClass("subbutton-" + username).addClass("subbuttonthing").val(username);
				if (subbed == true) {
					$(button).html("<i class='fa fa-trash'></i>");
				}
				$(button).attr("name", subbed);
	$(maindiv).append(table);
}

$(document).on("click", ".subbuttonthing", function (ev){
	ev.preventDefault();
	var button = $(this);
	if ($(this).attr("name") == "true") {

		callAJAX("POST", "/subscriptions/removesub", {newsub : $(this).val()}, function (data) {
			if (data == "Success") {
				$(".subbutton-" + $(button).val()).html("<i class='fa fa-plus'></i>");
				$(".subbutton-" + $(button).val()).attr("name", "false");
			}
			alert(data);
		});
	}
	else {
		callAJAX("POST", "/subscriptions/addsub", {newsub : $(this).val()}, function (data) {
			if (data == "Success") {
				$(".subbutton-" + $(button).val()).html("<i class='fa fa-trash'></i>");
				$(".subbutton-" + $(button).val()).attr("name", "true");
			}
			alert(data);
		});
	}
});
