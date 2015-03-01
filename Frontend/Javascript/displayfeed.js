

function displayAll(data, maindiv, adddiv) {
	var checkspan = startIt(adddiv);
	recursiveDisplay(data, maindiv, checkspan, 0);
}

function recursiveDisplay(data, maindiv, checkspan, x){ 
	if (x == data.length)
		setFinished(checkspan);
	else if (isElementInViewport($("#checkspan"))) {
		createPost(data[x], maindiv, null, function () {
			recursiveDisplay(data, maindiv, checkspan, x+1);
			
			
		});
	}
	else {
		$(window).one("scroll", function(ev) {
			recursiveDisplay(data, maindiv, checkspan, x);
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