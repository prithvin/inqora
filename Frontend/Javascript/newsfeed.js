function showUser() {

		getSubs();
		getFollowers();
		updatePortfolio (null, function () {
			callAJAX("GET", "/accounts/pointval", {}, function (data) {
				$("#pts-numinvites").html(data.Invites);
				$("#pts-numfollowers").html(data.FollowedBy);
				$("#pts-numposts").html(data.NumPosts)
				$("#pts-numtotlikes").html(data.LikesOnPost);
				$("#pts-numtotcomments").html(data.CommentsOnPost);
				$("#pts-numymcomments").html(data.NumCommentMade);
				$("#pts-numlikecom").html(data.LikesOnMyComments);
				var returns = document.getElementsByClassName("avgreturna");
				var total = 0;
				for (var x =0;x < returns.length; x++) {
					console.log(returns[x].innerHTML);
					total += parseInt(returns[x].innerHTML);
				}
				var avg =total/returns.length;
				console.log("AVERAGE" + total + " / " +  returns.length )
				$("#pts-gainstock").html(avg.toFixed(2));

				var totalpts = (data.Invites * 20) + (data.FollowedBy * 3) + (data.NumPosts  * 0) + (data.LikesOnPost * 1) + (data.CommentsOnPost * 2);
				totalpts += (data.LikesOnMyComments * 1) + (avg * 3);
				console.log(totalpts);
				$("#totpointsto").html(totalpts.toFixed(2));
			});
		});
}