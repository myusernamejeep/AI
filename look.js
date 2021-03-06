var gameTimer = 0;
var gameTimerResetTime = 600; //10sec

var ogre = {
	states:{ LOOKING:0,BUYING:1},		
	directions:{ DOWN:0, LEFT:1, RIGHT:2, UP:3,},
	
	sourceX: 0,
	sourceY: 0,
	sourceWidth: 50,
	sourceHeight: 67,
	  
	x: 0,
	y: 0,
	width: 50,
	height: 67,
			
	angle: 0,
					
	stepX: 0,
	stepY: 0,
	speed:1,
	
	state:0, //looking
	lookRadius:100,
	lookState:0, //init
	buyState:0, //init
	//sprite animation
	direction: 0,
	numberOfFrames: 3, //0-3
	currentFrame: 0,
	timer: 0,
		
	init:function(){
		this.sourceXPos = this.sourceX;
		this.sourceYPos = this.sourceY;
		
		//save center
		this.XPos = this.x;
		this.YPos = this.y;					
	},
	
	update:function(){					
		switch(this.state){
				case this.states.LOOKING:
					this.look();						
					break;
				case this.states.BUYING:
					this.buy();						
					break;
					
		}														
	},
	buy:function(){
				
		switch(this.buyState){
				case 0:
					this.buyInit();					
					break;
					
				case 1:
					this.choose();
					break;	
					
				case 2:
					this.queueToBuy();
					break;			
					
				case 3:
					this.buyFood();
					break;
					
				case 4:
					this.goToEatTable();
					break;

				case 5:
					this.eatFood();
					break;
						
				case 5:
					this.buyState = 0;
					break;																
			}											    	         		
	},
	buyInit:function(){
		this.angle = Math.random() * 2 * Math.PI;	
			
		this.targetX = this.x + (Math.cos(this.angle) * this.lookRadius); 
		this.targetY = this.y + (Math.sin(this.angle) * this.lookRadius);		
		this.setDirection( this.targetX - this.x, this.targetY - this.y );		
							
		this.buyState = 1;
	},
	choose:function(){		
		this.moveTo(this.targetX, this.targetY );
    	
    	if (this.x == this.targetX && this.y == this.targetY) {
    		this.currentFrame = 0;
    		this.changeSprite();
     		this.buyState = 2;              
     	}	     	     
	},
	queueToBuy:function(){
		
		this.stand();
		
		if( !(gameTimer % 600) ){
			this.angle *= -1;								
			this.setDirection( this.XPos - this.x, this.YPos - this.y );	
			
			this.lookState++; 	
		}								
	},
	look:function(){
				
		switch(this.lookState){
				case 0:
					this.lookInit();					
					break;
					
				case 1:
					this.lookOut();
					break;	
					
				case 2:
					this.lookStand();
					break;			
					
				case 3:
					this.lookIn();
					break;
					
				case 4:
					this.lookStand();
					break;
					
				case 5:
					this.lookState = 0;
					break;																
			}											    	         		
	},
	
	lookInit:function(){
		this.angle = Math.random() * 2 * Math.PI;	
			
		this.targetX = this.x + (Math.cos(this.angle) * this.lookRadius); 
		this.targetY = this.y + (Math.sin(this.angle) * this.lookRadius);		
		this.setDirection( this.targetX - this.x, this.targetY - this.y );		
							
		this.lookState = 1;
	},
	
	lookOut:function(){		
		this.moveTo(this.targetX, this.targetY );
    	
    	if (this.x == this.targetX && this.y == this.targetY) {
    		this.currentFrame = 0;
    		this.changeSprite();
     		this.lookState = 2;              
     	}	     	     
	},
	
	lookIn:function(){
		this.moveTo( this.XPos, this.YPos );
     	
     	if (this.x == this.XPos && this.y == this.YPos) {
    		this.currentFrame = 0;
    		this.changeSprite();
     		this.lookState = 4;              
     	}
	},
	
	lookStand:function(){
		
		this.stand();
		
		if( !(gameTimer % 600) ){
			this.angle *= -1;								
			this.setDirection( this.XPos - this.x, this.YPos - this.y );	
			
			this.lookState++; 	
		}								
	},
	
	moveTo:function(targetX, targetY){
		var vx = targetX - this.x;
		var vy = targetY - this.y; 
		var magnitude = Math.sqrt((vx*vx)+(vy*vy));
				
		vx = vx/magnitude;
    	vy = vy/magnitude;
    	
    	this.stepX = vx * this.speed;
    	this.stepY = vy * this.speed;   
    	        	
    	this.x += this.stepX;
    	this.y += this.stepY;
    	
    	if( !(gameTimer % 10) ){
     		this.updateSpriteAnimation();     		
     	}
     	
     	if ((vx > 0 && this.x + this.speed >= targetX) || (vx < 0 && this.x - this.speed <= targetX)) {
      		this.x = targetX;
     	}
      
     	if ((vy > 0 && this.y + this.speed >= targetY) || (vy < 0 && this.y - this.speed <= targetY)) {
     		this.y = targetY;
     	}
				
	},
	
	stand:function(){
		if( !(gameTimer % 180) ){
			this.direction = Math.floor(Math.random() * 3);					
			this.changeSprite();	
		}
	},
	
	changeSprite:function(){
		this.sourceX = this.currentFrame * this.sourceWidth + this.sourceXPos;
		this.sourceY = this.direction * this.sourceHeight + this.sourceYPos;	
	},
		
	updateSpriteAnimation: function(){						
										
		this.changeSprite();
							
		if(this.currentFrame < this.numberOfFrames){		
			this.currentFrame++;
		}else{
			this.currentFrame = 0;
		}						
	},
	
	setDirection:function( vx, vy ){					
		   if(Math.abs(vx) > Math.abs(vy)){		   	
			   (vx >= 0) ? 
					   this.direction = this.directions.RIGHT : 
					   this.direction = this.directions.LEFT; 
		    	   	
		     }else{		     	
		    	 (vy >= 0)?
		    		 this.direction = this.directions.DOWN :
		    		 this.direction = this.directions.UP;	 			    	     	
		     }
	},
}
 
function update(){		
	ogre.update();		
	
	render();	
	
	gameTimer == gameTimerResetTime ? gameTimer = 0 : gameTimer++;	
	requestAnimationFrame(update, canvas);
}

function render(){
	drawingSurface.clearRect(0, 0, this.canvas.width, this.canvas.height);			 
	drawingSurface.drawImage(
		image, 
		ogre.sourceX, ogre.sourceY, ogre.sourceWidth, ogre.sourceHeight,
		Math.floor(ogre.x), Math.floor(ogre.y), ogre.width, ogre.height
	); 			  		
}
	 