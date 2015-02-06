callAJAX("GET", "/companygroup/getSearch", {}, function (searchres) {
		var textarea = document.getElementById("newpost");
		var arr = [];
		for (var x = 0 ;x  < searchres.length; x++) {
			var img = "<img style='margin:0;padding:0;position:relative;left:0;margin-right:5px;' src='"+getLocalhost()+ "/companygroup/getThumbnailAct?Username=" + searchres[x].Username +  "'>";
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
		if ($("#newpost").val().trim() == "") {
			alert("Oops! Looks lie you forgot to write a post");
		}
		else if ($(".newposttitle").val().trim() == "") {
			alert("Please title your post");
		}
		else {
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
		}
	});
}

function getTags (words) {
    var tmplist = words.split(' ');
    var hashlist = [];
    var nonhashlist = [];
    for(var w in tmplist){
        if(tmplist[ w ].indexOf('@') == 0)
            hashlist.push(tmplist[ w ].substring(1));
        else
            nonhashlist.push(tmplist[ w ]);
    }
    return hashlist;
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
		if ($("#newpost").val().trim() == "") {
			alert("Oops! Looks lie you forgot to write a post");
		}
		else if(getTags($("#newpost").val().trim()).length == 0) {
			alert("Please tag 1 or more companies, groups and users.");
		}
		else if ($(".newposttitle").val().trim() == "") {
			alert("Please title your post");
		}
		else {
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
		}
	});
}
