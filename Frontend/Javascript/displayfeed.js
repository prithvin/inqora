function displayAll (data, maindiv, adddiv) {
	console.log(data.length);

	var length = 3;
	if (length > data.length)
		length = data.length;
	var checkspan = startIt(adddiv);
	for (var x =0; x < length; x++) 
		createPost(data[x], maindiv);


	if (length >= data.length) {
		console.log("LOOOOOL");
		setFinished (checkspan);
	}

	scrollerCheck(checkspan, data,maindiv,length);
}

function scrollerCheck (checkspan, data, maindiv, length) {
	$(window).on("scroll", function(evt) {
		if ($(checkspan).isOnScreen() && length < data.length) {
			createPost(data[length], maindiv);
			length++;
			$(this).off(evt);
			setTimeout(scrollerCheck(checkspan, data, maindiv, length+1), 300);
		}
		else if(length >= data.length) {
			setFinished (checkspan)
		}
	});		
}

function setFinished (checkspan) {
	$(checkspan).html("<center><i class='fa fa-frown-o' style='font-size:2.25em;'></i><br>Looks like there are no more posts to show :(. Check out some other companies, users and groups for more investment ideas!</center>");
}
function startIt (maindiv) {
	return $("<span>").attr("id", "checkspan").appendTo(maindiv).addClass("checkspan").html("<center><div class='spinner-cube'> <div></div><div></div> </div> 	<p style='text-align:center;''> Fetchin' some data... </p></center>");
}

$.fn.isOnScreen = function(){
    
    var win = $(window);
    
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
    
    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();
    
    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
 
};
