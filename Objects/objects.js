function destroyInterval(interval){
	clearInterval(interval);
	interval = null;
	return interval;
}

function GameObject(){
	this.init = function (img, x, y, width, height){
		this.img = img;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	this.draw = draw;
	function draw(){
		mctx.drawImage(img, x, y, width, height);
	}

	this.setImg = setImg;
	function setImg(newImg){
		img = newImg;
	}


}

function Building(){
	this.draw = draw;
	function draw(){
		mctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}

	this.setX = setX;
	function setX(newX){
		this.x = newX;
	}
	
	this.setY = setY;
	function setY(newY){
		this.y = setY;
	}
	
	this.setWidth = setWidth;
	function setWidth(setWidth){
		this.width = newWidth;
	}
	
	this.setHeight = setHeight;
	function setHeight(newHeight){
		this.height = newHeight;
	}
}
Building.prototype = new GameObject();

function Background(){
	this.draw = draw;
	function draw(){
		mctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}
	
	this.setX = setX;
	function setX(newX){
		this.x = newX;
	}
	
	this.getX = getX;
	function getX(){
		return this.x;
	}
	
	
	this.setY = setY;
	function setY(newY){
		this.y = setY;
	}
	
	this.setWidth = setWidth;
	function setWidth(setWidth){
		this.width = newWidth;
	}
	
	this.setHeight = setHeight;
	function setHeight(newHeight){
		this.height = newHeight;
	}
	
	
}
Background.prototype = new GameObject();
