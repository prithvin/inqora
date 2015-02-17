var users = ["curt", "stonemason", "fullofcrap", "yesno", "vicki", "beefboy", "kokikola", "llcoolg", "thecommonman", "elias", "browny", "donchez", "abe", "newage", "mossy", "boglehead", "crazyt", "nick", "yungfree", "tacoman", "coolio", "nik", "div", "handyman", "reeve" , "curryboy", "bubblyhon", "doubletake", "kansas2"];

callAJAX("GET", "/automate/getdataplustitle", {URL: website}, function (data) {
	callAJAX("GET", "/automate/getindustry", {Name: company}, function (industry) {
		var title = data.Title;
		var content = data.Summary + " @" + industry;
		var usernameofposter = users[parseInt(Math.random() * users.length)];
		var timeposted = new Date(parseInt(getRandomArbitrary(1423792800000, new Date().getTime())));
		var tags = [company];
		var whoupvoted = getPeople(7, []);
		var downvoted = getPeople(7, []);
	});
});
function getPeople (num, notfrom) {
	var arr = [];
	var randnum = parseInt(num * Math.random()) + 1;
	while (arr.length != randnum) {
		var randindex = parseInt(users.length * Math.random());
		if (arr.indexOf(users[randindex]) == -1 && notfrom.indexOf(users[randindex]) == -1) {
			arr.push(users[randindex]);
		}
	}
	return arr;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}