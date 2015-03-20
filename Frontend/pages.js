//index.html - Page 1
//postinginfo.html - Page 2

$(document).on("click", "a", function (ev) {
	if ($(this).attr("href") == null || $(this).attr("href") == "") {
		ev.preventDefault();
		switch($(this).attr("id")) {
			case "page1":
				window.location = "index.html";
				break;
			case "page2": 
				window.location = "postinginfo.html";
				break;
			case "page3": 
				window.location = "pageinfo.html";
				break;
			default:
				window.location = "login.html";
		}
	}
});