/*!CK:2187938924!*//*1425268141,*/

if (self.CavalryLogger) { CavalryLogger.start_js(["nqea\/"]); }

__d("PagesHovercardImpressionConstants",[],function(a,b,c,d,e,f){e.exports={ACT_LOG_MESSAGE_BUTTON_IMPRESSION:"message_button_impression",ACT_LOG_MESSAGE_BUTTON_CLICK:"message_button_click"};},null);
__d("XPagesHovercardImpressionController",["XController"],function(a,b,c,d,e,f){e.exports=b("XController").create("\/pages\/hovercard\/impression\/",{});},null);
__d("PageHovercardUtilities",["AsyncRequest","Event","PagesHovercardImpressionConstants","XPagesHovercardImpressionController"],function(a,b,c,d,e,f,g,h,i,j){var k={registerMessageButton:function(l,m){h.listen(l,'click',function(){var n=i.ACT_LOG_MESSAGE_BUTTON_CLICK,o=j.getURIBuilder().getURI();new g().setURI(o).setData({pageID:m,action:n}).send();});}};e.exports=k;},null);