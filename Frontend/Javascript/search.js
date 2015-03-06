

   function logout() {
        $.ajax({
          type: "GET",
          url: getLocalhost() + "/logout",
          data: {
          },
          success:function(data) {
            if (data.trim() == "Session destroyed") {
              window.location.reload();
            }
            else
               window.location.assign("newsfeed.html");
          },
          xhrFields: {withCredentials: true},
          error:function(){
            console.log("ERROR");
          }
        });
       
    }

function showName () {
  var project = document.getElementById("project");
  project.disabled = true;
  $.ajax({
    type: "GET",
    url:  getLocalhost() + "/companygroup/getSearch",
    success:function(data) {
      project.disabled = false;
      for (var x =0; x  < data.length; x++) {
        if (data[x].Type == "User")
          data[x].value =  (data[x].Name + "(@" + data[x].Username + ")");
        else 
          data[x].value =  (data[x].Name + "(@" + data[x].Username + ")");
       
      }
      search(data);
    },
    error:function(){
      console.log("ERROR");
    }
  });
}

 function search(data) {
    $( "#project" ).autocomplete({
      minLength: 1,
      source:  function(request, response) {
        var results = $.ui.autocomplete.filter(data, request.term);

        response(results.slice(0, 5));
    },
      autoFocus: true,
      noResults: 'Sorry, no results found',
        select: function( event, ui ) {
           if (ui.item.Type.toLowerCase() == "company")
            window.location = "companypage.html?id=" + ui.item.Username;
        if (ui.item.Type.toLowerCase().trim() == "group") 
             window.location = "grouppage.html?id=" + ui.item.Username;
        if (ui.item.Type.toLowerCase() == "user")
            window.location="userpage.html?id=" + ui.item.Username;
        },

delay: 0,
        focus: function( event, ui ) {
           $("#project").autocomplete("option", "delay", 0);
           if (ui.item.Type.toLowerCase() == "company")
             window.href = "companypage.html?id=" + ui.item.Username;
        if (ui.item.Type.toLowerCase().trim() == "group") 
             window.href = "grouppage.html?id=" + ui.item.Username;
        if (ui.item.Type.toLowerCase() == "user")
            window.href="userpage.html?id=" + ui.item.Username;
        }

    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      var link = document.createElement("a");
        link.stycolor = "black";
      	link.height="100%";
      	link.width="100%";
      	link.className = "linker";
      	link.style.height = ul.height;
      	link.style.width = ul.width;
        if (item.Type.toLowerCase() == "company")
            link.href = "companypage.html?id=" + item.Username;
        if (item.Type.toLowerCase().trim() == "group") 
            link.href = "grouppage.html?id=" + item.Username;
        if (item.Type.toLowerCase() == "user")
           link.href="userpage.html?id=" + item.Username;
        var image = document.createElement("img");
        image.className = "icon";
       getThumbnail(item, image);
        link.appendChild(image);

        var label = document.createElement("span");
        label.className = "label";
        label.innerHTML = item.label + "<br>";
        label.height="100%";
        label.width="100%";
        link.appendChild(label);

        var type = document.createElement("span");
        type.className = "label";
        type.innerHTML =  item.Type;
        link.appendChild(type);

      return $( "<li>" )
        .append(link)
        .appendTo( ul );
    };
  }

  function getThumbnail (item, image) {
    //image.src = getLocalhost() + "/companygroup/getThumbnailAct?Username=" + item.Username;
    $(image).addClass("getThumbnailClassButton").attr("name", item.Username);
    callAJAX("GET", "/companygroup/getThumbnail", {Username: $(image).attr("name")}, function (data) {
      $(image).attr("src", data);
    });
  }