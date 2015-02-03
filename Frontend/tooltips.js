function loadToolTips (mainobj, obj, data) {
	$(obj).on("mouseover", function(ev){
		ev.preventDefault();
		$('.tooltips').find('span').remove();
		$('.tooltips').append("<span>" +data + "</span>");
		$('.tooltips:not([tooltip-position])').attr('tooltip-position','bottom');
	});
}

function makeToolTip(maindiv, classAdd, innerHTML, link, username) {
	var whoposted = $("<p>").addClass("tooltips " + classAdd).attr({"name" : username, 'tooltip-position': "top", 'tooltip-type': "primary" , "tooltip" : "One moment please..."}).appendTo(maindiv);
	callAJAX("GET", "/getusertooltip", {Username: username}, function (data2){
		$(whoposted).attr("tooltip", data2);
		$(whoposted).attr("name", username);
		var spanlink = $("<a>").attr("href" , link).css("display", "inline").css("padding", "0").html(innerHTML).appendTo(whoposted);
	});
}

	$(document).on("mouseover", ".tooltips", function(ev){
		ev.preventDefault();
		if ($(this).attr("tooltip").indexOf("One moment please...") != -1) {
			var button = this;
			callAJAX("GET", "/getusertooltip", {Username: $(this).attr("name")}, function (data2){
				$(button).attr("tooltip", data2);
			});
		}
		$('.tooltips').find('span').remove();
		$('.tooltips').append("<span>" +$(this).attr("tooltip") + "</span>");
		$('.tooltips:not([tooltip-position])').attr('tooltip-position','bottom');
	});