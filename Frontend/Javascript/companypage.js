$(".daychoose").on("click", function (ev) {
	ev.preventDefault();

	var val = this.innerHTML.toLowerCase();
	if (val == "max")
		val = "my";
	var src = $("#yahoochart").attr("src").substring(0, $("#yahoochart").attr("src").length - 2) + val;
	$("#yahoochart").attr("src", src);
	$(".daychoose").removeClass("daychooseactive");
	$(this).addClass("daychooseactive");
});
function showCompany (companyname) {
	callAJAX ("GET", "/companygroup/company/get/" + companyname, "" , function (data) {
		$("#companymaindata").html(data.Name + " (@" + data.Ticker + ")");
		$("title").html("Inqora - " + data.Name)
		$("#stockpricelol").html(data.StockPrice.toFixed(2));
		$("#tinystock").html(data.ChangeThing);
		if (data.ChangeThing.indexOf("-") != -1)
			$("#tinystock").removeClass("tinystockgood").addClass("tinystockbad");
		$("#profilepic").attr("src", data.Picture);
		$("#yahoochart").attr("src", "http://chart.finance.yahoo.com/z?s=" + companyname + "&t=5d");
		if (data.Subscribed == true)
			$("#subscribe").html("Unsubscribe");
		else
			$("#subscribe").html("Subscribe");
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
		if (data.OwnPortfolio == false) 
			$("#virtport").html("Add to Virtual Portfolio");
		else 
			$("#virtport").html("Remove from Virtual Portfolio (" + (data.PercentChangeIfOwnVirtualPortfolio*100).toFixed(2)+ "% Change)");
		$("#virtport").on("click", function (ev) {
			ev.preventDefault();
			var button = this;
			if ($(this).html() == "Add to Virtual Portfolio") {
				callAJAX("GET", "/stockgame/buycompany", {CompanyUsername: companyname}, function (data) {
					if (data.toString().indexOf("Error") != -1) 
						alert(data);
					else 
						$(button).html("Remove from Virtual Portfolio (0% Change)");
					updatePortfolio(companyname);
				});
			}
			else {
				callAJAX("GET", "/stockgame/sellcompany", {CompanyUsername: companyname}, function (data) {
					if (data.indexOf("Error") != -1) 
						alert(data);
					else 
						$(button).html("Add to Virtual Portfolio");
					updatePortfolio(companyname);
				});
			}
		});
		$("#industry").html(" " + data.Industry);
		$("#description").html(data.Description);
		$("#PreviousClose").html("$" + data.PreviousClose);
		$("#Open").html("$" + data.Open);
		$("#PricePerBook").html(data.PricePerBook);
		$("#PEGRatio").html(data.PEGRatio);
		$("#PERatio").html(data.PERatio);
		$("#PricePerSales").html(data.PricePerSales);
		$("#DividendYield").html(data.DividendYield);
		$("#MarketCap").html("$" + data.MarketCap);
		updatePortfolio(companyname);
	});
}

function updatePortfolio (companyname) {
	callAJAX("GET", "/stockgame/companydata", {CompanyUsername: companyname}, function (data) {
		$("#numtimesbought").html(data.length);
		
		var arr = [];
		$("#newyields").html("");
		$("#oldyields").html("");
		for (var x = 0; x < data.length; x++) {
			if (data[x].CurrentPrice != null) {
				var str = "Initial Price: $" + data[x].StockStart.toFixed(2) + "<br>";
				str += "Current Price: $" + data[x].CurrentPrice.toFixed(2) + "<br>";
				str += "Percent Change: " + (((data[x].CurrentPrice - data[x].StockStart)/data[x].StockStart)*100).toFixed(2) + "%<br>";
				str += "Held Since: " + new Date(data[x].FollowingDate).toDateString() + "<br>";
				arr.push((data[x].CurrentPrice - data[x].StockStart)/data[x].StockStart);
				$("#newyields").append(str);
			}
			else {
				var str = "Initial Price: $" + data[x].StockStart.toFixed(2) + "<br>";
				str += "Final Price: $" + data[x].StockEnd.toFixed(2) + "<br>";
				str += "Percent Change: " + (((data[x].StockEnd - data[x].StockStart)/data[x].StockStart)*100).toFixed(2) + "%<br>";
				str += "Date Range: " + new Date(data[x].FollowingDate).toDateString() + " to " + new Date(data[x].EndDate).toDateString() + "<br><br>";
				$("#oldyields").append(str);
				arr.push((data[x].StockEnd - data[x].StockStart)/data[x].StockStart);
			}
		}
		var avg = 0;
		for (var x = 0; x < arr.length; x++) {
			avg += arr[x];
		}
		$("#avgyield").html(((avg/arr.length) * 100).toFixed(2));
	});
}