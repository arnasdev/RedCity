function destroyInterval(interval){
	clearInterval(interval);
	interval = null;
	return interval;
}

/* Player Object */
function Player(){
	var x = (backcanvas.width/2)-(playerSprite.width/12);
    var y = ((backcanvas.height/4.101)*3.10608)-playerSprite.height;
	var health = 100;
	var dmg = playerBaseDmg;
	var groundY = y;
	var jumpTimer = 0;
	var attackCooldownTime = 2;
	var maxHealth = health;
	var jumpStartY;
	var jumpEndY;
	
	/* Sprite Variables */
	var currentFrame = 0;
	var stillFrame = 2;
	var jumpFrame = 3;
	var numFrames = 4;
	var tileSizeX = 84;
	var tileSizeY = 118;
	var width = tileSizeX;
	var height = tileSizeY;
	
	// Cached to increase FPS
	var healthWidth = width*(health/maxHealth);
	var healthBarX = x+(width/2)-healthWidth/2;
	
    /* public methods */
	
	this.draw = draw;
	function draw(){
		fctx.fillStyle="#FF0000";
		fctx.fillRect(healthBarX,y-30,healthWidth,10);
		
		var tileRow = (currentFrame / imageNumTiles) | 0; // Bitwise OR operation
		var tileCol = (currentFrame % imageNumTiles) | 0;
			
		if(playerAttackInterval == true){
			fctx.drawImage(playerSprite, 
					  (5 * tileSizeX-1), 
					  (0), 
					  width+30, 
					  height, 
					  x, 
					  y, 
					  tileSizeX+30, 
					  tileSizeY);
		}
		else{
			fctx.drawImage(playerSprite, 
					  (currentFrame * tileSizeX-1), 
					  (0), 
					  width, 
					  height, 
					  x, 
					  y, 
					  tileSizeX, 
					  tileSizeY);
		}
	}

	
	
	
	// Atack Functions
	this.attack = attack;
	function attack(){
		if(attackCooldownInterval == null || attackCooldownInterval == false){
			if(!scroll){
				characters[1].takeAttack(dmg);
				playerAttackInterval = true;		
				attackCooldownInterval = setInterval(attackCooldown, 300);
			}
		}
	}
	
	function attackCooldown(){
		if(attackCooldownTime == 2){
			playerAttackInterval = false;
		}
		if(attackCooldownTime <= 0 ){
			attackCooldownTime = 2;
			playerAttackInterval = false;
			attackCooldownInterval = destroyInterval(attackCooldownInterval);
			console.log("Attack cooldown off");
		}
		else{
			attackCooldownTime--;
		}
	}
	
	this.takeAttack = takeAttack;
    function takeAttack(dmg){
		if(!blocking){
			setHealth(health - dmg);
			vibrate();
			if(health <= 0){
				playSound(playerDeath);
				return;
			}
			playSound(playerDamage);
		}
		else{
			playSound(playerBlock);
		}
    }
	
	// Jump Functions
	this.jump = jump;
	function jump(){
		jumpEndY = player.getY() - 150;
		if(jumpCooldownInterval == null){
			inAir = true;
			jumpCooldownInterval = true;
			playerJumpInterval = setInterval(jumpUp, 1);
		}
	}
	
	function jumpUp(){
		if(getY() >= jumpEndY+100){
			player.setY(getY()-2);
		}
		else if(getY() >= jumpEndY + 60){
			player.setY(getY()-1.5);
		}
		else if(getY() >= jumpEndY + 30){
			player.setY(getY()-1);
		}
		else{
			playerJumpInterval = destroyInterval(playerJumpInterval);
			playerJumpInterval = setInterval(jumpDown, 1);
		}
		
	}
	
	function jumpDown(){
		if(getY() < groundY-80){
			player.setY(getY()+1);
		}
		else if(getY() < groundY - 40){
			player.setY(getY()+1.5);
		}
		else if(getY() < groundY){
			player.setY(getY()+2);
		}	
		else{
			playerJumpInterval = destroyInterval(playerJumpInterval);
			if(jumpCooldownInterval == true){
				jumpCooldownInterval = setInterval(jumpCooldown, 20);
			}
		}
	}
	
	function jumpCooldown(){
		jumpTimer++;
		if(jumpTimer == 2){
			jumpCooldownInterval = destroyInterval(jumpCooldownInterval);
			jumpTimer = 0;
			inAir = false;
		}
	}
	
    this.setX = setX;
    function setX(newX){
        x = newX;
    }

	this.setY = setY;
    function setY(newY){
        y = newY;
    }
	
	this.setHealth = setHealth;
    function setHealth(newHealth){
        health = newHealth;
		healthWidth = width*(health/maxHealth);
		healthBarX = x+(width/2)-healthWidth/2;
		if(health <= 0){
			dead = true;
		}
    }
	
	this.getHealth = getHealth;
    function getHealth(){
        return health;
    }
	
    this.getX = getX;
    function getX(){
        return x;
    }

    this.getY = getY;
    function getY(){
        return y;
    }
	
	this.getWidth = getWidth;
    function getWidth(){
        return width;
    }

    this.getHeight = getHeight;
    function getHeight(){
        return height;
    }
	
	// Updates players position
	this.update = update;
	function update(){
		if(!blocking){
			currentFrame++;
			if(currentFrame >= 3){
				currentFrame = 0;
			}
		}
		else{
			block();
		}
		
	}
	
	this.stillAnim = stillAnim;
	function stillAnim(){
		currentFrame = stillFrame;
	}
	
	this.shield = shield;
	function shield(){
		if(!scroll){
			blocking = true;
			currentFrame = 4;
		}
	}
	
	this.unblock = unblock;
	function unblock(){
		blocking = false;
	}
	
	this.jumpAnim = jumpAnim;
	function jumpAnim(){
		currentFrame = jumpFrame;
	}
	
	this.getDead = getDead;
    function getDead(){
		if(health <= 0){
			dead = true;
		}
        return dead;
    }
	
	this.destroy = destroy;
    function destroy(){
		dead = true;
    }
}

