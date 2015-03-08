/*!CK:2680647620!*//*1424661797,*/

if (self.CavalryLogger) { CavalryLogger.start_js(["Z7pq7"]); }

__d("StarsInput",["Event","ArbiterMixin","DOM","Parent","Run","copyProperties"],function(a,b,c,d,e,f,g,h,i,j,k,l){function m(n,o){this.root=n;this.hidden=o;this.stars=i.scry(n,'a');this.listeners=[g.listen(this.root,'click',this._onClick.bind(this))];k.onLeave(this.destroyListeners.bind(this));}l(m.prototype,h,{_onClick:function(event){var n=this._getStarIndexFromEvent(event);if(!n)return;this.hidden.value=n;this.inform('stars/value_changed');event.prevent();},_getStarIndexFromEvent:function(event){var n=j.byTag(event.getTarget(),'a');if(n)return this.stars.indexOf(n)+1;return 0;},destroyListeners:function(){this.listeners.forEach(function(n){n&&n.remove();});this.listeners=[];}});a.StarsInput=e.exports=m;},null);
__d("legacy:control-textarea",["TextAreaControl"],function(a,b,c,d){a.TextAreaControl=b('TextAreaControl');},3);