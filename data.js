/* ---------------------  diner  --------------------------*/
var diner1 = new Diner({
  id : 1,
  name : "ar-harn-tam-sang kao-moo-ob", 
  stock : 50,
  cooking_speed : 2,
  Price : 40,
  Taste : 5,
  Appeal : 4,
  Menus : ["order","kao-moo-ob"],
});  

var diner2 = new Diner({
  id : 2,
  name : "chai-sii-mee-geaw yen-tafoo tom-yam", 
  stock : 30,
  cooking_speed : 2.5,
  Price : 35,
  Taste : 3,
  Appeal : 5,
  Menus : ["noodle", "yen-tafoo-noodle", "tom-yum-noodle"],
}); 

var diner3 = new Diner({
  id : 3,
  name : "yum", 
  stock : 30,
  cooking_speed : 1.5,
  Price : 35,
  Taste : 4,
  Appeal : 4,
  Menus : ["yum", "yum-mama", "kao-yum"],
}); 

var diner4 = new Diner({
  id : 4,
  name : "khuy-teow + khuy-jub", 
  stock : 20,
  cooking_speed : 1.5,
  Price : 35,
  Taste : 2,
  Appeal : 2,
  Menus : ["thai-noodle","khuy-jub"],
}); 

var diner5 = new Diner({
  id : 5,
  name : "som-tam", 
  stock : 30,
  cooking_speed : 3,
  Price : 40,
  Taste : 4,
  Appeal : 5,
  Menus : ["som-tam","kai-yang"],
}); 

var diner6 = new Diner({
  id : 6,
  name : "kha-nom-jean + kao-soi", 
  stock : 30,
  cooking_speed : 0.8,
  Price : 35,
  Taste : 4,
  Appeal : 2,
  Menus : ["kha-nom-jean","kao-soi"],
}); 

var diner7 = new Diner({
  id : 7,
  name : "khuy-teow-nuer", 
  stock : 30,
  cooking_speed : 2.8,
  Price : 40,
  Taste : 5,
  Appeal : 5,
  Menus : ["beef-noodle","duck-noodle"],
}); 

var diner8 = new Diner({
  id : 8,
  name : "ar-harn-nheuar", 
  stock : 30,
  cooking_speed : 1,
  Price : 45,
  Taste : 5,
  Appeal : 5,
  Menus : ["kao-clook-kapi","kanom-jeen","kao-soi","kao-nam-prik"],
}); 

var diner9 = new Diner({
  id : 9,
  name : "nam-warn", 
  type : 'drink',
  stock : 50,
  cooking_speed : 0.5,
  Price : 15,
  Taste : 4,
  Appeal : 2,
  Menus : ["juices","coffee","lum-yai","kra-jeab","oo-leang"],
}); 

var diner10 = new Diner({
  id : 10,
  name : "pepsi", 
  type : 'drink',
  stock : 50,
  cooking_speed : 0.5,
  Price : 15,
  Taste : 4,
  Appeal : 2,
  Menus : ["pepsi","water","ma-praw"],
}); 

var diner11 = new Diner({
  id : 11,
  name : "kao-tom + leard-moo + jok + pat-thai", 
  stock : 30,
  cooking_speed : 2 ,
  Price : 35,
  Taste : 4,
  Appeal : 2,
  Menus : ["tom-leard-moo", "jok", "pat-thai"],
}); 

var diner12 = new Diner({
  id : 12,
  name : "khuy-teow-namtok", 
  stock : 30,
  cooking_speed : 2,
  Price : 35,
  Taste : 5,
  Appeal : 4,
  Menus : ["pork-noodle", "namtok-noodle", "beef-noodle"],
}); 
 
var diner13 = new Diner({
  id : 13,
  name : "kao-moo-dang + moo-krob + pat-sii-eaw + raad-nha", 
  stock : 30,
  cooking_speed : 1.5,
  Price : 35,
  Taste : 4,
  Appeal : 5,
  Menus : ["kao-moo-dang", "kao-moo-krob", "pat-sii-eaw", "raad-nha"],
}); 

var diner14 = new Diner({
  id : 14,
  name : "khuy-teow-tom-yam-moo", 
  stock : 30,
  cooking_speed : 2,
  Price : 35,
  Taste : 3,
  Appeal : 4,
  Menus : ["tom-yam-noodle"],
}); 

var diner15 = new Diner({
  id : 15,
  name : "ar-harn-pak-tai", 
  stock : 30,
  cooking_speed : 1,
  Price : 40,
  Taste : 4,
  Appeal : 5,
  Menus : ["kao-rad-kang"],
}); 

var diner16 = new Diner({
  id : 16,
  name : "tam-sang", 
  stock : 30,
  cooking_speed : 0.8,
  Price : 35,
  Taste : 2,
  Appeal : 2,
  Menus : ["order"],
}); 

var diner17 = new Diner({
  id : 17,
  name : "kao-kha-moo", 
  stock : 30,
  cooking_speed : 1,
  Price : 35,
  Taste : 4,
  Appeal : 3,
  Menus : ["kao-kha-moo"],
}); 

var diner18 = new Diner({
  id : 18,
  name : "jan-suy", 
  stock : 30,
  cooking_speed : 0.8,
  Price : 40,
  Taste : 4,
  Appeal : 4,
  Menus : ["kao-rad-kang"],
}); 

var diner19 = new Diner({
  id : 19,
  name : "kao-mun-kai-ton", 
  stock : 30,
  cooking_speed : 1,
  Price : 35,
  Taste : 4,
  Appeal : 3,
  Menus : ["kao-mun-kai"],
}); 

var diner20 = new Diner({
  id : 20,
  name : "kao-rad-kang-thai", 
  stock : 30,
  cooking_speed : 1,
  Price : 35,
  Taste : 4,
  Appeal : 3,
  Menus : ["kao-rad-kang"],
}); 

var diner = new Diner({
  id : 21,
  name : "kao-rad-kang-raan-mai", 
  stock : 30,
  cooking_speed : 1,
  Price : 40,
  Taste : 4,
  Appeal : 5,
  Menus : ["kao-rad-kang"],
}); 
/* ---------------------  end officer  --------------------------*/

var diners = [diner, diner1,diner2,diner3,diner4,diner5,diner6,diner7,diner8,diner9,diner10,diner11,diner12,diner13,diner14,diner15,diner16,diner17,diner18,diner19,diner20];

/* ---------------------  officer  --------------------------*/

var officer = new Officer(diners, {
  name : "tester", 
  image : {
    src : "img/TheCoffeeShop.png"
  },
  Appetize : 5, //max 10
  Budget : 100,
  TimeSchedule : 9, //max 10
  TimeDuration : 60,  
  Favorites : ["kao-rad-kang","pepsi"],
  Hates : ["beef-noodle", "juices"],
});  
