function checkEmail() {
var email = document.getElementById('editemail');
var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
if (!filter.test(email.value)) {
alert('Please provide a valid email address');
email.focus;
}
return filter.test(email.value);
}

var updatedetails = document.getElementById("updatedetails");
updatedetails.addEventListener('submit',function(event){
	event.preventDefault();
	if (document.getElementById("oldpass").value.length < 1) 
		alert("Please enter your old password");
	else if (document.getElementById("editname").value.length < 1) 
		alert("Sorry, you cannot have no name on Inqora");
	else if (document.getElementById("editemail").value.length < 1)
		alert("If you don't want to enter a email, press 'Cancel Edit'");
	else if (checkEmail() == false);
	else {
		var data = {
			OldPassword: document.getElementById("oldpass").value,
			NewName: document.getElementById("editname").value,
			NewEmail: document.getElementById("editemail").value
		}
		if($("#editpassword").val().length < 2) 
			data['EditPassword'] = document.getElementById("oldpass").value;
		else
			data['EditPassword'] = document.getElementById("editpassword").value;
		if ($('#newpicstuff').is(':visible')) {
			data['Thumbnail'] = document.getElementById("thumbnail").toDataURL();
			data['Picture'] = document.getElementById("picture").toDataURL();
		}
		else
			data['Thumbnail'] = data['Picture'] = "";
		$.ajax({
			type: "POST",
			url: getLocalhost() + "/accounts/updateuser",
			data: data,
			success:function(res) {
				alert(res);
				if (res.toLowerCase() == "success") {
					$("#accountsettingsbuttonclose").click();
					$("#changename").show();
	$("#nameedit").show();
	$("#editname").hide();
	$("#undoname").hide();
	$("#imageedit").show();
		$("#changepicture").show();
		$("#newpicstuff").hide();
		$("#imagecancel").hide();
		$("#changepassword").show();
		$("#passwordedit").show();
		$("#editpassword").hide();
		$("#undopassword").hide()
		$("#changeemail").show();
	$("#emailedit").show();
	$("#editemail").hide();
	$("#undoemail").hide();
	getUserData();
				}
			},
			xhrFields: {withCredentials: true},
			error:function(){
				console.log("ERROR");
			}
		});
	}



});


document.getElementById("inputFileToLoad").onchange = function () {
  var filesSelected = document.getElementById("inputFileToLoad").files;
  if (filesSelected.length > 0) {
    var fileToLoad = filesSelected[0];
    var fileReader = new FileReader();
    var x  = document.getElementById("uploadFile");
    x.value = fileToLoad.name;
    if( isImage(fileToLoad.name) == false) {
      alert("Please upload an image");
    }
    else {
      fileReader.onload = function(fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64
        alert("Image uploaded");

        var canvas = document.getElementById('picture');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        var imageObj = new Image();
        imageObj.src = srcData;
        imageObj.onload = function() {
          context.drawImage(imageObj, 0,0, 150, imageObj.height * (150/imageObj.width));
          //canvas.toDataURL();
        };

        var thumbnail = document.getElementById("thumbnail");
        var contx = thumbnail.getContext("2d");
        contx.clearRect(0, 0, thumbnail.width, thumbnail.height);
        var thumbimg = new Image();
        thumbimg.src=srcData;
        thumbimg.onload = function () {
          contx.drawImage(thumbimg, 0,0, 30, thumbimg.height * (30/thumbimg.width));
        };
      }
    }
    fileReader.readAsDataURL(fileToLoad);
  }
};



		// Oldpassword: oldpass
// New Name: editname
// New Email: editemail
// New password: editpassword
	//If editpassword is empty, then user doesnt wanna change password
// Picture:thumbnail & picture
	/// If newpicstuff is not visible, then don't send a new profile picture or thumbnail



