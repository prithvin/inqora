function isCurrentlyHeld (data) {
	for (var x=0;x < data.length;x++) {
		if (parseInt(data[x].StockEnd) == -1) 
			return "(Currently Held)";
	}
	return "";
}
function averageCalculator (data) {
	var sum = 0.0;
	for (var x =0; x < data.length; x++) {
		if (data[x].StockEnd == -1)
			sum += parseFloat(((((parseFloat(data[x].CurrentPrice) - parseFloat(data[x].StockStart))/parseFloat(data[x].StockStart))*100.0).toFixed(5)));
		else 
			sum += parseFloat(((((parseFloat(data[x].StockEnd) - parseFloat(data[x].StockStart))/parseFloat(data[x].StockStart))*100.0).toFixed(5)));
		console.log(sum);
	}
	console.log(sum);
	return (sum/data.length).toFixed(2);
}
function displayData(maindiv, data) {
	var title1 = $("<b>").html("Current Holdings");
	var div1 = $("<div>").addClass("link").css("margin-left", "20px");
	if (isCurrentlyHeld(data) != "") {
		$(maindiv).append(title1).append(div1);
	}	
	var title2 = $("<b>").html("<br>Previous Holdings").appendTo(maindiv);
	var div2 = $("<div>").addClass("link").css("margin-left", "20px").appendTo(maindiv);

	for (var x = 0; x < data.length; x++) {
		var str = "Initial Price: $" + data[x].StockStart.toFixed(2) + "<br>";
		console.log(data[x].CurrentPrice);
		if (data[x].CurrentPrice != null && data[x].CurrentPrice != -1) {
			str += "Current Price: $" + data[x].CurrentPrice.toFixed(2) + "<br>";
			str += "Percent Change: " + (((data[x].CurrentPrice - data[x].StockStart)/data[x].StockStart)*100).toFixed(2) + "%<br>";
			str += "Held Since: " + new Date(data[x].FollowingDate).toDateString() + "<br>";
			$(div1).append(str);
		}
		else {
			str += "Final Price: $" + data[x].StockEnd.toFixed(2) + "<br>";
			str += "Percent Change: " + (((data[x].StockEnd - data[x].StockStart)/data[x].StockStart)*100).toFixed(2) + "%<br>";
			str += "Date Range: " + new Date(data[x].FollowingDate).toDateString() + " to " + new Date(data[x].EndDate).toDateString() + "<br><br>";
			$(div2).append(str);
		}
	}
}
function updatePortfolio (id) {

	callAJAX("GET", "/stockgame/allcompanydata", {Username: id}, function (data) {
		$("#portfolioviewport").html("");
		var ul = $("<div>").addClass("accordion");
		$("#portfolioviewport").append(ul);
		for (var x =0; x < data.length; x++) {
			var li = $("<span>").appendTo(ul).addClass("accordionspan");
				var ahtml = data[x].CompanyName + " (" + linkify("@" + data[x].CompanyUsername) + ")<br>";
				ahtml += data[x].RestData.length + " Buys " + isCurrentlyHeld(data[x].RestData) + "<br>";
				ahtml += "Avg Return: " + averageCalculator(data[x].RestData) + "%";
				var a = $("<a>").html(ahtml).appendTo(li).addClass("accordiona");
				var p =$("<p>").css("margin-left", "10px").appendTo(li).addClass("accordionspanp");
				displayData(p, data[x].RestData);
		}


	});
}

(function($) {
    
    $(document).on("click", '.accordion a' , function(j) {
        var dropDown = $(this).closest('.accordionspan').find('.accordionspanp');
        $(this).closest('.accordion').find('.accordionspanp').not(dropDown).slideUp();

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).closest('.accordion').find('a.active').removeClass('active');
            $(this).addClass('active');
        }

        dropDown.stop(false, true).slideToggle();

        j.preventDefault();
    });
})(jQuery);