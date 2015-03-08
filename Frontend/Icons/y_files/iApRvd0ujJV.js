/*!CK:2821098085!*//*1425267879,*/

if (self.CavalryLogger) { CavalryLogger.start_js(["7sNdd"]); }

__d("FamilyTaggingCropperSource",[],function(a,b,c,d,e,f){e.exports={PROFILE_SOURCE:"family_member"};},null);
__d("TimelineProfilePictureLoggerEnums",[],function(a,b,c,d,e,f){e.exports={actions:{EDIT_THUMBNAIL:"edit_thumbnail",FROM_PHOTOS:"from_photos",MAKE_PROFILE:"make_profile",SILHOUETTE:"silhouette",SUGGESTION:"suggestion",SUGGESTION_UPLOAD:"suggestion_upload",SYNCED_PHOTO:"synced_photo",TAKE_PHOTO:"take_photo",UPLOAD:"upload_photo",USE_PREVIOUS:"use_previous"},flows:{PERMALINK:"permalink",SNOWLIFT:"snowlift",SPOTLIGHT:"spotlight",VAULT:"vault",ZOOMCROP:"zoomcrop"},steps:{CANCEL:"cancel",CROP:"crop",CROP_FAIL:"crop_fail",CROP_SAVING:"crop_saving",CROP_SUCCESS:"crop_success",DRAG_AND_DROP:"drag_and_drop",FAIL:"fail",INIT:"init",LOADING:"loading",PREVIOUS_PIC_FAIL:"previous_pic_fail",PREVIOUS_PIC_INIT:"previous_pic_init",PREVIOUS_PIC_SAVING:"previous_pic_saving",PREVIOUS_PIC_SUCCESS:"previous_pic_success",RESIZE_BEGIN:"resize_begin",RESIZE_SKIPPED:"resize_skipped",RESIZE_SUCCESS:"resize_success",RESIZE_FAIL:"resize_fail",SKIP_CROP:"skip_crop",SUCCESS:"success",UPLOAD_CANCEL:"upload_cancel",UPLOAD_SELECT:"upload_select",UPLOAD_SUCCESS:"upload_success",VIEWER_INIT:"viewer_init"}};},null);
__d("ProgressBar.react",["React","cx","joinClasses"],function(a,b,c,d,e,f,g,h,i){var j=g.createClass({displayName:"UIProgressBar",propTypes:{value:g.PropTypes.number.isRequired,label:g.PropTypes.string,min:g.PropTypes.number,max:g.PropTypes.number,size:g.PropTypes.oneOf(['small','large']),typesetting:g.PropTypes.oneOf(['float','inline']),isRounded:g.PropTypes.bool},getDefaultProps:function(){return {min:0,max:100,size:'large',typesetting:'inline',isRounded:false};},_calculatePercentage:function(){var k=this.props,l=Math.min(Math.max((k.value-k.min)/(k.max-k.min)*100,0),100);return l;},_hasLabel:function(){return this.props.label!=null&&this.props.size!=='small';},_isFloatingLabel:function(){return this._hasLabel()&&this.props.typesetting==='float';},_getLabel:function(){if(!this._hasLabel())return null;return this.props.label;},_getSpacer:function(){if(this._isFloatingLabel())return g.createElement("div",{className:"_6a"}," ");return null;},_getFillArea:function(){var k=Math.round(this._calculatePercentage()),l=(("_5e4k")+(k===0?' '+"_5e2d":'')+(k===100?' '+"_5e4j":'')),m=this._getLabel();if(m)m=g.createElement("span",{className:"_5e2h"},m);var n=g.createElement("div",{className:l,style:{width:k+'%'}},this._getSpacer(),m);return n;},_getUnfillArea:function(){var k=this._getLabel();if(!k)return null;k=g.createElement("span",{className:"_5e2h _5e2n"},k);if(this._isFloatingLabel()){var l=this._calculatePercentage(),m={left:l+'%',width:l+'%'},n=g.createElement("div",{className:"_5e2g",style:m},this._getSpacer(),k);return n;}return k;},render:function(){var k=(("_5e4h")+(!this._isFloatingLabel()?' '+"_5e2k":'')+(this._isFloatingLabel()?' '+"_5e2j":'')+(this.props.size==='small'?' '+"_5e2l":'')+(this.props.isRounded===true?' '+"_5e2m":''));if(this._isFloatingLabel()){return (g.createElement("div",g.__spread({},this.props,{className:i(this.props.className,k)}),g.createElement("div",{className:"_5e2k"},this._getUnfillArea(),this._getFillArea())));}else return (g.createElement("div",g.__spread({},this.props,{className:i(this.props.className,k)}),this._getUnfillArea(),this._getFillArea()));}});e.exports=j;},null);
__d("ManagedError",[],function(a,b,c,d,e,f){function g(h,i){Error.prototype.constructor.call(this,h);this.message=h;this.innerError=i;}g.prototype=new Error();g.prototype.constructor=g;e.exports=g;},null);
__d("ProfilePhotoActionLogger",["Banzai"],function(a,b,c,d,e,f,g){var h={EVENT_SELECT_METHOD:'select_method',EVENT_CAMERA_PERMISSION_PROVIDED:'permission_provided',EVENT_CAMERA_PERMISSION_DENIED:'permission_denied',EVENT_CAMERA_NO_WEBCAM:'permission_denied',EVENT_CAMERA_UNKNOWN_MEDIASTREAM_ERROR:'unknown_mediastream_error',EVENT_CAMERA_TAKE_PHOTO:'take_photo',EVENT_CAMERA_RETAKE_PHOTO:'retake_photo',EVENT_CAMERA_UPLOAD_ATTEMPT:'upload_attempt',EVENT_CAMERA_UPLOAD_ERROR:'upload_error',EVENT_CAMERA_UPLOAD_SUCCESS:'upload_success',SOURCE_SUGGESTIONS:'suggestions',SOURCE_TIMELINE:'timeline',SOURCE_NUX:'nux',METHOD_EXISTING:'existing',METHOD_UPLOAD:'upload',METHOD_CAMERA:'camera',log:function(i,j,k){g.post('profile_photo_action',{event:i,source:j,method:k});}};e.exports=h;},null);
__d("TimelineProfilePicConfig",["fbt"],function(a,b,c,d,e,f,g){var h={loading:'timeline/profile_pic/loading',success:'timeline/profile_pic/success',leavingMessage:"Your profile picture is still uploading, are you sure you want to leave?"};e.exports=h;},null);
__d("ProfilePictureFlowLogging",["Arbiter","Banzai","Event","Parent","ProfilePhotoActionLogger","Run","TimelineProfilePicConfig","TimelineProfilePictureLoggerEnums","tidyEvent"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var p=m.loading,q=m.success,r='data-action-type',s,t,u,v;function w(){v&&v.unsubscribe();v=null;}var x={action:n.actions,flow:n.flows,step:n.steps,log:function(y){var z=y||x.step.INIT;h.post('profile_pic_action',{action_type:s,flow_type:t,step_type:z});if(s===x.action.UPLOAD&&z===x.step.INIT)k.log(k.EVENT_SELECT_METHOD,u,k.METHOD_UPLOAD);t=null;if(y==='success'||y==='fail')s=null;return x;},setAction:function(y){s=y;return x;},setFlowType:function(y){t=y;return x;},setSource:function(y){u=y;return x;},init:function(y,z){if(z)u=z;if(!v){v=g.subscribe([p,q],function(aa){x.log(aa===p?n.steps.LOADING:n.steps.SUCCESS);});l.onLeave(w);}o(i.listen(y,'click',function(aa){var ba=j.byAttribute(aa.getTarget(),r);if(!ba)return;x.setAction(ba.getAttribute(r)).log();}));},initMenuItems:function(y,z,aa){x.init(y.getRoot(),aa);}};e.exports=x;},null);
__d("TimelineCoverPhotoChangePrivacyDialog",["Arbiter","Event"],function(a,b,c,d,e,f,g,h){var i={init:function(j,k,l){this._dialog=j;this._tooltipLink=l;this._closeButton=k;this._showDialog=false;this._tooltip=null;},registerDialogShow:function(){this._showDialog=true;g.subscribe('CoverPhotoEdit',function(j,k){if(!this._showDialog)return;if(k.state==="open"){this._dialog&&this._dialog.show();if(this._tooltipLink){this._tooltip=this._tooltipLink.getAttribute('data-hover');this._tooltipLink.setAttribute('data-hover',null);}}else if(k.state==="closed")this.hideDialog();}.bind(this));h.listen(this._closeButton,'click',this.hideDialog.bind(this));},hideDialog:function(){this._dialog&&this._dialog.hide();if(this._tooltipLink)this._tooltipLink.setAttribute('data-hover',this._tooltip);this._showDialog=false;}};e.exports=i;},null);
__d("XTimelineCoverPhotoGalleryController",["XController"],function(a,b,c,d,e,f){e.exports=b("XController").create("\/timeline\/cover\/gallery\/",{});},null);
__d("TimelineCoverPhotoNUX",["AsyncRequest","CSS","XTimelineCoverPhotoGalleryController","$","cx"],function(a,b,c,d,e,f,g,h,i,j,k){var l='fbProfileCover',m="_3y4k",n={init:function(o,p){var q=j(l),r=o.getPopover();r.subscribeOnce('show',function(){r.hideLayer();p.show();h.addClass(q,m);new g().setURI(i.getURIBuilder().getURI()).send();});p.subscribe('cancel',function(){r.showLayer();h.removeClass(q,m);});}};e.exports=n;},null);
__d("TimelineProfilePic",["Arbiter","CSS","Dialog","DOM","HTML","TimelineProfilePicConfig","Run","$","ge"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var p;q.init=function(r,s){"use strict";q.destroyInstance();p=new q(r||'fbProfileCover',s||'.profilePicThumb');};function q(r,s){"use strict";this.$TimelineProfilePic0=n(r);this.$TimelineProfilePic1=s;this.$TimelineProfilePic2=[g.subscribe(l.loading,this.startLoading.bind(this)),g.subscribe(l.success,this.onUploadSuccess.bind(this))];m.onBeforeUnload(this.onBeforeUnload.bind(this));m.onLeave(this.destroy.bind(this));}q.prototype.$TimelineProfilePic3=function(r){"use strict";this.$TimelineProfilePic4=r;h.conditionClass(this.$TimelineProfilePic0,'profilePicLoading',r);};q.prototype.destroy=function(){"use strict";this.$TimelineProfilePic2.forEach(function(r){r.unsubscribe();});this.$TimelineProfilePic2=[];p=null;};q.prototype.startLoading=function(r,s){"use strict";this.$TimelineProfilePic3(!!s.isLoading);};q.prototype.onUploadSuccess=function(r,s){"use strict";this.$TimelineProfilePic3(false);if(!s.newPic)return;var t=i.getCurrent();if(t)t.hide();var u=s.newPic;j.replace(j.find(this.$TimelineProfilePic0,this.$TimelineProfilePic1),typeof u==='string'?k(u):u);if(typeof(s.profileId)!==(void 0)&&typeof(s.headerPicURL)!==(void 0)){var v=o('profile_pic_header_'+s.profileId);if(v)v.src=s.headerPicURL;}var w=o('fbProfilePicSelector');if(w)h.removeClass(w,'fbTimelineNullProfilePicSelector');};q.prototype.onBeforeUnload=function(){"use strict";if(p===this&&this.$TimelineProfilePic4)return l.leavingMessage;};q.destroyInstance=function(){"use strict";p&&p.destroy();};e.exports=q;},null);
__d("InfoReviewInstanceManager",["DOM","Event","React","csx"],function(a,b,c,d,e,f,g,h,i,j){var k="._5sf3",l=[],m=[],n={addInstanceRoot:function(o,p){m.push(h.listen(p,'click',function(q){var r=g.scry(p,k)[0];r&&g.remove(r);}));l.push(o);},cleanupInstances:function(){var o=[];while(l.length){var p=l.pop();document.contains(p)?o.push(p):i.unmountComponentAtNode(p);}while(m.length)m.pop().remove();l=o;}};e.exports=n;},null);
__d("InfoReviewCloseButton",["DOM","Event","InfoReviewInstanceManager","Parent","$","tidyEvent"],function(a,b,c,d,e,f,g,h,i,j,k,l){var m='fbTimelineUnit';function n(o,p){"use strict";this.$InfoReviewCloseButton0=o;this.$InfoReviewCloseButton1=p;this.$InfoReviewCloseButton2=h.listen(this.$InfoReviewCloseButton0,'click',this.$InfoReviewCloseButton3.bind(this));l(this.$InfoReviewCloseButton2);}n.prototype.$InfoReviewCloseButton3=function(){"use strict";var o=k(this.$InfoReviewCloseButton1);if(o.parentElement.children.length===1)o=j.byClass(o,m);g.remove(o)&&this.$InfoReviewCloseButton4();i.cleanupInstances();};n.prototype.$InfoReviewCloseButton4=function(){"use strict";this.$InfoReviewCloseButton0=null;this.$InfoReviewCloseButton1=null;this.$InfoReviewCloseButton2&&this.$InfoReviewCloseButton2.remove();this.$InfoReviewCloseButton2=null;};e.exports=n;},null);
__d("AssertionError",["ManagedError"],function(a,b,c,d,e,f,g){function h(i){g.prototype.constructor.apply(this,arguments);}h.prototype=new g();h.prototype.constructor=h;e.exports=h;},null);
__d("Assert",["AssertionError","sprintf"],function(a,b,c,d,e,f,g,h){function i(n,o){if(typeof n!=='boolean'||!n)throw new g(o);return n;}function j(n,o,p){var q;if(o===(void 0)){q='undefined';}else if(o===null){q='null';}else{var r=Object.prototype.toString.call(o);q=/\s(\w*)/.exec(r)[1].toLowerCase();}i(n.indexOf(q)!==-1,p||h('Expression is of type %s, not %s',q,n));return o;}function k(n,o,p){i(o instanceof n,p||'Expression not instance of type');return o;}function l(n,o){m['is'+n]=o;m['maybe'+n]=function(p,q){if(p!=null)o(p,q);};}var m={isInstanceOf:k,isTrue:i,isTruthy:function(n,o){return i(!!n,o);},type:j,define:function(n,o){n=n.substring(0,1).toUpperCase()+n.substring(1).toLowerCase();l(n,function(p,q){i(o(p),q);});}};['Array','Boolean','Date','Function','Null','Number','Object','Regexp','String','Undefined'].forEach(function(n){l(n,j.bind(null,n.toLowerCase()));});e.exports=m;},null);
__d("ContextualLayerAsyncRelative",["Event","Parent","copyProperties"],function(a,b,c,d,e,f,g,h,i){function j(k){"use strict";this._layer=k;}j.prototype.enable=function(){"use strict";this._layerSubscription=this._layer.subscribe('show',this._attachListener.bind(this));if(this._layer.isShown())this._attachListener();};j.prototype.disable=function(){"use strict";this._layerSubscription.unsubscribe();this._layerSubscription=null;if(this._listener){this._listener.remove();this._listener=null;}};j.prototype._attachListener=function(){"use strict";this._listener=g.listen(this._layer.getRoot(),'click',this._onclick.bind(this));};j.prototype._onclick=function(k){"use strict";var l=h.byTag(k.getTarget(),'A');if(!l)return;var m=l.getAttribute('ajaxify'),n=l.href,o=m||n;if(l.rel==='async'||l.rel==='async-post'){d(['AsyncRequest'],function(p){p.bootstrap(o,this._layer.getContext(),l.rel==='async-post');}.bind(this));return false;}};i(j.prototype,{_layerSubscription:null,_listener:null});e.exports=j;},null);