function taggingEnableThing () {
	callAJAX("GET", "/companygroup/getSearchNotPrivateGroups", {}, function (searchres) {
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
}


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
			alert("Oops! Looks like you forgot to write a post");
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
	taggingEnableThing();
}

var calculateContentHeight = function( ta, scanAmount ) {
    var origHeight = ta.style.height,
        height = ta.offsetHeight,
        scrollHeight = ta.scrollHeight,
        overflow = ta.style.overflow;
    /// only bother if the ta is bigger than content
    if ( height >= scrollHeight ) {
        /// check that our browser supports changing dimension
        /// calculations mid-way through a function call...
        ta.style.height = (height + scanAmount) + 'px';
        /// because the scrollbar can cause calculation problems
        ta.style.overflow = 'hidden';
        /// by checking that scrollHeight has updated
        if ( scrollHeight < ta.scrollHeight ) {
            /// now try and scan the ta's height downwards
            /// until scrollHeight becomes larger than height
            while (ta.offsetHeight >= ta.scrollHeight) {
                ta.style.height = (height -= scanAmount)+'px';
            }
            /// be more specific to get the exact height
            while (ta.offsetHeight < ta.scrollHeight) {
                ta.style.height = (height++)+'px';
            }
            /// reset the ta back to it's original height
            ta.style.height = origHeight;
            /// put the overflow back
            ta.style.overflow = overflow;
            return height;
        }
    } else {
        return scrollHeight;
    }
}

function calculateHeight() {
    var ta = document.getElementById("newpost"),
        style = (window.getComputedStyle) ?
            window.getComputedStyle(ta) : ta.currentStyle,

        // This will get the line-height only if it is set in the css,
        // otherwise it's "normal"
        taLineHeight = parseInt(style.lineHeight, 10),
        // Get the scroll height of the textarea
        taHeight = calculateContentHeight(ta, taLineHeight),
        // calculate the number of lines
        numberOfLines = Math.ceil(taHeight / taLineHeight);
        return taHeight;

};




function getTags (words) {
	if ( words.match(/@[\w]+(?=\s|$)/g) == null)
		return [];
	else {
		var arr = words.match(/@[\w]+(?=\s|$)/g);
		for (var x =0; x < arr.length; x++) {
			arr[x] = arr[x].substring(1);
		}
		return arr;
	}
}

$(document).on("keypress keyrelase keydown keyup", "#newpost" ,  function (e) {

	if(e.keyCode==13) {
		//e.preventDefault();
		//$("#newpost").val($("#newpost").val() + " \n");
		
	}
	console.log(calculateHeight());
	$(this).height(calculateHeight());
})

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
			alert("Oops! Looks like you forgot to write a post");
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
			$(".newposttitle").val("");
			$("#newpost").val("")
			callAJAX("POST", "/posting/create/new", obj, function (data) {
				createPost(data, section, true);
				alert("Post created");
			});
		}
	});
	taggingEnableThing();
}
