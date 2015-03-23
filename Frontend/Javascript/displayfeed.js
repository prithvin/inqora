function createAds (callback) {
	$.getScript( "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", function () {
		var ins1 = $("<ins>").addClass("adsbygoogle");
			$(ins1).css("display", "block");
			$(ins1).attr("data-ad-client", "ca-pub-9677727304103774");
			$(ins1).attr("data-ad-slot", "8172632649");
			$(ins1).attr("data-ad-format", "auto");
		var ins2 = $("<ins>").addClass("adsbygoogle");
			$(ins2).css("display", "block");
			$(ins2).attr("data-ad-client", "ca-pub-9677727304103774");
			$(ins2).attr("data-ad-slot", "8033031840");
			$(ins2).attr("data-ad-format", "auto");
		$("body").append(ins1).append(ins2);
		(adsbygoogle = window.adsbygoogle || []).push({})
		callback(ins1, ins2);
	});
}

function displayAll(data, maindiv, adddiv) {
	var checkspan = startIt(adddiv);
	(adsbygoogle = window.adsbygoogle || []).push({});
	createAds(function (ins1, ins2) {
		recursiveDisplay(data, maindiv, checkspan, 0, true, ins1, ins2);
	});
	
}

function recursiveDisplay(data, maindiv, checkspan, x, booltr, ins1, ins2){ 

	if (x == data.length)
		setFinished(checkspan);
	else if (isElementInViewport($("#checkspan")) || booltr == false) {
		createPost(data[x], maindiv, null, function (booltr) {
			if (x%3 == 0) {
				console.log("Appending");
				$(maindiv).append(ins1);
			}
			else if (x%5 == 0) {
				$(maindiv).append(ins2);

			}
			recursiveDisplay(data, maindiv, checkspan, x+1, booltr, ins1, ins2);
			
			
		});
	}
	else {
		$(window).one("scroll", function(ev) {
			recursiveDisplay(data, maindiv, checkspan, x, true, ins1, ins2);
		});
	}
}


function setFinished (checkspan) {
	$(checkspan).html("<center><i class='fa fa-frown-o' style='font-size:2.25em;'></i><br>Looks like there are no more posts to show :(. Check out some other companies, users and groups for more investment ideas!</center>");
}
function startIt (maindiv) {
	return $("<span>").attr("id", "checkspan").appendTo(maindiv).addClass("checkspan");
}

function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

/*
function scrollerCheck (checkspan, data, maindiv, length) {
	$(window).on("scroll", function(evt) {
		if ($(checkspan).isOnScreen() && length < data.length) {
			createPost(data[length], maindiv);
			length++;
		}
		else if(length >= data.length) {
			setFinished (checkspan)
		}
	});		
}

function displayAll (data, maindiv, adddiv) {
	var length = 3;
	if (length > data.length)
		length = data.length;
	
	for (var x =0; x < length; x++) 
		createPost(data[x], maindiv);


	if (length >= data.length) {
		setFinished (checkspan);
	}

	scrollerCheck(checkspan, data,maindiv,length);
}
*/