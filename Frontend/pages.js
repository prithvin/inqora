//index.html - Page 1
//postinginfo.html - Page 2

$(document).on("click", "a", function (ev) {
	ev.preventDefault();
	switch($(this).attr("id")) {
		case "page1":
			window.location = "index.html";
			break;
		case "page2": 
			window.location = "postinginfo.html";
			break;
		default:
			window.location = "index.html";
	}
});