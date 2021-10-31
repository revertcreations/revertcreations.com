(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"polaroidAnimation_atlas_1", frames: [[121,160,119,110],[0,0,134,158],[0,160,119,118],[136,0,134,158]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.gotoAndPlay = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_4 = function() {
	this.initialize(ss["polaroidAnimation_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["polaroidAnimation_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["polaroidAnimation_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["polaroidAnimation_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.polaroidAnimation = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AjHDIIAAmPIGPAAIAAGPg");
	this.shape.setTransform(29.7846,29.5911,1.4888,1.4794);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.polaroidAnimation, new cjs.Rectangle(0,0,59.6,59.2), null);


(lib.polariod = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {playAnimation:0,"playAnimation":48};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop()
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(49));

	// Layer_1
	this.instance = new lib.CachedBmp_1();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.polaroidAnimation();
	this.instance_1.setTransform(33.2,31.6,1,1,0,0,0,29.8,29.6);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#22B2DA").s().p("AjgELIAAoVIHBAAIAAIVg");
	this.shape.setTransform(33.4824,37.5086,1.4888,1.4794);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.898)").s().p("AkpEoIAApPIJTAAIAAJPg");
	this.shape_1.setTransform(33.175,96.575);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#22B2DA").s().p("AlOGLIAAsVIKdAAIAAMVgAksDtIJSAAIAApPIpSAAg");
	this.shape_2.setTransform(33.5,102.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("rgba(255,255,255,0.8)").s().p("AkpEoIAApPIJTAAIAAJPg");
	this.shape_3.setTransform(33.175,96.575);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("rgba(255,255,255,0.698)").s().p("AkpEoIAApPIJTAAIAAJPg");
	this.shape_4.setTransform(33.175,96.575);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("rgba(255,255,255,0.498)").s().p("AkpEoIAApPIJTAAIAAJPg");
	this.shape_5.setTransform(33.175,96.575);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("rgba(255,255,255,0.349)").s().p("AkpEoIAApPIJTAAIAAJPg");
	this.shape_6.setTransform(33.175,96.575);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("rgba(255,255,255,0.149)").s().p("AkpEoIAApPIJTAAIAAJPg");
	this.shape_7.setTransform(33.175,96.575);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("rgba(255,255,255,0)").s().p("AkpEoIAApPIJTAAIAAJPg");
	this.shape_8.setTransform(33.175,96.575);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("rgba(42,39,39,0)").s().p("AkpEoIAApPIJTAAIAAJPg");
	this.shape_9.setTransform(33.175,55.575);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#22B2DA").s().p("AlOGLIAAsVIKdAAIAAMVgAksDsIJSAAIAApOIpSAAg");
	this.shape_10.setTransform(33.5,61.5);

	this.instance_2 = new lib.CachedBmp_5();
	this.instance_2.setTransform(0,-18,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_2();
	this.instance_3.setTransform(3.4,-14,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_4();
	this.instance_4.setTransform(3.4,-10,0.5,0.5);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#22B2DA").s().p("AlOGLIAAsVIAiAAIJSAAIApAAIAAMVgAksBrIAACBIJSAAIAAiBIAAnNIpSAAg");
	this.shape_11.setTransform(33.5,34.5);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("rgba(42,39,39,0)").s().p("AkpEUIAAnNIJTAAIAAHNgAkpjhIAAgyIJTAAIAAAyg");
	this.shape_12.setTransform(33.175,17.575);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape,p:{y:37.5086}},{t:this.instance_1,p:{y:31.6}}]},1).to({state:[{t:this.shape,p:{y:34.5086}},{t:this.instance_1,p:{y:28.6}}]},1).to({state:[{t:this.shape,p:{y:27.5086}},{t:this.instance_1,p:{y:21.6}}]},1).to({state:[{t:this.shape,p:{y:22.5086}},{t:this.instance_1,p:{y:16.6}}]},1).to({state:[{t:this.shape,p:{y:22.5086}},{t:this.instance_1,p:{y:16.6}}]},1).to({state:[{t:this.shape,p:{y:27.5086}},{t:this.instance_1,p:{y:21.6}}]},1).to({state:[{t:this.shape,p:{y:33.5086}},{t:this.instance_1,p:{y:27.6}}]},1).to({state:[{t:this.shape,p:{y:37.5086}},{t:this.instance_1,p:{y:31.6}}]},1).to({state:[{t:this.shape,p:{y:41.5086}},{t:this.instance_1,p:{y:35.6}}]},1).to({state:[{t:this.shape,p:{y:45.5086}},{t:this.instance_1,p:{y:39.6}}]},1).to({state:[{t:this.shape,p:{y:49.5086}},{t:this.instance_1,p:{y:43.6}}]},1).to({state:[{t:this.shape,p:{y:53.5086}},{t:this.instance_1,p:{y:47.6}}]},1).to({state:[{t:this.shape,p:{y:57.5086}},{t:this.instance_1,p:{y:51.6}}]},1).to({state:[{t:this.shape,p:{y:61.5086}},{t:this.instance_1,p:{y:55.6}}]},1).to({state:[{t:this.shape,p:{y:65.5086}},{t:this.instance_1,p:{y:59.6}}]},1).to({state:[{t:this.shape,p:{y:69.5086}},{t:this.instance_1,p:{y:63.6}}]},1).to({state:[{t:this.shape,p:{y:73.5086}},{t:this.instance_1,p:{y:67.6}}]},1).to({state:[{t:this.shape,p:{y:77.5086}},{t:this.instance_1,p:{y:71.6}}]},1).to({state:[{t:this.shape,p:{y:81.5086}},{t:this.instance_1,p:{y:75.6}}]},1).to({state:[{t:this.shape,p:{y:85.5086}},{t:this.instance_1,p:{y:79.6}}]},1).to({state:[{t:this.shape,p:{y:89.5086}},{t:this.instance_1,p:{y:83.6}}]},1).to({state:[{t:this.shape,p:{y:99.5086}},{t:this.instance_1,p:{y:93.6}}]},1).to({state:[{t:this.shape,p:{y:102.5086}},{t:this.instance_1,p:{y:96.6}}]},2).to({state:[{t:this.shape_2,p:{y:102.5}},{t:this.shape_1}]},4).to({state:[{t:this.shape_2,p:{y:102.5}},{t:this.shape_3}]},1).to({state:[{t:this.shape_2,p:{y:102.5}},{t:this.shape_4}]},1).to({state:[{t:this.shape_2,p:{y:102.5}},{t:this.shape_5}]},1).to({state:[{t:this.shape_2,p:{y:102.5}},{t:this.shape_6}]},1).to({state:[{t:this.shape_2,p:{y:102.5}},{t:this.shape_7}]},1).to({state:[{t:this.shape_2,p:{y:102.5}},{t:this.shape_8,p:{y:96.575}}]},1).to({state:[{t:this.shape_2,p:{y:102.5}},{t:this.shape_8,p:{y:96.575}}]},7).to({state:[{t:this.shape_2,p:{y:84.5}},{t:this.shape_8,p:{y:78.575}}]},1).to({state:[{t:this.shape_10},{t:this.shape_9,p:{y:55.575}}]},1).to({state:[{t:this.shape_2,p:{y:39.5}},{t:this.shape_9,p:{y:33.575}}]},1).to({state:[{t:this.instance_3},{t:this.instance_2,p:{y:-18}}]},1).to({state:[{t:this.instance_4},{t:this.instance_2,p:{y:-14}}]},1).to({state:[{t:this.shape_12},{t:this.shape_11}]},1).to({state:[{t:this.shape,p:{y:39.5086}},{t:this.instance_1,p:{y:33.6}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-18,67,160);


// stage content:
(lib.polaroidPhoto = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {polaroid:0};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// layout
	this.photo = new lib.polariod();
	this.photo.name = "photo";
	this.photo.setTransform(33.5,-23.5,1,1,0,0,0,33.5,39.5);

	this.timeline.addTween(cjs.Tween.get(this.photo).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(33,-23.5,34,39.5);
// library properties:
lib.properties = {
	id: '657C9928CB4F6C4BBE03118A2B970F37',
	width: 66,
	height: 79,
	fps: 24,
	color: "#FFFFFF",
	opacity: 0.00,
	manifest: [
		{src:"images/polaroidAnimation_atlas_1.png?1635659919333", id:"polaroidAnimation_atlas_1"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['657C9928CB4F6C4BBE03118A2B970F37'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;