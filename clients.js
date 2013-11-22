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
  
    this.StartTime = new Date().getTime();
    this.EndTime = this.StartTime + (this.TimeDuration/2 * 1000); 
  }
})


   
Officer.prototype = { 
 
  Appetize : 9, //max 10
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

    console.log('I choose to order ' , this.TargetFood , '  Price ', this.TargetFoodPrice );

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

    console.log('I choose to order Drink ', this.TargetDrink, ' Price ', this.TargetDrinkPrice );

    return true;  
  } ,

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
  action:1, //buying

  lookRadius:100,
  lookState:0, //init
  buyState:0, //init
  //sprite animation
  direction: 0,
  numberOfFrames: 3, //0-3
  currentFrame: 0,
  timer: 0,
  actions : { LOOKING: 0, BUYING:1 },
  states:{ INIT:0, GOTOSHOP:1, QUEUETOBUY:2, ISYOURQUEUE:3, WAITFORCOOK:4, GETORDERFOOD:5, GOTO_TABLE_EATZONE:6, EATFOOD:7, RESET:8, GO_BACK:9},   
    
  init:function(){
    this.sourceXPos = this.sourceX;
    this.sourceYPos = this.sourceY;
    
    //save center
    this.XPos = this.x;
    this.YPos = this.y;     
  
  },
  
  update : function(){          
    switch(this.action){
        case this.actions.LOOKING:
          this.look();            
          break;
        case this.actions.BUYING:
          this.buy();           
          break;
          
    }                           
  },
  buy:function(){
 
    
    if(this.Budget <= 0){
      this.buyState = this.states.GO_BACK;
    }    
 
    switch(this.buyState){
        case this.states.INIT:
          this.buyInit();         
          break;
          
        case this.states.GOTOSHOP:
          this.goToShop();
          break;  
          
        case this.states.QUEUETOBUY:
          this.queueToBuy();
          break;      
          
        case this.states.ISYOURQUEUE:
          this.isYourQueue();
          break;

        case this.states.WAITFORCOOK:
          this.waitForCook();
          break;

        case this.states.GETORDERFOOD:
          this.getOrderFood();
          break;
          
        case this.states.GOTO_TABLE_EATZONE:
          this.goToEatTable();
          break;

        case this.states.EATFOOD:
          this.eatFood();
          break;
            
        case this.states.RESET:
          this.buyState = 0;
          break;   

        case this.states.GO_BACK:
          this.goBack();
          break;
                                 
      }                                       
  },
  buyInit:function(){
    if(this.Budget <= 0 || this.Appetize < 1){
      this.buyState = this.states.GO_BACK;
      return false;
    }
    this.angle = Math.random() * 2 * Math.PI; 
    this.chooseDiner();

    this.targetX = this.TargetFood.posX; 
    this.targetY = this.TargetFood.posY;
    this.setDirection( this.targetX - this.x, this.targetY - this.y );    
              
    this.buyState = this.states.GOTOSHOP;
  },
  goToShop:function(){    
   
    this.moveTo(this.targetX, this.targetY );
 
    if (this.x == this.targetX && this.y == this.targetY) {
      this.currentFrame = 0;
      this.changeSprite();
      this.buyState = this.states.QUEUETOBUY;     
      console.log(' --** I walk to '+ this.name + ' complete. I think I wil buy one of ' +  this.TargetFood.name + ' which cost ' + this.TargetFood.Price);         
    }         
  },
  queueToBuy:function(){ 
    if (_.indexOf(this.TargetFood.queue, this) == -1 && !this.add_to_queue ){
      this.TargetFood.queue.push(this); 
      this.add_to_queue =  true;
      console.log(' --** I go to queue at row of this shop , row queue size is ', this.TargetFood.queue.length );   
    }   
    this.stand();

    var num_queue = this.TargetFood.queue.length;
    var your_index = _.indexOf(this.TargetFood.queue, this);
    var y = this.targetY + (your_index*this.height);
    this.moveTo(this.targetX, y );
    console.log(' --** my queue is #' + your_index,  y );   
 
  },
  isYourQueue:function(){
    console.log(' --** I is my turn , my queue ' );
    console.log(' >> I want to order 1 of ' + this.TargetFood.name + ', which cost : ' + this.TargetFood.Price );  
  },
  waitForCook:function(){
    console.log(" --** I 'm waiting for my order ... ", this.name );
  },
  getOrderFood:function(){
    this.stand();
    if (this.TargetFood.type == "food"){
      this.Budget -= this.TargetFoodPrice;
    }else if (this.TargetFood.type == "drink"){
      this.Budget -= this.TargetDrinkPrice;
    }  
    console.log(' --** I bill for '+ this.name + '. My budget is ' + this.Budget );
    this.buyState = this.states.GOTO_TABLE_EATZONE;     

    var your_index = _.indexOf(this.TargetFood.queue, this);
    this.eatZoneX = 500;
    this.eatZoneY = 500 + ( your_index * this.height * Math.random() )
        
  },
  goToEatTable:function(){
    this.moveTo(this.eatZoneX, this.eatZoneY);
    
    if (this.x == this.eatZoneX && this.y == this.eatZoneY) {  
      console.log(" --** I 'm at the eat zone, sit down on mychair to eatfood. ", this.name );
      this.setDirection( this.XPos - this.x, this.YPos - this.y );  
      this.buyState = this.states.EATFOOD; 

      this.eatTimeOut = new Date().getTime() + (10 * 1000);
      
    } 
  },
  eatFood:function(){
    console.log(" --** I 'm eating food ", this.name );
    if( !(gameTimer % 600) ){
      console.log(" --** do eating anim ... ", this.name );
      this.setDirection( this.XPos - this.x, this.YPos - this.y );        
    } 

    this.now = new Date().getTime()
    if (this.now - this.eatTimeOut > 0 ){
        // eat done
        console.log(" --** I eaten my food. ", this.name );   
        this.Appetize -= Math.floor(Math.random()*4) ;
        this.buyState = this.states.RESET; 
    }  
  },
  goBack:function(){
    this.moveTo(-128, -128);
    if( !(gameTimer % 600) ){
      console.log(" --** I 'm done. I will go back to my work now. ", this.name );    
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
    
    if (this.stepX){
      this.x += this.stepX;
    }          
      
    if (this.stepY){
      this.y += this.stepY;
    }          
      
    
    if( !(gameTimer % 10) ){
      this.updateSpriteAnimation();         
    }
    
    if ((vx > 0 && this.x + this.speed >= targetX) || (vx < 0 && this.x - this.speed <= targetX) && targetX ) {
        this.x = targetX;
    }
    
    if ((vy > 0 && this.y + this.speed >= targetY) || (vy < 0 && this.y - this.speed <= targetY) && targetY ) {
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
 
 
var Diner = Base.extend({  
  constructor: function(settings) {
    _.extend(this, settings);
    var self = this;
    this.image = new Image();
    this.image.addEventListener("load", $.proxy( this.updateLoop, self )  , false);
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
      this.dinerState = this.states.CLOSE;
      return false;
    }
    //console.log(' --** idle ', this.name ); 
    this.dinerState = 1;
  },
  fetch: function() {   
    //console.log(' --** fetch queue ', this.queue   ); 
    this.current_queue = _.first(this.queue);  
    if (this.current_queue != undefined && this.queue.length > 0 ){
      console.log(' --** I fetch client order from queue ', this.name, this.current_queue, this.queue   ); 
      this.queue = _.rest(this.queue);  
      this.dinerState = this.states.COOK;
      this.current_queue.buyState = this.states.ISYOURQUEUE;
      //console.log(' --** fetch ', this.current_queue , this.queue.length ); */
    }
    
  },
  cook: function() {   
    if( this.stock <= 0 ){
      this.dinerState = this.states.CLOSE;
      return false;
    }

    if(this.cookTime != undefined){
      return false;
    }
    this.stock -= 1;
    console.log(" --** I 'm cooking for your order ", this.name, this.cooking_speed, this.stock);
    var self = this;
    self.cookTime = setTimeout(function(){
       self.cook_done = true; 
       console.log(" ** I 's  done! ");
       self.dinerState = self.states.COOKED; 

        if(self.cookTime != undefined){
          clearTimeout(self.cookTime);
        }
    }, (1/self.cooking_speed) * 1000 ); 

  },
  cooked: function() {   
    this.dinerState = this.states.BILL;
    this.current_queue.buyState = 4;
    console.log(' --** We cooked!', this.current_queue );   
  },
  bill: function() {   
    this.cook_done = false;
    //bill charge from client.
    this.Income += this.Price;
    console.log(' ** We will get bill and receive income amount '+ this.Price + '. For all income total are ' + this.Income );
    this.dinerState = this.states.IDLE;
  },
  close: function() {   
    console.log(' ** We will close my shop now.', this.name );
  },
};
 