callAJAX("GET", "/companygroup/getSearch", {}, function (searchres) {
		var textarea = document.getElementById("newpost");
		var arr = [];
		for (var x = 0 ;x  < searchres.length; x++) {
			var img = "<img src='"+getLocalhost()+ "/companygroup/getThumbnailAct?Username=" + searchres[x].Username +  "'>";
			arr.push(img + " " + searchres[x].Name + " (@"  + searchres[x].Username + ") - " + searchres[x].Type);
		}
		$(textarea).textcomplete([
		    { // html
		        mentions: arr,
		        match: /\B@(\w*)$/,
		        search: function (term, callback) {
		            callback($.map(this.mentions, function (mention) {
		                return mention.toLowerCase().indexOf(term.toLowerCase()) != -1 ? mention : null;
		            }));
		        },
		        index: 1,
		        replace: function (mention) {
		            return '@' + mention.substring(mention.indexOf("(@") + 2, mention.indexOf(") - ")) + ' ';
		        }
		    }
		], { appendTo: 'body' }).overlay([
		    {
		        match: /\B@\w+/g,
		        css: {
		            'background-color': '#d8dfea'
		        }
		    }
		]);
	});




function newPost (autotag, maindiv) {
	var section = $("<section>").addClass("post head card viewpost").appendTo(maindiv);
		var span = $("<span>").css("font-size", "1.5em").html("<center>New Post</center>").appendTo(section);
		var hr = $("<hr>").css("margin", "5px").appendTo(section);
		var form = $("<form>").addClass("pure-form").appendTo(section);
			var input  = $("<input>").attr("type", "text").attr("placeholder", "Post Title").addClass("newposttitle").appendTo(form);
			var textarea = $("<textarea>").addClass("newpostcontent").attr("id", "newpost").attr("placeholder", "Whats on your mind?").appendTo(form);
	var str = "";
	for (var x =0; x < autotag.length; x++) 
		str += "@" + autotag[x] + " ";
	var div = $("<div>").addClass("autotag").html("Automatically Tagged: " + linkify(str)).appendTo(form);
	var button = $("<input>").addClass("pure-button pure-button-primary").css("width","100%").attr("type","submit").val("Share Thoughts").appendTo(form).css("margin-top", "10px");
	$(form).on("submit", function (ev) {
		ev.preventDefault();
		var obj = {
			Content: $("#newpost").val(),
			Tags: autotag,
			Title: $(".newposttitle").val()
		};
		callAJAX("POST", "/posting/create/new", obj, function (data) {
			$(".newposttitle").val("");
			$("#newpost").val("")
			createPost(data, section, true);
			alert("Post created");
		});
	});
}

function newPostNewsFeed (autotag, maindiv) {
	var section = $("<section>").addClass("post head card viewpost").appendTo(maindiv);
		var span = $("<span>").css("font-size", "1.5em").html("<center>New Post</center>").appendTo(section);
		var hr = $("<hr>").css("margin", "5px").appendTo(section);
		var form = $("<form>").addClass("pure-form").appendTo(section);
			var input  = $("<input>").attr("type", "text").attr("placeholder", "Post Title").addClass("newposttitle").appendTo(form);
			var textarea = $("<textarea>").addClass("newpostcontent").attr("id", "newpost").attr("placeholder", "Whats on your mind?").appendTo(form);
	var div = $("<div>").addClass("autotag").html("Tag user, companies and groups. Try " + linkify("@AAPL")).appendTo(form);
	var button = $("<input>").addClass("pure-button pure-button-primary").css("width","100%").attr("type","submit").val("Share Thoughts").appendTo(form).css("margin-top", "10px");
	$(form).on("submit", function (ev) {
		ev.preventDefault();
		var obj = {
			Content: $("#newpost").val(),
			Tags: [],
			Title: $(".newposttitle").val()
		};
		callAJAX("POST", "/posting/create/new", obj, function (data) {
			$(".newposttitle").val("");
			$("#newpost").val("")
			createPost(data, section, true);
			alert("Post created");
		});
	});
}
