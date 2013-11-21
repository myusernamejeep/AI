// a little demo ecosystem that betrays my horrifically incomplete knowledge of plant biology

// the oak object - sucks up water, photosynthesises, grows
var gameTimer = 0;
var gameTimerResetTime = 600; //10sec 

var Officer = Base.extend({  

  constructor: function(Diners, settings) {

    this.Diners = Diners || diners;
    _.extend(this, settings);
    var self = this;

    this.canvas = document.querySelector("canvas");
    this.drawingSurface = this.canvas.getContext("2d");
  /*
    this.image = new Image();
    this.image.addEventListener("load", $.proxy( this.update, self )  , false);
    this.image.src = "../img/ogre.png";*/


    this.StartTime = new Date().getTime();
    this.EndTime = this.StartTime + (this.TimeDuration/2 * 1000); 
  }
})


   
Officer.prototype = { 
  /*
  update : function (){    
    this.updateState();    
    
    this.render(); 
    
    gameTimer == gameTimerResetTime ? gameTimer = 0 : gameTimer++;  
    requestAnimationFrame($.proxy( this.update, this ) , this.canvas);
  },

  render :function (){
    this.drawingSurface.clearRect(0, 0, this.canvas.width, this.canvas.height);       
    this.drawingSurface.drawImage(
      this.image, 
      this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight,
      Math.floor(this.x), Math.floor(this.y), this.width, this.height
    );            
  },*/
  //state : "idle",
  Appetize : 5, //max 10
  Budget : 100,
  TimeSchedule : 9, //max 10
  TimeDuration : 60,  

  Job : "officer", 
  PointOfLike : 5,
  Comment : "I 'm hungry",
  Feeling : "normal",
  Friends : 0,
  Favorites : ["rice","pepsi"],
  Hates : ["noodles", "ice_scream"],
 
  FoodBuy : [],
  DrinkBuy : [],
  hasAppetize: function() { return this.Appetize > 1; },
  hasBudget: function() { return this.Budget > 0; },
  hasTimeSchedule: function() { return this.TimeSchedule > 6; },
  hasTimeDuration: function() { return this.TimeDuration > 5; },
  hasFriends: function() { return this.Friends > 0; },
  isFavorites: function(name) { return _.contains( this.Favorites , name);  },
  isHates: function(name) { return _.contains( this.Hates , name);  },
  chooseDiner: function() { 
    
    //console.log('this.Diners ', this.Diners );
    var self = this;
    var sel = _.sortBy(self.Diners, function(diner){ 
       
      //console.log('intersection ', diner.Menus , self.Favorites );

      var matchlikes = _.intersection( diner.Menus , self.Favorites ) || [];
      var matchExcludeUnlikes = _.difference( matchlikes , self.Hates);

      //console.log('matchlikes ', matchlikes );
      //console.log('matchExcludeUnlikes ', matchExcludeUnlikes );
 
      var sorted = [];
      var scroe = 0;
      if( diner.stock > 0){

        if(matchExcludeUnlikes.length > 0){
          // score from Taste + Appeal + ... 
          sorted = _.sortBy(matchExcludeUnlikes, function(match){ return match.Taste + match.Appeal; });
        }
        //console.log('sorted ', sorted );
        if (sorted.length == 0){
          return scroe;
        }else{

          for(var i=0; i < sorted.length; i++ ){
            scroe += (sorted[i].Taste + sorted[i].Appeal); 
          }
          scroe /= sorted.length; 

          return scroe; 
        } 
      }else{
        return scroe;
      }
    });
    //console.log('food_sel ', sel );
 
    var food_sel = sel[0] || self.Diners[ Math.floor( Math.random() * (self.Diners.length - 1) ) ]; 
    this.TargetFood = food_sel;
    this.TargetFoodPrice = food_sel.Price;

    console.log('this.TargetFood ', this.TargetFood, ' this.TargetFoodPrice ', this.TargetFoodPrice );

    /* -------------------------------------- drink --------------------------------------------- */
    var drinke_shop = _.filter(this.Diners, function(diner){ 
      return diner.type == 'drink';
    });
    
    var drink = _.sortBy(drinke_shop, function(diner){ 
       
      var matchlikes = _.intersection( diner.Menus , self.Favorites) || [];
      var matchExcludeUnlikes = _.difference( matchlikes , self.Hates);
      
      var sorted = [];
      var scroe = 0;
      if( diner.stock > 0){

        if(matchExcludeUnlikes.length > 0){
          // score from Taste + Appeal + ... 
          sorted = _.sortBy(matchExcludeUnlikes, function(match){ return match.Taste + match.Appeal; });
        }
        //console.log('sorted ', sorted );
        if (sorted.length == 0){
          return scroe;
        }else{

          for(var i=0; i < sorted.length; i++ ){
            scroe += (sorted[i].Taste + sorted[i].Appeal); 
          }
          scroe /= sorted.length; 

          return scroe; 
        }
        
      }else{
        return scroe;
      }
    });

    var drink_sel = drink[0] || drinke_shop[ Math.floor( Math.random() * (drinke_shop.length - 1) ) ]; 
    this.TargetDrink = drink_sel;
    this.TargetDrinkPrice = drink_sel.Price;

    console.log('this.TargetDrink ', this.TargetDrink, ' this.TargetDrinkPrice ', this.TargetDrinkPrice );

    return true;  
  } ,

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
  
  //state:0, //looking
  state:1, //buying

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
  
  update : function(){          
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
    if(this.Budget <= 0){
      this.buyState = 8;
     
    }    
    switch(this.buyState){
        case 0:
          this.buyInit();         
          break;
          
        case 1:
          this.goToShop();
          break;  
          
        case 2:
          this.queueToBuy();
          break;      
          
        case 3:
          this.isYourQueue();
          break;

        case 4:
          this.buyOrderFood();
          break;
          
        case 5:
          this.goToEatTable();
          break;

        case 6:
          this.eatFood();
          break;
            
        case 7:
          this.buyState = 0;
          break;   

        case 8:
          this.goBack();
          break;
                                 
      }                                       
  },
  buyInit:function(){
    if(this.Budget <= 0){
      this.buyState = 8;
      return false;
    }
    this.angle = Math.random() * 2 * Math.PI; 
    this.chooseDiner();

    this.targetX = this.TargetFood.posX; 
    this.targetY = this.TargetFood.posY;
    this.setDirection( this.targetX - this.x, this.targetY - this.y );    
              
    this.buyState = 1;
  },
  goToShop:function(){    
   
    this.moveTo(this.targetX, this.targetY );
      
      if (this.x == this.targetX && this.y == this.targetY) {
        this.currentFrame = 0;
        this.changeSprite();
        this.buyState = 2;     
        console.log(' --** goToShop complete ', this.name , this.TargetFood);         
      }            
  },
  queueToBuy:function(){ 
    if (_.indexOf(this.TargetFood.queue, this) == -1 && !this.add_to_queue ){
      this.TargetFood.queue.push(this); 
      this.add_to_queue =  true;
      console.log(' --** add to queue , TargetFood.queue size ', this.TargetFood.queue.length );   
    }   
    //this.stand();

    var num_queue = this.TargetFood.queue.length;
    var your_index = _.indexOf(this.TargetFood.queue, this);
    var y = this.targetY + (your_index*this.height);
    this.moveTo(this.targetX, y );
    console.log(' --** your_index ', your_index,  y );   
    /*if( !(gameTimer % 600) ){
      this.angle *= -1;               
      this.setDirection( this.XPos - this.x, this.YPos - this.y );  
      //this.lookState++;  
      console.log(' --** queueToBuy complete ', this.name );   
    }   */  
         
  },
  isYourQueue:function(){
    console.log(' --** isYourQueue ', this.name );
  },
  buyOrderFood:function(){
    this.stand();
    if (this.TargetFood.type == "food"){
      this.Budget -= this.TargetFoodPrice;
    }else if (this.TargetFood.type == "drink"){
      this.Budget -= this.TargetDrinkPrice;
    }  
    console.log(' --** bill | Budget ', this.name, this.Budget );
    this.buyState = 5;     
        
  },
  goToEatTable:function(){
    var your_index = _.indexOf(this.TargetFood.queue, this);
    this.moveTo(500, 500 + (your_index*this.height*Math.random() ) );
    
    if( !(gameTimer % 600) ){
       this.setDirection( this.XPos - this.x, this.YPos - this.y );  
       this.buyState++;   
    } 
  },
  eatFood:function(){
    console.log(' --** eatFood ', this.name );
    if( !(gameTimer % 600) ){
       this.setDirection( this.XPos - this.x, this.YPos - this.y );  
       this.buyState++;   
    } 
  },
  goBack:function(){
    this.moveTo(-128, -128);
    
    if( !(gameTimer % 600) ){
       this.setDirection( this.XPos - this.x, this.YPos - this.y );  
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
  }
};

Officer.states = {

  idle: function() { 
  },
 
  choose: function() {
    //this.state.identifier = "choose"; 
    console.log(' ** choose chooseDiner', this.name, this.state.identifier);
    //this.chooseDiner();
  },

  canChoose: function() { 
    console.log(' -- canChoose', this.name, this.hasAppetize() ,  this.state.identifier , this.hasAppetize() && this.state.identifier == "idle");
    return this.hasAppetize() && this.state.identifier == "idle"; 
  },

  queue: function() {
    //this.state.identifier = "queue"; 
    //this.TargetFood.queue.push(this);
    console.log(' ** queue', this.name, ' length ', this.TargetFood.queue.length);  
  },

  canQueue: function() { 
    console.log(' -- canQueue', this.name, ' this.Budget', this.Budget, 'this.TargetFoodPrice',  this.TargetFoodPrice , 'this.Budget > this.TargetFoodPrice ', this.Budget > this.TargetFoodPrice , this.state.identifier);  
    return this.TargetFoodPrice && this.Appetize < 9 && this.Budget > this.TargetFoodPrice && this.TimeDuration > 0 && this.state.identifier == "choosed"; 
  },

  buyFood: function() {
    //this.state.identifier = "buy"; 
    this.Budget -= this.TargetFoodPrice;
    this.FoodBuy.push(this.TargetFood);

    console.log(' ** buyFood', this.name, this.TargetFoodPrice, this.Budget );
    //this.choose();
  },

  canBuyFood: function() {
    console.log(' -- canBuyFood', this.name, this.Budget > this.TargetFoodPrice ,this.state.identifier );
    
    return this.TargetFoodPrice && this.Budget > this.TargetFoodPrice && this.state.identifier ==  "queue"; 
  },

  buyDrink: function() {
    //this.state.identifier = "buy"; 
    this.Budget -= this.TargetDrinkPrice;
    this.DrinkBuy.push(this.TargetDrink);
    console.log(' ** buyDrink', this.name, this.TargetDrinkPrice, this.Budget );
  }, 

  canBuyDrink: function() {
    console.log(' -- canBuyDrink', this.name, this.Budget > this.TargetDrinkPrice ,this.state.identifier );
    
    return this.TargetDrinkPrice && this.Appetize < 9 && this.Budget > this.TargetDrinkPrice && this.TimeDuration > 0 ;
  },

  bill: function() { 
  }, // nothing to do - just a state

  canBill: function() { 
    console.log(' -- canBill', this.name );
    return this.Budget > 0 && (this.state.identifier == "buyFood" || this.state.identifier == "buyDrink");  
  },
  
  leave: function() {
    console.log(' ** leave', this.name);
  }, 

  canLeave: function() {
    console.log(' -- canLeave', this.name, this.FoodBuy.length , this.DrinkBuy.length );
    this.CurrentTime = new Date().getTime();
    if (this.CurrentTime - this.EndTime > 0 ){
      return true;
    }

    return this.FoodBuy.length > 0 || this.DrinkBuy.length > 0 || this.TimeDuration < 0 || this.Budget < 10;
  },
   
/*
  gatherWater: function() {
    this.water += this.landscape.giveWater();
  },
  canGatherWater: function() { return this.landscape.hasWater(); },*/
};

// the landscape object - rains or shines
var Diner = Base.extend({  

  constructor: function(settings) {
    _.extend(this, settings);

    var self = this;
    this.image = new Image();
    //this.image.addEventListener("load", this.updateLoop , false);
    this.image.addEventListener("load", $.proxy( this.updateLoop, self )  , false);
    
    //console.log(' ------- constructor ', this.cooking_speed);
    
    this.StartTime = new Date().getTime();
    this.EndTime = this.StartTime + (this.TimeDuration/2 * 1000); 
  } 
});

Diner.prototype = {
 
  isOpen: function() { return this.stock > 0; },
 
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 128,
  sourceHeight: 128, 
  x: 0,
  y: 0,
  width: 128,
  height: 128,

  type : 'food',
  _state : "idle",
  stock : 50,
  cooking_speed : 0.5,
  TimeDuration : 6 * 60,

  Price : 35,
  Taste : 1,
  Appeal : 1,
  Menus : ["pat-thai","order"],

  Health : 1,
  Texture : 1,
  Brain : 1,
  Aroma : 1,
  Appearance : 1,
  Volume : 1,
  Rarity : 1,
  Charisma : 1,
 
  queue : [], 
  Income : 0,
  dinerState : 0,
  states:{ IDLE:0,FETCH:1,COOK:2,COOKED:3,BILL:4,CLOSE:5},   
  
  init:function(){    
    this.queue = [];   
  },
  
  update : function(){       
    //console.log(' --**  dinerState ', this.dinerState ); 
 
    switch(this.dinerState){
        case this.states.IDLE:
          this.idle();            
          break;
        case this.states.FETCH:
          this.fetch();           
          break;
        case this.states.COOK:
          this.cook();           
          break;
        case this.states.COOKED:
          this.cooked();           
          break;
        case this.states.BILL:
          this.bill();           
          break;
        case this.states.CLOSE:
          this.close();           
          break;

    }                           
  },
  idle: function() {   
    if( this.stock <= 0 ){
      this.dinerState = 6;
      return false;
    }
    //console.log(' --** idle ', this.name ); 
    this.dinerState = 1;
  },
  fetch: function() {   
    //console.log(' --** fetch queue ', this.queue   ); 
    this.current_queue = _.first(this.queue);  
    if (this.current_queue != undefined && this.queue.length > 0 ){
      console.log(' --** fetch this.current_queue ', this.name, this.current_queue, this.queue   ); 
      this.queue = _.rest(this.queue);  
      this.dinerState = 2;
      this.current_queue.buyState = 3;
      //console.log(' --** fetch ', this.current_queue , this.queue.length ); */
    }
    
  },
  cook: function() {   
    if( this.stock <= 0 ){
      this.dinerState = 6;
      return false;
    }

    if(this.cookTime != undefined){
      return false;
    }
    this.stock -= 1;
    console.log(' --** cook ', this.name, this.cooking_speed, this.stock);
    var self = this;
    this.cookTime = setTimeout(function(){
       self.cook_done = true; 
       console.log(' ** cook | cook_done' );
       self.dinerState = 3; 

        if(this.cookTime != undefined){
          clearTimeout(this.cookTime);
        }
    }, (1/this.cooking_speed) * 1000 ); 

  },
  cooked: function() {   
    this.dinerState = 4;
    this.current_queue.buyState = 4;
    console.log(' --** cooked ', this.current_queue ); 
    
  },
  bill: function() {   
    this.cook_done = false;
    //bill charge from client.
    this.Income += this.Price;
    console.log(' ** bill | Income ', this.name, this.Income, this.Price);
    this.dinerState = 0;
  },
  close: function() {   
    //this.TargetFood.queue.push(this); 
    //this.dinerState = 0;
  },
};

Diner.states = {
  idle: function() {   
  },

  fetch: function() { 
    console.log(' ** fetch', this.name, this.queue.length);
    this.queue = _.rest(this.queue);  
  },

  canFetch: function() { 
    console.log(' -- canFetch', this.name, this.queue.length, this.state.identifier );
    return this.queue.length > 0 && this.state.identifier == "idle"; 
  },

  cooked: function() { 
  },

  canCooked: function() { 
    console.log(' -- canCooked', this.name,  this.state.identifier );
    return this.stock > 0 && this.state.identifier == "cook";  
  },

  cook: function() { 
    var self = this;
    /*
    console.log(' ---------------** cook', this.name, self.cooking_speed);
    if(this.cookTime != undefined){
      clearTimeout(this.cookTime);
    }
    this.cookTime = setTimeout(function(){
       self.cook_done = true; 
       console.log(' ** cook | cook_done' );
    }, (1/self.cooking_speed) * 1000 );

    console.log(' ** cook', this.name, self.cooking_speed);*/
  }, 

  canCook: function() { 
    console.log(' -- canCook', this.name, this.stock , this.state.identifier );
    return this.stock > 0 && this.state.identifier == "fetch";  
  },

  bill: function() {   
  }, // nothing to do - just a state

  canBill: function() { 
    console.log(' -- canBill', this.name, this.cook_done );
    return this.cook_done && this.state.identifier == "cooked"; //Math.random() > 0.1; 
  },

  close: function() {
    console.log(' ** leave', this.name);
  }, 

  canClose: function() {
    console.log(' -- canLeave', this.name, this.Income , this.stock );
    if (this.stock <= 0){
      return true;
    }
    this.CurrentTime = new Date().getTime();
    if (this.CurrentTime - this.EndTime > 0 ){
      return true;
    }

    return false;
  },
};