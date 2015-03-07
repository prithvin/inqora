$(function () {
var date_today = new Date();
var time_now = date_today.getTime();
date_today.setTime(time_now);
var the_hour = date_today.getHours();

if (the_hour == 23)
	$('body').css({'background-color': '#dddddd'});
else if (the_hour == 22)
	$('body').css({'background-color': '#dfdfdf'});
else if (the_hour == 21)
	$('body').css({'background-color': '#e1e1e1'});
else if (the_hour == 20)
	$('body').css({'background-color': '#e3e3e3'});
else if (the_hour == 19)
	$('body').css({'background-color': '#e5e5e5e'});
else if (the_hour == 18)
	$('body').css({'background-color': '#e7e7e7e'});
else if (the_hour == 17)
	$('body').css({'background-color': '#e9e9e9'});
else if (the_hour == 16)
	$('body').css({'background-color': '#ebebeb'});
else if (the_hour == 15)
	$('body').css({'background-color': '#ededed'});
else if (the_hour == 14)
	$('body').css({'background-color': '#efefef'});
else if (the_hour == 13)
	$('body').css({'background-color': '#f1f1f1'});
else if (the_hour == 12)
	$('body').css({'background-color': '#f3f3f3'});	
else if (the_hour == 11)
	$('body').css({'background-color': '#f5f5f5'});
else if (the_hour == 10)
	$('body').css({'background-color': '#f7f7f7'});
else if (the_hour == 9)
	$('body').css({'background-color': '#f9f9f9'});
else if (the_hour == 8)
	$('body').css({'background-color': '#fbfbfb'});
else if (the_hour == 7)
	$('body').css({'background-color': '#fdfdfd'});
else if (the_hour == 6)
	$('body').css({'background-color': '#ffffff'});
else if (the_hour == 5)
	$('body').css({'background-color': '#d1d1d1'});
else if (the_hour == 4)
	$('body').css({'background-color': '#d3d3d3'});
else if (the_hour == 3)
	$('body').css({'background-color': '#d5d5d5'});
else if (the_hour == 2)
	$('body').css({'background-color': '#d7d7d7'});
else if (the_hour == 1)
	$('body').css({'background-color': '#d9d9d9'});
else if ((the_hour == 0) || (the_hour == 24))
	$('body').css({'background-color': '#dbdbdb'});

fd_ad = '<div style="width:460px;height:140px;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;"><pre>' +
'     ____   __            ______ _      __     __ __    ' + '<br>' +
'    / __ \\ / /_   ____   / ____/(_)____/ /____/ // /___ ' + '<br>' +
'   / /_/ // __ \\ / __ \\ / /_   / // __  // __  // // _ \\ ' + '<br>' +
'  / ____// / / // /_/ // __/  / // /_/ // /_/ // // ___/' + '<br>' +
' /_/    /_/ /_// .___//_/    /_/ \\__,_/ \\__,_//_/ \\___  ' + '<br>' +
'              /_/                                         </pre></div>';

});
