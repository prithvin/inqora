$('#messagingmodal').on('hidden.bs.modal', function () {
    $("#thistitleformodalmessaging").html("Messaging");
});


function setUser (user) {
	$("#thistitleformodalmessaging").html("Messaging with " + user);
	var messages = document.getElementById("messages");
	messages.innerHTML = "";
	setListener(user);
	messageFunction(user,0, messages, false);
	$(".regularmessage").removeClass("currentmessage");
	$("#" + user + "-messaging").addClass("currentmessage");
}
function convertTime (time) {
	if (time == undefined) {
		return 2;
	}
	else {
		var oldtime = new Date(time);
		var curtime = new Date();
		if ((oldtime.getDate() - curtime.getDate()) > 0) {
			return oldtime.getMonth() + oldtime.getDate();
		}
		else {
			return formatAMPM(oldtime);
		}
	}
}
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function getList () {
	$(document).on("click" , ".regularmessage" , function (ev) {
		ev.preventDefault();
		setUser($(this).attr("name"));
	});
	$("#messagelist").html("");
	callAJAX ("GET", "/messaging/getinbox", {}, function (data) {
		for (var x =0;x < data.length; x++) {


			var maintable = $("<table>").addClass("regularmessage").appendTo("#messagelist").attr("name", data[x].Username).attr("id", data[x].Username + "-messaging");
			var table = $("<tr>").appendTo(maintable);
			var td1 = $("<td>").appendTo(table).css("width", "38px");
			var image = $("<img>").appendTo(td1);
			$(image).addClass("getThumbnailClassButton").attr("name", data[x].Username);
			setImage(image);
		   
			var td2 = $("<td>").addClass("innertdmessage").appendTo(table);
				var span =$("<span>").css("float", "right").html(convertTime(data[x].Time)).appendTo(td2);
				var b = $("<b>").html(data[x].Name + "<br>" + "(" + ("@" + data[x].Username) + ")<br>").appendTo(td2);
				var span2 = $("<span>").css("float", "right").css("color", "#4183D7").appendTo(td2);
				if (data[x].New == true) {
					$(table).addClass("newmessage")
					$(span2).html("New");
				}
			$("#messagelist").append("<hr style='margin:0;padding:0;''>");
		}
	});
	
}
function setListener(usr) {
	$( "#messager").unbind( "submit" );
	$( "#messager").unbind( "keypress" );
	$( "#messager" ).submit(function(event){
		event.preventDefault();
		if (document.getElementById("textinputm").value.length == 0)
			alert("Please write a message to send a message");
		else {
			var content = document.getElementById("textinputm").value;
			document.getElementById("textinputm").value = "";
			$.ajax({
				type: "POST",
				url: getLocalhost() + "/messaging/new",
				data: {
					Username: usr,
					Message: content
				},
				success:function(data) {
					alert(data);
					if (data == "Message Sent. Thanks for starting a conversation and helping the Inqora community!")
						messageFunction(usr, 0, document.getElementById("messages"));
				},
				xhrFields: {withCredentials: true},
				error:function(){
				console.log("ERROR");
				}
			});
		}
	});
	$("#messager").keypress(function (e) {
		if(e.keyCode==13 && e.shiftKey == false) {
			var content = document.getElementById("textinputm").value;
			document.getElementById("textinputm").value = "";
			$.ajax({
				type: "POST",
				url: getLocalhost() + "/messaging/new",
				data: {
					Username: usr,
					Message: content
				},
				success:function(data) {
					alert(data);
					if (data == "Message Sent. Thanks for starting a conversation and helping the Inqora community!")
						messageFunction(usr, 0, document.getElementById("messages"));
				},
				xhrFields: {withCredentials: true},
				error:function(){
				console.log("ERROR");
				}
			});
		}
	});
}

function messageFunction (otheruser, num, messages, hasstarted) {
	if ($("#thistitleformodalmessaging").html().indexOf(otheruser) != -1) {
		$.ajax({
			type: "GET",
			url: getLocalhost() + "/messaging/getbyusername",
			data: {
				Username: otheruser
			},
			timeout: 5000,
			success:function (data) {
				num = document.getElementsByClassName("lolmessage").length;
				var chat = data.Chat;
				for (var x =num; x < chat.length;x++) {
					newMessage(chat[x].ByYou, chat[x].Message, messages);
					addLineBreak(messages);
					addLineBreak(messages);
					messages.scrollTop = messages.scrollHeight;
				}
				if (isHidden(messages) && hasstarted == false && data != null)
					setTimeout(messageFunction(otheruser, chat.length, messages, false), 700);
				else if (isHidden(messages) && hasstarted == false)
					setTimeout(messageFunction(otheruser, 0, messages, false), 700);
				else if (!isHidden(messages) && data != null)
					setTimeout(messageFunction(otheruser, chat.length, messages, true), 700);
				else if (!isHidden(messages))
					setTimeout(messageFunction(otheruser, 0, messages, true) , 700);
				else {
				}
			},
			xhrFields: {withCredentials: true},
			error: function () { 
				console.log("ERROR");
			}
		});
	}
}

function isHidden(el) {
    return (el.offsetParent === null)
}

function newMessage (fromme, message, maindiv) {
	var newdata = document.createElement("div");
	if (fromme)
		newdata.className = "from-me lolmessage";
	else
		newdata.className = "from-them lolmessage";
	var content = document.createElement("p");
	content.innerHTML = message;
	newdata.appendChild(content);
	maindiv.appendChild(newdata);
}

function addLineBreak (maindiv) {
	var linebreak = document.createElement("div");
	linebreak.className = "clear";
	maindiv.appendChild(linebreak);
	var br = document.createElement("br");
	maindiv.appendChild(br);
	var br = document.createElement("br");
	maindiv.appendChild(br);
}