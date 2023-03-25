/**
/   android
/   www.js
/   Rhys
/   02/02/2016
/
*/
// I like this pattern..


// class
function ButtonManager() {
  this._buttons = {};
  this._hammerInstances = {};
}

// same as above, function as a method
ButtonManager.prototype.addTapButton = function(button) {
	button.element.addEventListener("click", function(event){
		event.preventDefault();
	})
	button.element.addEventListener("touch", function(event){
    		event.preventDefault();
    	})
    //button.element.addEventListener("touchstart", this.setStartTouch.bind(this));
    //button.element.addEventListener("touchmove", this.checkMovedTooFar.bind(this));
	this._buttons[button.element.dataset.value] = button;
	var hammer = new Hammer.Manager(button.element);
	var tap = new Hammer.Press({time:10.1});
    hammer.add([tap]);
    hammer.on("tap", this.internalCallBack.bind(this));
    hammer.on("press", this.internalCallBack.bind(this));
    hammer.on("pressup", this.internalCallBack.bind(this));
	this._hammerInstances[button.element.dataset.value] = hammer;
}

ButtonManager.prototype.setStartTouch = function(ev)
{
	console.debug('the evnt', ev);
	this.startX = ev.changedTouches[0].clientX;
	this.startY = ev.changedTouches[0].clientY;
}

ButtonManager.prototype.checkMovedTooFar = function(ev)
{
	var clientX = ev.changedTouches[0].clientX;
	var clientY = ev.changedTouches[0].clientY;

	console.debug('moved evnt', ev, clientX, this.startX);

	console.debug('difference is ', ((this.startX+clientX)/2), ((this.startY+clientY)/2));

	if(((this.startX-clientX)) > 30 || ((this.startX-clientX)) < -30)
	{
		 this.internalCallBack(ev);
		 //console.debug()
	}
	if(((this.startY-clientY)) > 30 || ((this.startY-clientY)) < -30)
	{
		 this.internalCallBack(ev);
		 //console.debug()
	}
}

ButtonManager.prototype.internalCallBack = function(ev)
{
	ev.stopPropagation = function(){console.debug('stop')};
	ev.preventDefault();
	console.debug("ButtonManager : function : internalCallBack -> Event :", ev);

	var button = this._buttons[ev.target.dataset.value];

	if(ev.type === 'press')
	{
		button.callBack(ev.target.dataset.value, false);
	}
	else
	{
		button.callBack(ev.target.dataset.value, true);
	}
}