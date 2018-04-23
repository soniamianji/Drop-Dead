//global variables
var player, platfroms, ground,background,cursors, ledge,MaxCameraY,platformPool,yStorage,base;

MaxCameraY = 0;
ledgeArr =[];
counter = 0;

var Game = {
    
    preload: function(){
        game.load.spritesheet('player', './assets/images/player.png', 32,48);
        game.load.image('ground', './assets/images/ground.png');
        game.load.image('base', './assets/images/base.png')
    },

    create: function(){
        //bg color
        game.stage.backgroundColor = "#4488AA";


        
        //scaling options
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.maxWidth = this.game.width;
        game.scale.maxHeight = this.game.height;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

          //physic enabled
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.generatePlatforms();
        this.createPlayer();
     
         //  Our controls.
         cursors = game.input.keyboard.createCursorKeys();
        },



    update: function(){
         //setBounds(x, y, width, height)
            //Updates the size of this world and sets World.x/y to the given values The Camera bounds and Physics bounds (if set) are also updated to match the new World bounds.
            // the y offset and the height of the world are adjusted
            // to match the highest point the hero has reached
    game.world.setBounds(0 ,-player.changingYPos,game.world.width  , game.world.height + player.changingYpos);
        

    game.camera.y = player.y - 300;

    
    if (game.camera.y < MaxCameraY)
    {
        MaxCameraY = game.camera.y;
    }
    
    if(Math.abs(player.y - MaxCameraY) > 0)
    {
        game.camera.y = MaxCameraY;
      
    }


    //platform Collision
    var hitPlatform = game.physics.arcade.collide(player, platformPool);
    var hitBase = game.physics.arcade.collide(player,base);

    platformPool.forEachAlive(function(ledge){
        if( ledge.y >= game.camera.y+game.camera.height){
     
            yStorage = ledge.y - 600;
            console.log(yStorage);

            ledge.x = game.rnd.integerInRange(0, game.world.width -50);
            ledge.y = yStorage ;
          /*  yStorage = ledge.y - 300;
            ledge.kill(); 
           console.log( platformPool.countDead());
           this.createNewLedge(game.rnd.integerInRange(0, game.world.width -50), yStorage - 100);*/
     } },this);

  


     //movement
     if (cursors.left.isDown)
     {
         //  Move to the left
        player.body.velocity.x = -150;
 
     }
     else if (cursors.right.isDown)
     {
         //  Move to the right
         player.body.velocity.x = 150;
     }
     else
     {
        
         player.body.velocity.x = 0;
         
     }
     
      //Allow the player to jump if they are touching the ground.
     if ( player.body.touching.down && hitPlatform || hitBase)
     {
         player.body.velocity.y = -300;
          player.body.gravity.y = 300;
         
     }
    

         // wrap world coordinated so that you can warp from left to right and right to left
        game.world.wrap(player,0,true,true,false);
        
    // track the maximum amount that the player has travelled
        player.changingYPos = Math.max( player.changingYPos, Math.abs( player.y - player.startYPos) );
      

        
    },
    

    createPlayer: function(){
        player = game.add.sprite(game.world.centerX, game.world.height - 100, 'player');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);
        player.anchor.setTo(0.5,0,5);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = false;
        player.body.checkCollision.up = false;
        player.body.checkCollision.left = false;
        player.body.checkCollision.right = false;
        player.startYPos = player.y ;
        player.changingYPos = 0;
    },

    generatePlatforms: function(){
    
       //starting point, 
       base = game.add.sprite(0,game.world.height -50,'base');
       base.scale.setTo(0.4,0.4);
       game.physics.arcade.enable(base);
       base.body.immovable =true;


        //grouping the platforms
       platformPool = game.add.group();
       platformPool.enableBody = true;

     for (var i= 0; i < 10; i++){
        var randomX =game.rnd.integerInRange(0, game.world.width -50);
        var randomY = game.world.height -100 *i; 
        ledge =  game.add.sprite(randomX,randomY,'ground');
        platformPool.add(ledge);
        ledge.scale.setTo(0.3,0.3);
        ledge.body.immovable = true;
     }
   
    },


  createNewLedge: function(x,y){
    var ledge = platformPool.getFirstDead();
    ledge.reset(x,y);
    ledge.scale.setTo(0.3,0.3);
}


};







