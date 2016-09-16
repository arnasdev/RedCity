function destroyInterval(interval){
	clearInterval(interval);
	interval = null;
	return interval;
}

function GameObject(img, x, y, width, height){
	var x = x;
	var y = y;
	var img = img;
	var width = width;
	var height = height;
	
	this.draw = draw;
	function draw(){
		mctx.drawImage(img, x, y, width, height);
	}
}