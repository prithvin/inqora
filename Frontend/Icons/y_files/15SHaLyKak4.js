/*!CK:3549098821!*//*1425675688,*/

if (self.CavalryLogger) { CavalryLogger.start_js(["3oxdK"]); }

__d("XUIDialogCloseButton.react",["React","XUIDialogButton.react","fbt"],function(a,b,c,d,e,f,g,h,i){var j=g.createClass({displayName:"XUIDialogCloseButton",render:function(){return (g.createElement(h,g.__spread({},this.props,{action:"cancel",label:"Close"})));}});e.exports=j;},null);
__d("format",[],function(a,b,c,d,e,f){function g(h,i){i=Array.prototype.slice.call(arguments,1);return h.replace(/\{(\d+)\}/g,function(j,k){var l=i[Number(k)];return (l===null||l===(void 0))?'':l.toString();});}e.exports=g;},null);
__d("CapitalizedNameMentionsStrategy",["DocumentMentionsRegex"],function(a,b,c,d,e,f,g){var h=1,i=new RegExp('(?:'+g.NAME+'{'+h+',})$'),j={findMentionableString:function(k){var l=i.exec(k);if(l!==null)return {matchingString:l[0],leadOffset:l[0].length};return null;}};e.exports=j;},null);
__d("DynamicCSS",[],function(a,b,c,d,e,f){var g=null,h=[],i=0,j={add:function(k){if(!g){var l=document.head||document.getElementsByTagName('head')[0],m=document.createElement('style');m.type='text/css';l.insertBefore(m,l.firstChild);var n=document.styleSheets;for(var o=0,p=n.length;o<p;o++)if(n[o].cssRules||n[o].rules){g=n[o];break;}if(!g)return;}var q=h.length;if(g.addRule){var r=k.match(/(.+?)\s*\{(.+)\}/);g.addRule(r[1],r[2],q);}else g.insertRule(k,q);var s=i++;h.push(s);return {remove:function(){var t=h.indexOf(s);if(t>=0){if(g.removeRule){g.removeRule(t);}else g.deleteRule(t);h.splice(t,1);}}};}};e.exports=j;},null);
__d("SRTGlobalKeys",["KeyEventController","cx"],function(a,b,c,d,e,f,g,h){var i=function(l,m){return function(event,n){var o=event.getTarget().classList,p=o.contains(l),q=o.contains(m),r=((g.filterEventTargets(event,n)||p)&&!q);return (r&&g.filterEventTypes(event,n)&&g.filterEventModifiers(event,n));};},j=i("_1bz-","_1bz_"),k=i("_1b-0","_1b-1");e.exports={reviewQueueKeyFilter:j,CELabelingTableKeybindingsFilter:k};},null);
__d("XPartnersReviewQueueViewController",["XController"],function(a,b,c,d,e,f){e.exports=b("XController").create("\/review\/queue\/view\/",{ids:{type:"IntVector"},jobs:{type:"String"},queue_id:{type:"Int"},mintimestamp:{type:"Int"},maxtimestamp:{type:"Int"},experiments:{type:"StringVector"}});},null);
__d("PermalinkDialog.react",["LayerFadeOnHide","LeftRight.react","React","ReactLayeredComponentMixin","XUIButton.react","XUIDialog.react","XUIDialogBody.react","XUIDialogCloseButton.react","XUIDialogFooter.react","XUIDialogTitle.react","XPartnersReviewQueueViewController"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var r=i.createClass({displayName:"PermalinkDialog",mixins:[j],getInitialState:function(){return {dialogShown:false,text:''};},_onLinkClick:function(){this.setState({dialogShown:true});},_onSelectClick:function(){this.refs.permalink_input.getDOMNode().select();},_onToggle:function(s){setTimeout(this.setState.bind(this,{dialogShown:s},null),0);},renderLayers:function(){var s=(q.getURIBuilder()).setString('jobs',String(this.props.job_id)).getURI(),t=window.location.origin+s;return {dialog:i.createElement(l,{shown:this.state.dialogShown,behaviors:{LayerFadeOnHide:g},onToggle:this._onToggle,width:500},i.createElement(p,null,i.createElement("span",null,"Copy this link as a reference to this job")),i.createElement(m,null,i.createElement(h,null,i.createElement("input",{ref:"permalink_input",type:"text",value:t,size:"58",readOnly:true}),i.createElement(k,{label:"Select",onClick:this._onSelectClick}))),i.createElement(o,null,i.createElement(n,null)))};},render:function(){return (i.createElement(k,{label:"Permalink",onClick:this._onLinkClick}));}});e.exports=r;},null);
__d("XPartnersReviewBugReportAsyncController",["XController"],function(a,b,c,d,e,f){e.exports=b("XController").create("\/review\/ajax\/bug_report\/",{job_id:{type:"Int"},queue_id:{type:"Int"},text:{type:"String",required:true}});},null);
__d("BugNubDialog.react",["AsyncRequest","Dialog","LayerFadeOnHide","React","ReactLayeredComponentMixin","XPartnersReviewBugReportAsyncController","XUIButton.react","XUIDialog.react","XUIDialogBody.react","XUIDialogCancelButton.react","XUIDialogConfirmButton.react","XUIDialogFooter.react","XUIDialogTitle.react"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s){var t=j.createClass({displayName:"BugNubDialog",mixins:[k],getInitialState:function(){return {dialogShown:false,text:''};},_handleConfirm:function(event){var u=l.getURIBuilder().setInt('job_id',this.props.job_id).setInt('queue_id',this.props.queue_id).setString('text',this.state.text).getURI();new g().setURI(u).setHandler(function(v){this.setState({dialogShown:false,text:''});document.getElementById('reviewer_input').value='';new h().setTitle("Bug report successfully submitted").setBody("Thank you for submitting.").setButtons([h.OK]).show();}.bind(this)).setErrorHandler(function(v){new h().setTitle("An error occured").setBody("An error occured while submitting the bug report."+"Please try again later.").setButtons([h.OK]).show();}.bind(this)).send();},_onLinkClick:function(){this.setState({dialogShown:true});},_onToggle:function(u){setTimeout(this.setState.bind(this,{dialogShown:u},null),0);},setText:function(event){this.setState({text:event.target.value});},renderLayers:function(){return {dialog:j.createElement(n,{causalElementRef:"button",shown:this.state.dialogShown,behaviors:{LayerFadeOnHide:i},onToggle:this._onToggle,width:800},j.createElement(s,null,j.createElement("span",null,"Report a problem")),j.createElement(o,null,j.createElement("div",null,j.createElement("textarea",{id:"reviewer_input",type:"text",placeholder:'What is wrong?',rows:10,cols:700,onChange:this.setText}))),j.createElement(r,{leftContent:j.createElement("span",null,"This report will be sent to engineers working on the"+' '+"Single Review Tool")},j.createElement(p,null),j.createElement(q,{onClick:this._handleConfirm,disabled:this.state.text.length===0})))};},render:function(){return (j.createElement(m,{label:"Report a Problem",onClick:this._onLinkClick}));}});e.exports=t;},null);
__d("ReviewQueueControl.react",["Arbiter","BugNubDialog.react","PermalinkDialog.react","React","XUIButton.react","XUISpinner.react","cx","sprintf"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var o=j.createClass({displayName:"ReviewQueueControl",componentDidMount:function(){g.subscribe('ReviewQueue/displayItem',this.update);g.subscribe('ReviewQueue/sendItemToSubmit',this._itemSentToSubmit);g.subscribe('ReviewQueue/itemSubmittedOrFailed',this._itemSubmittedOrFailed);g.subscribe('ReviewQueue/hideCounter',this.hideCounter);},getInitialState:function(){return {index:0,total:0,currentlySubmitting:0,hideCounter:false};},_itemSentToSubmit:function(){this.setState({currentlySubmitting:this.state.currentlySubmitting+1});},_itemSubmittedOrFailed:function(){this.setState({currentlySubmitting:this.state.currentlySubmitting-1});},hideCounter:function(){this.setState({hideCounter:true});},update:function(event,p){this.setState(p);},goBack:function(event){g.inform('ReviewQueue/prevItem');},goForward:function(event){g.inform('ReviewQueue/nextItem');},refresh:function(event){g.inform('ReviewQueue/refreshItem');},render:function(){var p=null;if(this.state.currentlySubmitting)p=j.createElement("div",{className:"_27kw"},j.createElement(l,{background:'dark'})," ",' ','Processing response for '+this.state.currentlySubmitting+' job(s)');var q=null;if(!this.state.hideCounter)q=n('%s out of %s',this.state.index+1,this.state.total);return (j.createElement("div",null,p,j.createElement(k,{href:{url:"#"},label:"←",onClick:this.goBack}),q,j.createElement(k,{href:{url:"#"},label:"→",onClick:this.goForward}),j.createElement(k,{href:{url:"#"},label:"↺",onClick:this.refresh}),j.createElement(h,{job_id:this.state.job_id,queue_id:this.state.queue_id}),j.createElement(i,{job_id:this.state.job_id})));}});e.exports=o;},null);
__d("ReviewQueueController",["Arbiter","AsyncRequest","Dialog","DOM","KeyEventController","React","SRTGlobalKeys","XPartnersReviewAddNoteAsyncController","XPartnersReviewJobRendererAsyncController","XPartnersReviewDecisionAsyncController","XPartnersReviewSkipJobAsyncController","XPartnersReviewEscalateJobAsyncController","XPartnersReviewChangeJobStatusAsyncController","XPartnersReviewCloseJobAsyncController","XUICard.react","XUINotice.react","cx","emptyFunction","merge"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y){var z=null;function aa(ba,ca,da,ea){"use strict";z=this;this.BATCH_SIZE=6;this.HALF_WINDOW_SIZE=3*this.BATCH_SIZE;this.FETCH_IDS_TIMEOUT_MS_PER_JOB=1500;this.MAX_FETCH_IDS_TIMEOUT_MS=5*60*1000;this.MIN_FETCH_IDS_TIMEOUT_MS=10000;this.RESPONSE_DECISION=1;this.RESPONSE_LABEL=2;this.SUBMIT_RESPONSE_RETRIES=3;this.SUBMIT_RESPONSE_RETRY_DELAY=7000;this.CHANGE_STATUS_TIMEOUT=7000;this.fixedSetOfIDs=false;this.jobSourceEndpoint=ba;this.jobSourceData=ca;this.jobItemData=ea;this.ids=[];this.idsInWaiting={};this.fetchMoreIDsTimestamp=0;this.cacheData={};this.idsFetchError={};this.reviewStartTime={};this.fetchTime={};this.decisions={};if(!ca.num_jobs){this.timeout_ms=this.MIN_FETCH_IDS_TIMEOUT_MS;}else{this.timeout_ms=Math.min(ca.num_jobs*this.FETCH_IDS_TIMEOUT_MS_PER_JOB,this.MAX_FETCH_IDS_TIMEOUT_MS);this.timeout_ms=Math.max(this.timeout_ms,this.MIN_FETCH_IDS_TIMEOUT_MS);}this.expireTime={};this.container=da;this.index=-1;this.init();this.fetchMoreIDs();this.showItem(0);}aa.getInstance=function(){"use strict";return z;};aa.prototype.init=function(){"use strict";this.resetKeybindings();this.registerNavigationKeys();g.subscribe('ReviewQueue/nextItem',this.nextItem.bind(this));g.subscribe('ReviewQueue/refreshItem',this.refresh.bind(this));g.subscribe('ReviewQueue/prevItem',this.prevItem.bind(this));g.subscribe('ReviewQueue/disableNavigation',this.disableNavigation.bind(this));};aa.prototype.resetKeybindings=function(){"use strict";k.getInstance().resetHandlers();};aa.prototype.disableNavigation=function(){"use strict";this.disableNavigationKeys=true;this.leftControl&&this.leftControl.remove();this.rightControl&&this.rightControl.remove();};aa.prototype.registerNavigationKeys=function(){"use strict";if(this.disableNavigationKeys)return;this.leftControl=k.registerKey('LEFT',this.prevItem.bind(this),m.reviewQueueKeyFilter,true);this.rightControl=k.registerKey('RIGHT',this.nextItem.bind(this),m.reviewQueueKeyFilter,true);};aa.prototype.fetchMoreIDs=function(){"use strict";if(Date.now()-this.fetchMoreIDsTimestamp<this.timeout_ms)return;this.fetchMoreIDsTimestamp=Date.now();new h().setMethod('POST').setURI(this.jobSourceEndpoint).setData(this.jobSourceData).setHandler(this.onFetchIDs.bind(this)).setErrorHandler(this.onFetchIDsError.bind(this)).setTransportErrorHandler(this.onFetchIDsError.bind(this)).setTimeoutHandler(this.timeout_ms,this.onFetchIDsError.bind(this)).send();};aa.prototype.fetchItems=function(ba){"use strict";if(ba.length<=0)return;var ca=o.getURIBuilder().getURI();for(var da=0;da<ba.length;++da){this.idsInWaiting[ba[da]]=Date.now();var ea=this.jobItemData;ea.id=ba[da];ea.queue_id=this.jobSourceData.queue_id;new h().setURI(ca).setData(ea).setHandler(this.onFetchItem.bind(this,ba[da])).setErrorHandler(this.onFetchError.bind(this,ba[da])).setTransportErrorHandler(this.onFetchError.bind(this,ba[da])).setTimeoutHandler(30000,this.onFetchError.bind(this,ba[da])).send();}};aa.prototype.prevItem=function(){"use strict";if(this.index<=0)return;this.showItem(this.index-1);};aa.prototype.nextItem=function(){"use strict";if(this.index<this.ids.length-1){this.showItem(this.index+1);return;}this.fetchMoreIDs();if(this.noMoreIDs||this.fixedSetOfIDs){var ba='Congratulations! You\'ve reviewed it all!  '+'Press \'OK\' to go back to SRT, or Cancel to remain here.',ca=function(){window.history.back();};new i().setBody(ba).setButtons([i.OK,i.CANCEL]).setHandler(ca).show();}else new i().setBody('Fetching more jobs, please wait').setButtons([i.OK]).setAutohide(1000).show();};aa.prototype.refresh=function(){"use strict";this.dirty(this.index);this.showItem(this.index);};aa.prototype.dirty=function(ba){"use strict";if(ba<0||ba>=this.ids.length)return;var ca=this.ids[ba];this.cacheData[ca]=null;this.idsFetchError[ca]=null;};aa.prototype.clearCacheOutsideWindow=function(ba){"use strict";this.dirty((ba-1)-this.HALF_WINDOW_SIZE);this.dirty((ba+1)+this.HALF_WINDOW_SIZE);};aa.prototype.showItem=function(ba){"use strict";if(ba<0)return;if(ba>=this.ids.length-this.BATCH_SIZE)this.fetchMoreIDs();if(ba>=this.ids.length)return;this.clearCacheOutsideWindow(ba);var ca=this.ids[ba];if(this.cacheData[ca]||this.idsFetchError[ca]){this.resetKeybindings();this.registerNavigationKeys();this.fetchIndex=-1;this.index=ba;if(this.expireTime[ca]&&(Date.now()>this.expireTime[ca]*1000)){l.render(l.createElement(v,{use:"warn"},"It's been a while since the job was"+' '+"assigned to you. And it's about to be dumped automatically."+' '+"Please go back to the homepage, dump all your jobs and reassign."+' '+"To prevent this happening again, please do not to assign"+' '+"too many jobs all at once or you can use Just Go to review."),this.container);}else{var da=this.cacheData[ca];if(da&&da.getPayload().rendered_job){j.setContent(this.container,da.getPayload().rendered_job);new h().setNewSerial().handleResponse(JSON.parse(JSON.stringify(da)));}else j.setContent(this.container,'Cannot load data for job '+ca);}g.inform('ReviewQueue/displayItem',{index:ba,total:this.ids.length,job_id:ca,queue_id:this.jobSourceData.queue_id});this.reviewStartTime[ca]=Date.now();}else if(this.idsInWaiting[ca]){new i().setBody('Fetching '+ca+', please wait').setAutohide(1000).setButtons([i.OK]).show();}else{this.fetchIndex=ba;this.fetchItems([this.ids[ba]]);}this.fetchMoreItems();};aa.prototype.onFetchItem=function(ba,ca){"use strict";this.fetchTime[ba]=Date.now()-this.idsInWaiting[ba];var da=ca.getPayload();if(da&&da.rendered_job){this.cacheData[ba]=ca;if(this.fetchIndex>=0&&this.ids[this.fetchIndex]==ba)this.showItem(this.fetchIndex);if(da.prefetch_images){var ea=da.prefetch_images;for(var fa=0;fa<ea.length;++fa)(new Image()).src=ea[fa];}if(da.prefetch_iframes){var ga=da.prefetch_iframes;for(var ha=0;ha<ga.length;++ha){var ia=document.createElement('iframe');ia.sandbox='allow-same-origin allow-forms allow-scripts';ia.src=ga[ha];ia.style.display="none";ia.onload=function(){this.parentNode.removeChild(this);};document.body.appendChild(ia);}}}delete this.idsInWaiting[ba];return h.suppressOnloadToken;};aa.prototype.onFetchError=function(ba){"use strict";this.fetchTime[ba]=Date.now()-this.idsInWaiting[ba];this.idsFetchError[ba]=1;if(this.fetchIndex>=0&&this.ids[this.fetchIndex]==ba)this.showItem(this.fetchIndex);delete this.idsInWaiting[ba];};aa.prototype.onFetchIDs=function(ba){"use strict";this.fetchMoreIDsTimestamp=0;var ca=ba.getPayload(),da=Object.keys(ca),ea=0;for(var fa=0;fa<da.length;++fa){var ga=da[fa];if(this.ids.indexOf(ga)===-1){this.ids.push(ga);this.expireTime[ga]=ca[ga].expireTime;++ea;}}this.noMoreIDs=ea===0;if(ea&&this.index===-1)this.showItem(0);if(this.ids.length===0){l.render(l.createElement(u,{className:"_2pi1"},"There are currently no items for review."+' '+"The items will appear once they are ready."),this.container);setTimeout(this.fetchMoreIDs.bind(this),10000);}};aa.prototype.onFetchIDsError=function(){"use strict";this.fetchMoreIDsTimestamp=0;setTimeout(this.fetchMoreIDs.bind(this),1000);};aa.prototype.fetchMoreItems=function(){"use strict";this.fetchMoreItemsLeft();this.fetchMoreItemsRight();};aa.prototype.fetchMoreItemsLeft=function(){"use strict";var ba=Math.max(this.index-1,-1),ca=Math.max(ba-this.HALF_WINDOW_SIZE,-1),da=-1;this.fetchItemBatchInRange(ba,ca,da);};aa.prototype.fetchMoreItemsRight=function(){"use strict";var ba=Math.min(this.index+1,this.ids.length),ca=Math.min(ba+this.HALF_WINDOW_SIZE,this.ids.length),da=1;this.fetchItemBatchInRange(ba,ca,da);};aa.prototype.fetchItemBatchInRange=function(ba,ca,da){"use strict";var ea=[],fa=-1;for(var ga=ba;ga!==ca&&ea.length<this.BATCH_SIZE;ga+=da)if(this.ids[ga]&&!this.idsInWaiting[this.ids[ga]]&&!this.cacheData[this.ids[ga]]){if(!ea.length)fa=ga;ea.push(this.ids[ga]);}if(ea.length==this.BATCH_SIZE||Math.abs(fa-this.index)<this.BATCH_SIZE)this.fetchItems(ea);};aa.prototype.getJobID=function(){"use strict";if(this.index<0||this.index>=this.ids.length)return 0;return this.ids[this.index];};aa.prototype.getJobInfo=function(){"use strict";var ba=this.getJobID();return this.cacheData[ba].getPayload().job_info;};aa.prototype.getReviewTime=function(){"use strict";var ba=this.getJobID();return ba?Date.now()-this.reviewStartTime[ba]:0;};aa.prototype.submitDecision=function(ba,ca,da,ea){"use strict";var fa=this.decisions[this.getJobID()];if(fa&&fa.decision===ba&&fa.data===ca)return;this.decisions[this.getJobID()]=y(da,{jobid:this.getJobID(),decision:ba,data:ca,review_time_ms:this.getReviewTime(),status_on_client:this.getJobInfo().status});var ga=p.getURIBuilder().getURI(),ha=new h().setURI(ga).setData(this.decisions[this.getJobID()]).setMethod('POST').setHandler(function(){g.inform('ReviewQueue/itemSubmittedOrFailed');});if(!ea)ea=x;var ia=function(){ea.apply(this,arguments);g.inform('ReviewQueue/itemSubmittedOrFailed');};ha.setHandler(ia).setErrorHandler(this.onDecisionError.bind(this,this.getJobID(),ha,this.SUBMIT_RESPONSE_RETRIES));ha.send();g.inform('ReviewQueue/sendItemToSubmit');};aa.prototype.onDecisionError=function(ba,ca,da,ea){"use strict";var fa=ea.transientError;if(fa&&(da>0)){var ga=this.onDecisionError.bind(this,ba,ca,da-1);setTimeout(function(){var ja=ca.getData();ja.is_retry=true;ca.setData(ja);ca.setErrorHandler(ga);ca.send();},this.SUBMIT_RESPONSE_RETRY_DELAY);}else{var ha='Error Processing Decision',ia='Unable to process decision for '+ba;if(fa)ia+=', please try again.';if(!ea.silentError){ha=ea.errorSummary;ia=ea.errorDescription;}g.inform('ReviewQueue/itemSubmittedOrFailed');delete this.decisions[ba];new i().setTitle(ha).setBody(ia).setButtons([i.OK]).show();}};aa.prototype.skipJob=function(){"use strict";var ba=q.getURIBuilder().getURI();new h().setURI(ba).setData({job_id:this.getJobID()}).setMethod('POST').send();};aa.prototype.logJobReason=function(ba){"use strict";var ca=n.getURIBuilder().getURI();new h().setURI(ca).setData({job_id:this.getJobID(),note:ba}).setMethod('POST').send();};aa.prototype.escalateJob=function(){"use strict";var ba=r.getURIBuilder().getURI();new h().setURI(ba).setData({job_id:this.getJobID()}).setMethod('POST').send();};aa.prototype.$ReviewQueueController0=function(ba){"use strict";new i().setBody(ba).setButtons([i.OK]).setAutohide(1000).show();};aa.prototype.$ReviewQueueController1=function(ba,ca){"use strict";var da=ca.getPayload();if(da.jobIDs.length===0){var ea='Failed to update job status, please try again.';this.$ReviewQueueController0(ea);}else{ba();this.$ReviewQueueController0('Successfully updated job status.');}};aa.prototype.changeJobStatus=function(ba,ca){"use strict";var da=s.getURIBuilder().getURI();new h().setURI(da).setData({job_ids:[this.getJobID()],status:ba}).setMethod('POST').setHandler(this.$ReviewQueueController1.bind(this,ca)).setTimeoutHandler(this.CHANGE_STATUS_TIMEOUT,this.$ReviewQueueController0.bind((void 0),'Time out, please try again.')).send();};aa.prototype.ignoreJob=function(){"use strict";var ba=t.getURIBuilder().getURI();new h().setURI(ba).setData({job_id:this.getJobID()}).setMethod('POST').send();};e.exports=aa;},null);