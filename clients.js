// a little demo ecosystem that betrays my horrifically incomplete knowledge of plant biology

// the oak object - sucks up water, photosynthesises, grows
 

var Officer = Base.extend({  

  constructor: function(Diners, settings) {

    this.Diners = Diners;
    _.extend(this, settings);
    
    this.StartTime = new Date().getTime();
    this.EndTime = this.StartTime + (this.TimeDuration/2 * 1000); 
  }
})

Officer.prototype = { 
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
    this.TargetFood.queue.push(this);
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

    this.StartTime = new Date().getTime();
    this.EndTime = this.StartTime + (this.TimeDuration/2 * 1000); 
  }
});

Diner.prototype = {
  isOpen: function() { return this.stock > 0; },
 
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
  Income : 0
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