getUserData();
function getUserData () {
	$.ajax({
			type: "GET",
			url: getLocalhost() + "/accounts/getsess",
			data: {
			},
			success:function(data) {
				$("#changename").html(data.Name);
				$("#editname").val($("#changename").html());
				$("#changeemail").html(data.Email);
				$("#editemail").val($("#changeemail").html());
				$("#changepicture").attr("src", data.Picture);
				var canvas = document.getElementById('picture');
	var context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	var imageObj = new Image();
	imageObj.src = data.Picture;
	imageObj.onload = function() {
		context.drawImage(imageObj, 0,0, 150, imageObj.height * (150/imageObj.width));
		//canvas.toDataURL();
	};
			},
			xhrFields: {withCredentials: true},
			error:function(){
				console.log("ERROR");
			}
		});
}
$( "#nameedit" ).click(function() {
	$("#changename").hide();
	$("#nameedit").hide();
	$("#editname").show();
	$("#undoname").show();
	$("#undoname").click(function() {
		$("#editname").val($("#changename").html());
	});
});

$("#imageedit").click(function() {
	$("#imageedit").hide();
	$("#changepicture").hide();
	$("#newpicstuff").show();
	$("#imagecancel").show();
	$("#imagecancel").click(function () {
		$("#imageedit").show();
		$("#changepicture").show();
		$("#newpicstuff").hide();
		$("#imagecancel").hide();
	});
});
$( "#emailedit" ).click(function() {
	$("#changeemail").hide();
	$("#emailedit").hide();
	$("#editemail").show();
	$("#undoemail").show();
	$("#undoemail").click(function() {
		$("#editemail").val($("#changeemail").html());
	});
});
$( "#passwordedit" ).click(function() {
	$("#changepassword").hide();
	$("#passwordedit").hide();
	$("#editpassword").show();
	$("#editpassword").attr("Placeholder", "New password");
	$("#undopassword").show();
	$("#undopassword").click(function() {
		$("#changepassword").show();
		$("#passwordedit").show();
		$("#editpassword").hide();
		$("#undopassword").hide()
	});
});




function resetUploadPics() {
	pictdata = "data:image/png;base64,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";
        thumbdata = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABgUlEQVRIS+2Vu06EUBCG93BpDY2x1s7KYmsfwcLKzpJLSHgGYoIPAELobSz0BWxN7Ky0sFELS2KjnQbwP5ucDXsB5sDKxmRpKDgz35n5/xnYaE0PWxN39H/AYRhuq6rqVjr147puINs5qYrjOPbrAIDXflsWszIwTy4DJ4ObqhUVbcBNhltpq2V03oBrZaG4WtO0e8uybinLhNxqnqwN/ifj1AbGGi1s2z6jVMvPkCtOkmRcluVRU2JFUa4dx3miwEngKIpOkHSfkpA6UgvgNE0P8jw/bvoZzGvNtV2mP2PsAx24wLuczzcDbjMPD0blL0h2id/jlud5nyIhJTbLsnPf978XNKYE8yBofYcqDkVbqXFVGaQrrsLE+PQCB0GwYxiGQzEQPPCA8Rnruv5smuZVL7BMMOVyTeac0XgoMNbqDdbq41TjocDCIxNwVyjc/QZ378q2npuyMxjz/AVoBqPtDQoG8BXOloZOW40Vedrl1rJVVs8XRfHOuurbB8xjfwEspbd6SaP4BQAAAABJRU5ErkJggg==";

	var canvas = document.getElementById('picture');
	var context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	var imageObj = new Image();
	imageObj.src = pictdata;
	imageObj.onload = function() {
		context.drawImage(imageObj, 0,0, 150, imageObj.height * (150/imageObj.width));
		//canvas.toDataURL();
	};

	var thumbnail = document.getElementById("thumbnail");
	var contx = thumbnail.getContext("2d");
	contx.clearRect(0, 0, thumbnail.width, thumbnail.height);
	var thumbimg = new Image();
	thumbimg.src=thumbdata;
	thumbimg.onload = function () {
		contx.drawImage(thumbimg, 0,0, 30, thumbimg.height * (30/thumbimg.width));
	};
}