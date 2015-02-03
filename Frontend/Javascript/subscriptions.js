function getSubs (username) {
	callAJAX ("GET", "/subscriptions/getsubs/", {Username :username} , function (data) {
		for (var x =0; x < data.Companies.length; x++) {
			var newuser = createUser(data.Companies[x].Name,data.Companies[x].Username, data.Companies[x].Subbed, $("#companysubs"));
			console.log(data.Companies[x]);
		}
		for (var x =0; x < data.Users.length; x++) {
			var newuser = createUser(data.Users[x].Name,data.Users[x].Username, data.Users[x].Subbed, $("#usersubs"));
			console.log(data.Companies[x]);
		}
		for (var x =0; x < data.Groups.length; x++) {
			var newuser = createUser(data.Groups[x].Name,data.Groups[x].Username, data.Groups[x].Subbed, $("#groupsubs"));
			console.log(data.Companies[x]);
		}
		$("#usersubs")
	});
}
function getFollowers (username) {
	callAJAX ("GET", "/subscriptions/getfollowers/", {Username :username} , function (data) {
		console.log(data);
		for (var x =0; x < data.Users.length; x++) {
			var newuser = createUser(data.Users[x].Name,data.Users[x].Username, data.Users[x].Subbed, $("#followerpanel"));
			console.log(data.Companies[x]);
		}
	});
}
function createUser(name, username, subbed, maindiv) {
	var table = $("<table>").css("width", "100%");
		var tr = $("<tr>").appendTo(table);
			var td1 = $("<td>").css("font-size", "85%").appendTo(tr);
				var aperson = $("<a>").addClass("link").html(name + linkify(" ( " +  ("@" + username) + " )")).appendTo(td1).attr("href", "directtotype.html?id=" + username);
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
