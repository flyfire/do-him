var util = require("util");
var Person = require("./Person").Person;

var Player = function()
{
    this.id = null;
    this.person = new Person();
    this.init = function(id, x, y)
    {
        this.id = id;
        //this.x = x;
        //this.y = y;
        this.person.init();
        util.log("Player: init! id:"+ id);
    };
    
    
    this.get_x = function()
    {
        return this.person.x;
    }
    this.get_y = function()
    {
        return this.person.y;
    }
    
    this.update = function(step)
    {
        //person.walk = true;
        this.person.update(step * 17);
    }
    this.shutdown = function()
    {
        util.log("Player: shutdown! id:");
    };
    this.receive_message = function(step, msg)
    {
        
        if(msg.rotation)
        {
        
            
            util.log("Player: post_message! rotation:" + msg.rotation);
            
            util.log("Player: post_message! x:" + this.get_x());
           
            this.person.setRotation(msg.rotation); 
            this. person.walk = true;
        }
        
           
       
    };
};


exports.Class = Player;