/* Enemy Object */
function Enemy(sprite, health, dmg){
	var x = backcanvas.width+(backcanvas.width/2);
    var y = ((backcanvas.height/4.101)*3.10608)-sprite.height;
	var sprite = sprite;
	var dmg = dmg;
	var health = health;
	var maxHealth = health;
	var groundY = y;
	var dead = false;
	var maxEnemyAttackCooldownTime = 4;
	var enemyAttackCooldownTime = maxEnemyAttackCooldownTime;
	var enemyAttackInterval = false;
	var hasAttacked = false;

	/* Sprite Variables */
	var currentFrame = 0;
	var stillFrame = 0;
	// var jumpFrame = 3;
	var numFrames = 2;
	var tileSizeX = 93;
	var tileSizeY = 93;
	var width = tileSizeX;
	var height = tileSizeY;
	
	// Cached to increase FPS
	var healthWidth = width*(health/maxHealth);
	var healthBarOffset = (width/2) - (healthWidth/2);
	var healthBarX = x + healthBarOffset;
	
	
    /* public methods */
	this.draw = draw;
	function draw(){
		//fctx.drawImage(sprite, x, y);
		fctx.fillStyle="#FF0000";
		fctx.fillRect(healthBarX,y-30,healthWidth,10);
		
		if(enemyAttackInterval == true){
			fctx.drawImage(sprite, 
						  (tileSizeX), 
						  (0), 
						  118, 
						  height, 
						  x-29, 
						  y, 
						  118, 
						  tileSizeY);
		}
		else{			  
			fctx.drawImage(sprite, 
						  (0), 
						  (0), 
						  width, 
						  height, 
						  x, 
						  y, 
						  tileSizeX, 
						  tileSizeY);
		}
	}
	/*
			if(playerAttackInterval == true){
			fctx.drawImage(playerSprite, 
					  (5 * tileSizeX-1), 
					  (0), 
					  width+30, 
					  height, 
					  x, 
					  y, 
					  tileSizeX+30, 
					  tileSizeY);
		}
	*/
    this.move = move;
    function move(x)
    {
		setX(x);
		healthBarX = x + healthBarOffset;
    }
	
	
    this.setX = setX;
    function setX(newX){
        x = newX;
    }

	this.setY = setY;
    function setY(newY){
        y = newY;
    }
	
	this.setHealth = setHealth;
    function setHealth(newHealth){
        health = newHealth;
		healthWidth = width*(health/maxHealth);
		healthBarX = x+(width/2) - ((width*(health/maxHealth))/2);
    }
	
    this.getX = getX;
    function getX(){
        return x;
    }

    this.getY = getY;
    function getY(){
        return y;
    }
		
	// Attack Functions
	this.takeAttack = takeAttack;
    function takeAttack(dmg){
		setHealth(health - dmg);
		if(health <= 0){
			dead = true;
			playSound(goblinDeath);
			return;
		}
		playSound(goblinDamage);
    }
	
	this.attack = attack;
	function attack(){
		if(enemyAttackCooldownInterval == false || enemyAttackCooldownInterval == null){
			if(hasAttacked){
				characters[0].takeAttack(dmg);
				enemyAttackInterval = true;
			}
			enemyAttackCooldownInterval = setInterval(attackCooldown, 300);
		}
	}
	
	function attackCooldown(){
		if(enemyAttackCooldownTime == maxEnemyAttackCooldownTime){
			enemyAttackInterval = false;
		}
		if(enemyAttackCooldownTime <= 0 ){
			enemyAttackCooldownTime = maxEnemyAttackCooldownTime;
			enemyAttackCooldownInterval = destroyInterval(enemyAttackCooldownInterval);
			console.log("Attack cooldown off");
			hasAttacked = true;
		}
		else{
			enemyAttackCooldownTime--;
		}
	}
	
	this.update = update;
	function update(){
		if(dead == true){
			destroy();
			scroll = true;
			kills++;
		}
	}
	
	this.destroy = destroy;
	function destroy(){
		characters[1] = null;
		characters.splice(1, 1);
	}
}

function Drawable(){
	this.init = function (x,y,width,height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	
	this.draw = function(){
		
	};
}

function Background(){
	var speed = .2;
	
	this.draw = draw;
	function draw(){
		bctx.drawImage(background, this.x, this.y, this.width, this.height);
		bctx.drawImage(background, this.x + backcanvas.width, this.y, this.width, this.height);
	}
	
	this.update = update;
	function update(){
		this.x -= speed;
		if(this.x <= (-1*this.canvasWidth)){
			this.x = 0;
		};
	}
}
Background.prototype = new Drawable();

function Foreground(){
	var speed = .8;
	
	this.draw = draw;
	function draw(){
		bctx.drawImage(foreground, this.x, this.y, this.width, this.height);
		bctx.drawImage(foreground, this.x + backcanvas.width, this.y, this.width, this.height);
	}
	
	this.update = update;
	function update(){
		this.x -= speed;
		// Updates characters
		for(i = 1; i < characters.length; i++){
			characters[i].move(characters[i].getX()-speed);
		}
		
		if(this.x <= (-1*this.canvasWidth)){
			this.x = 0;
		};
	}
}
Foreground.prototype = new Drawable();