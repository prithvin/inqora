/*!CK:3168942434!*//*1424662005,*/

if (self.CavalryLogger) { CavalryLogger.start_js(["DcOax"]); }

__d("PageWebsiteLogger",["Banzai","Event"],function(a,b,c,d,e,f,g,h){var i={init:function(j,k,l,m){h.listen(j,'click',function(n){this.log({user_id:k,page_id:l,website_url:m});}.bind(this));},log:function(j){g.post('page_website_logger',j);}};e.exports=i;},null);
__d("ComposerXPages",["Arbiter","CurrentUser","DOM","DOMScroll","URI","Event","ge"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n={initScrollToComposer:function(o){this.initScrollToComposerWithRootID(o,'pagelet_timeline_recent');},initScrollToComposerWithRootID:function(o,p){l.listen(o,'click',function(){this._scrollAndFocus(m(p));}.bind(this));},scrollToComposer:function(o){if(!k.getRequestURI().getQueryData().focus_composer&&!k.getRequestURI().getQueryData().scroll_to_composer)return;l.listen(window,'load',function(){this._scrollAndFocus(o);}.bind(this));},registerForAutoClose:function(o,p){g.subscribe('Pages/composeFinished',function(q,r){if(r.composerID===p){o.hide();if(r.contentID)g.inform('composer/publish',{content_id:r.contentID});}});},_scrollAndFocus:function(o){g.inform('ComposerXPages/composePostWithActor',{actorID:h.getID(),callback:function(){i.find(o,'textarea.input').focus();}});j.scrollTo(o,500,false,false,0,function(){i.find(o,'textarea.input').focus();});}};e.exports=n;},null);
__d("PagesPostsByOthersUnit",["DOM"],function(a,b,c,d,e,f,g){var h;function i(j,k){"use strict";this.$PagesPostsByOthersUnit0=j;this.$PagesPostsByOthersUnit1=k;h=this;}i.prototype.getRoot=function(){"use strict";return this.$PagesPostsByOthersUnit0;};i.prototype.insertPost=function(j){"use strict";var k=this.getRoot();g.prependContent(k,j);if(k.children.length>this.$PagesPostsByOthersUnit1)g.remove(k.lastChild);if(this.$PagesPostsByOthersUnit2){g.remove(this.$PagesPostsByOthersUnit2);this.$PagesPostsByOthersUnit2=null;}};i.insertPostIntoCurrentInstance=function(j){"use strict";this.getInstance().insertPost(j);};i.initPlaceholderElement=function(j){"use strict";this.getInstance().$PagesPostsByOthersUnit2=j;};i.getInstance=function(){"use strict";return h;};e.exports=i;},null);
__d("PagesPostsSection",["LoadingIndicator.react","Parent","React","UIPagelet","cx"],function(a,b,c,d,e,f,g,h,i,j,k){var l={HIGHLIGHTS:0,ALL_POSTS:1};function m(n,o,p){"use strict";this.$PagesPostsSection0=n;this.$PagesPostsSection1=o;this.$PagesPostsSection2=p;this.$PagesPostsSection3=l.HIGHLIGHTS;this.$PagesPostsSection1.setPostClickHandler(this.$PagesPostsSection4.bind(this));}m.prototype.$PagesPostsSection4=function(n,o){"use strict";var p=h.byClass(this.$PagesPostsSection0,"_1k4h");p.parentNode.style.minHeight=window.innerHeight+'px';i.render(i.createElement(g,{size:"small",color:"white",className:"loadingIndicator"}),this.$PagesPostsSection0);o.item.disable();if(this.$PagesPostsSection3!=l.ALL_POSTS){this.$PagesPostsSection3=l.ALL_POSTS;this.$PagesPostsSection2.show_all_posts=true;}else{this.$PagesPostsSection3=l.HIGHLIGHTS;this.$PagesPostsSection2.show_all_posts=false;}j.loadFromEndpoint('PagePostsSectionPagelet',this.$PagesPostsSection0,this.$PagesPostsSection2,{displayCallback:function(q){q();o.item.enable();}});};e.exports=m;},null);
__d("PagesPostsSections",["Arbiter","CSS","DOM","DOMScroll","Event","PagesTimelineController","ScrollingPager","Vector","csx","queryThenMutateDOM","tidyEvent"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var r=120,s='PagesPostsSections/scrollListener';function t(u){"use strict";this.$PagesPostsSections0=u;this.$PagesPostsSections1={};this.$PagesPostsSections2=0;this.$PagesPostsSections3=0;for(var v=0;v<this.$PagesPostsSections0.length;v++){this.$PagesPostsSections1[this.$PagesPostsSections0[v].key]={section:this.$PagesPostsSections0[v].section,index:v};this.$PagesPostsSections0[v].loaded=(!v);this.$PagesPostsSections0[v].fire_on_scroll_enabled=true;this.$PagesPostsSections0[v].first_posts_loaded=(!v);}var w=function(x,y){if(y.section_index+1<this.$PagesPostsSections0.length){h.show(this.$PagesPostsSections0[y.section_index+1].section);g.inform('dom-scroll');}if(this.$PagesPostsSections2<this.$PagesPostsSections0.length-1)this.$PagesPostsSections0[++this.$PagesPostsSections2].loaded=true;};q(g.subscribe(l.SECTION_FULLY_LOADED,w.bind(this)));q(g.subscribe(l.LOAD_SECTION,this.loadSection.bind(this)));q(k.listen(window,'scroll',this.scrollListener.bind(this)));q(g.subscribe(l.FIRST_POSTS_LOADED,this.firstPostsLoaded.bind(this)));q(g.subscribe(l.REMOVE_SECTION,this.removeSection.bind(this)));}t.prototype.firstPostsLoaded=function(u,v){"use strict";var w=this.$PagesPostsSections1[v.section_key];w.section.style.minHeight='';this.$PagesPostsSections0[w.index].first_posts_loaded=true;};t.prototype.loadSection=function(u,v){"use strict";var w=this.$PagesPostsSections1[v.section_key].section,x=this.$PagesPostsSections1[v.section_key].index;for(var y=this.$PagesPostsSections2;y<x;y++){if(this.$PagesPostsSections0[y].fire_on_scroll_enabled)this.setFireOnScroll(y,false);h.show(this.$PagesPostsSections0[y].section);this.$PagesPostsSections0[y].loaded=true;}this.$PagesPostsSections2=x;if(!this.$PagesPostsSections0[x].first_posts_loaded){if(!this.$PagesPostsSections0[x].fire_on_scroll_enabled)this.setFireOnScroll(x,true);w.style.minHeight=window.innerHeight+'px';}if(!x&&!this.$PagesPostsSections0[x].loaded){j.scrollTo(document.body);}else{h.show(w);this.$PagesPostsSections0[this.$PagesPostsSections2].loaded=true;var z=n.getScrollPosition().x,aa=n.getElementPosition(w).y-r;j.scrollTo(new n(z,aa,'document'));}};t.prototype.setFireOnScroll=function(u,v){"use strict";var w=this.$PagesPostsSections0[u].section,x=i.scry(w,"div._5t6j"),y=x.length?x[x.length-1]:null;if(y){var z=m.getInstance(y.id);if(z){this.$PagesPostsSections0[u].fire_on_scroll_enabled=v;if(v){z.register();}else z.removeOnVisible();}}};t.prototype.scrollListener=function(event){"use strict";p(this.getActiveSectionIndex.bind(this),function(){l.activateScrubberItem(this.$PagesPostsSections0[this.$PagesPostsSections3].key);}.bind(this),s);};t.prototype.getActiveSectionIndex=function(){"use strict";var u=0;for(var v=0;v<this.$PagesPostsSections0.length;v++){var w=this.$PagesPostsSections0[v].section,x=n.getElementPosition(w,'viewport').y;if(x>r)break;if(this.$PagesPostsSections0[v].loaded)u=v;}if(u!=this.$PagesPostsSections3)this.$PagesPostsSections3=u;};t.prototype.removeSection=function(u,v){"use strict";var w=this.$PagesPostsSections1[v.section_key].index;this.$PagesPostsSections0[w].loaded=false;h.hide(this.$PagesPostsSections1[v.section_key].section);};e.exports=t;},null);
__d("PagesScrubber",["Arbiter","CSS","Event","PagesTimelineController","Parent","cx","tidyEvent"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){function n(o,p,q){"use strict";this.$PagesScrubber0=o;this.$PagesScrubber1=p;this.$PagesScrubber2=q;this.$PagesScrubber3="_-fk";m(i.listen(o,'click',function(event){var r=k.byTag(event.getTarget(),'a'),s=r.getAttribute('data-key');j.loadSection(s);}));m(g.subscribe(j.ACTIVATE_SCRUBBER_ITEM,this.activateScrubberItem.bind(this)));m(g.subscribe(j.REMOVE_SECTION,this.removeSection.bind(this)));}n.prototype.activateScrubberItem=function(o,p){"use strict";if(this.$PagesScrubber2!=p.section_key){h.removeClass(this.$PagesScrubber1[this.$PagesScrubber2],this.$PagesScrubber3);h.addClass(this.$PagesScrubber1[p.section_key],this.$PagesScrubber3);this.$PagesScrubber2=p.section_key;}};n.prototype.removeSection=function(o,p){"use strict";if(p.section_key!=j.RECENT_SECTION_KEY)h.hide(this.$PagesScrubber1[p.section_key]);};e.exports=n;},null);
__d("PagesSideAds",["Arbiter","CSS","DOM","EgoAdsObjectSet","Event","PagesTimelineController","Parent","Vector","ViewportBounds","cx","throttle","tidyEvent"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){function s(t){"use strict";this.$PagesSideAds0=t;var u=this.adjustAds.bind(this);r(g.subscribe(l.ADJUST_ADS,u));r(g.subscribe('netego_loaded',u));r(k.listen(window,'resize',q(u)));}s.prototype.adjustAds=function(){"use strict";var t=i.scry(this.$PagesSideAds0,'div.ego_unit');if(t.length){this.$PagesSideAds1=new j();this.$PagesSideAds1.init(t);this.$PagesSideAds2=m.byClass(this.$PagesSideAds0,"_23xb");this.$PagesSideAds3=i.scry(this.$PagesSideAds0,'div.uiHeader');var u=this.getNumAdsToShow();this.showAds(u);}return false;};s.prototype.getNumAdsToShow=function(){"use strict";var t=this.getAvailableSpace(),u=0;while(t>0&&u<this.$PagesSideAds1.getCount()){var v=this.getAdHeight(u);t-=v;if(t>=0)u++;}return u;};s.prototype.getAdHeight=function(t){"use strict";var u=this.$PagesSideAds1.getUnit(t);return u.offsetHeight;};s.prototype.showAds=function(t){"use strict";this.$PagesSideAds1.forEach(function(u,v){this.renderOffScreen(u,v>=t);},this);this.renderOffScreen(this.$PagesSideAds0,t===0);};s.prototype.renderOffScreen=function(t,u){"use strict";h.conditionClass(t,"_19x_",u);t.setAttribute('aria-hidden',u?'true':'false');};s.prototype.getAvailableSpace=function(){"use strict";var t=this.$PagesSideAds3&&this.$PagesSideAds3.offsetHeight||0;return (n.getViewportDimensions().y-o.getBottom()-l.BOTTOM_OFFSET)-(this.$PagesSideAds2.getBoundingClientRect().top+t);};e.exports=s;},null);
__d("PagesTimelineChaining",["Arbiter","PageLikeButton","Parent","Style","UIPagelet","cx","tidyEvent"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n={_recentlyLikedPageIDs:{},container:null,init:function(o,p){this.container=o;if(!this._showChainSuggestions(p.pageID)){this.subscription=g.subscribe(h.LIKED,this.onLike.bind(this,p.pageID));m(this.subscription);}},onLike:function(o,p,q){if(q.profile_id===o&&i.byClass(q.target,"_5d_i")){this._recentlyLikedPageIDs[o]=true;this._showChainSuggestions(o);this.subscription.unsubscribe();this.subscription=null;}},displayCallback:function(o){o();var p=this.container.firstChild;if(p)j.set(this.container,'height',p.offsetHeight+'px');},_showChainSuggestions:function(o){if(!(o in this._recentlyLikedPageIDs))return false;k.loadFromEndpoint('PagesTimelineChainingPagelet',this.container,{pageID:o},{displayCallback:this.displayCallback.bind(this)});return true;}};e.exports=n;},null);
__d("PagesToggleSelector",["CSS"],function(a,b,c,d,e,f,g){function h(i,j,k,l,m){"use strict";this.$PagesToggleSelector0=false;this.$PagesToggleSelector1=null;this.$PagesToggleSelector2=i;this.$PagesToggleSelector3=j;this.$PagesToggleSelector4=k;this.$PagesToggleSelector5=l;m.subscribe('itemclick',function(event,n){if(this.$PagesToggleSelector0){var o=this.$PagesToggleSelector2,p=this.$PagesToggleSelector4,q=this.$PagesToggleSelector3,r=this.$PagesToggleSelector5;}else{o=this.$PagesToggleSelector3;p=this.$PagesToggleSelector5;q=this.$PagesToggleSelector2;r=this.$PagesToggleSelector4;}this.$PagesToggleSelector0=!this.$PagesToggleSelector0;g.show(o);g.show(p);g.hide(r);g.hide(q);if(this.$PagesToggleSelector1)this.$PagesToggleSelector1(event,n);}.bind(this));}h.prototype.setPostClickHandler=function(i){"use strict";this.$PagesToggleSelector1=i;};e.exports=h;},null);
__d("PlaceActionLink",["AsyncRequest","Dialog"],function(a,b,c,d,e,f,g,h){var i={start_claim_link:function(j){var k=new g().setMethod('POST').setURI('/ajax/places/claim/start_claim.php').setData({id:j});new h().setAsync(k).show();return false;},refer_claim_link:function(j){var k=new g().setMethod('POST').setURI('/ajax/places/claim/refer_claim.php').setData({id:j});new h().setAsync(k).show();return false;}};e.exports=i;},null);
__d("legacy:place-action-link",["PlaceActionLink"],function(a,b,c,d){a.PlaceActionLink=b('PlaceActionLink');},3);
__d("ProfileCoverEditControls",["ArbiterMixin","Event","mixin"],function(a,b,c,d,e,f,g,h,i){var j=i(g);for(var k in j)if(j.hasOwnProperty(k))m[k]=j[k];var l=j===null?null:j.prototype;m.prototype=Object.create(l);m.prototype.constructor=m;m.__superConstructor__=j;function m(n,o,p,q){"use strict";this.root=n;this.save=o;this.cancel=p;this.input=q;h.listen(o,'click',function(){this.inform('save');}.bind(this));h.listen(p,'click',function(){this.inform('cancel');}.bind(this));}m.prototype.getSaveButton=function(){"use strict";return this.save;};m.prototype.getCancelButton=function(){"use strict";return this.cancel;};m.prototype.getInput=function(){"use strict";return this.input;};e.exports=m;},null);
__d("TimelineCommentsLoader",["Event","CommentPrelude","CSS","DOM","Parent","emptyFunction"],function(a,b,c,d,e,f,g,h,i,j,k,l){var m={init:function(){m.init=l;g.listen(document.body,'click',function(n){var o=k.byClass(n.getTarget(),'fbTimelineFeedbackCommentLoader');if(o){n.kill();h.click(o,false);var p=k.byTag(o,'form'),q=j.scry(p,'li.uiUfiViewAll input');if(!q.length)q=j.scry(p,'li.fbUfiViewPrevious input');if(!q.length)q=j.scry(p,'a.UFIPagerLink');q[0].click();i.show(j.find(p,'li.uiUfiComments'));i.removeClass(o,'fbTimelineFeedbackCommentLoader');}});}};e.exports=m;},null);
__d("PagesComposer",["Arbiter","Bootloader","ComposerXMarauderLogger","ComposerXStore","DOM","Parent","Run","$","csx","cx","getObjectValues","goURI"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){var s;function t(){i.logCompleted(s.id);}function u(w){if(w.hidePost){t();return;}if(w.redirect){var x=j.getAllForComposer(s.id);q(x).forEach(function(z){if(z.reset)z.reset(z);});r(w.redirect);t();return;}if(!w.streamStory){window.location.reload();return;}if(w.backdatedTime){h.loadModules(["PagesStoryPublisher"],function(z){z.publish(w);});t();return;}var y=v.renderStory(s,w.streamStory);g.inform('TimelineComposer/on_after_publish',y,g.BEHAVIOR_PERSISTENT);t();}var v={init:function(w){s=n(w);var x=g.subscribe('composer/publish',function(event,y){if(y.composer_id===s.id)u(y);});m.onLeave(x.unsubscribe.bind(x));},renderStory:function(w,x){var y=l.byClass(w,"_5onm");if(!y)return;var z=k.scry(y,"._5sem")[0],aa=k.prependContent(z,x)[0];h.loadModules(["Animation"],function(ba){new ba(aa).from('backgroundColor','#fff8dd').to('backgroundColor','#fff').duration(2000).ease(ba.ease.both).go();});return aa;},replaceByID:function(w,x){k.replace(n(w),x);}};e.exports=a.PagesComposer||v;},null);