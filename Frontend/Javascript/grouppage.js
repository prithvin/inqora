
function showGroup (companyname) {
	callAJAX ("GET", "/companygroup/group/get/" + companyname, "" , function (data) {
		console.log(data);
		$("#companymaindata").html(data.Name + " (@" + data.Username + ")");
		$("title").html("Inqora - " + data.Name)
		$("#profilepic").attr("src", data.Picture);
		if (data.Subscribed == true)
			$("#subscribe").html("Unsubscribe");
		else
			$("#subscribe").html("Subscribe");
		$("#description").html(data.Description);
		$("#numfollowers").html(data.NumFollowers);
		$("#subscribe").on("click", function (ev) {
			ev.preventDefault();
			var button = this;
			if ($(this).html() == "Subscribe") {
				callAJAX("POST", "/subscriptions/addsub", {newsub: companyname}, function (data) {
					if (data.trim() == "Success") {
						$(button).html("Unsubscribe");
						$("#numfollowers").html(parseInt($("#numfollowers").html()) + 1);
					}
					else 
						alert(data);
				});
			}
			else if ($(this).html() == "Unsubscribe") {
				callAJAX("POST", "/subscriptions/removesub", {newsub: companyname}, function (data) {
					if (data == "Success") {
						button.innerHTML = "Subscribe";
						$("#numfollowers").html(parseInt($("#numfollowers").html()) -1);
					}
					else 
						alert(data);
				});
			}
		});
	});
}
