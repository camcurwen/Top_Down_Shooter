// new
// 1
// config
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0
      } // Top down game, so no gravity
    }
  },
  pixelArt: false,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// 2
var game = new Phaser.Game(config);
var player, Robot = [], maxEnemies = 10, bullets, HitmanBullets, explosions; 
var enemy, Hitman = [], maxHitman = 5, bullets, HitmanBullets, explosions; 
var enemy, Zombie = [], maxHitman = Zombie > [], bullets, HitmanBullets, explosions; 
function preload() {. //check to see if it is working 
  this.load.atlas('Robot', 'assets/PNG/Robot.png', 'assets/PNG/Robot.json');	
  this.load.atlas('Hitman', 'assets/PNG/Hitman.png', 'assets/Hitman/Hitman.json');
  this.load.atlas('Zombie', 'assets/PNG/Zombie.png', 'assets/Zombie/Zombie.json');
  this.load.image('earth', 'assets/Tilesheet/Distructable Layer.json'); 
  this.load.image('bullet', 'assets/PNG/bullet.png'); 
  this.load.image('gun', 'assets/PNG/gun.png');
  this.load.spritesheet('spritesheet_characters', 'assets/spritesheet/spritesheet_characters.png', { frameWidth: 64, frameHeight: 64 }); 
  this.load.image('tileset', 'assets/Tilesheet/landscape-tileset.png');   
  this.load.tilemapTiledJSON("tilemap", "assets/Tilesheet/Landscape.json);
}

// 3
function create() {
  this.physics.world.on('worldbounds',function(body){
    killBullet(body.gameObject)
  }, this);

  //Load in the tilemap and enable collision for the destructable layer
  this.map = this.make.tilemap({key: "tilemap"});
  var landscape = this.map.addTilesetImage("landscape-tileset", "tileset");
  this.map.createStaticLayer('floor', landscape, 0, 0);
  var destructLayer = this.map.createDynamicLayer('destructable', landscape, 0, 0);
  destructLayer.setCollisionByProperty({ collides: true });
  this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    var w = game.config.width;
    var h = game.config.height;
    player = new PlayerRobot(this, w*0.5, h*0.5, 'Robot', 'Hitman', 'Zombie');
    player.enableCollision(destructLayer);
    var outerFrame = new Phaser.Geom.Rectangle(0,0,w, h);
    var innerFrame = new Phaser.Geom.Rectangle(w*0.25,h*0.25,w*0.5, h*0.5);
    HitmanBullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 10
    })
    var Enemy, loc;
    for(var i = 0; i < maxHitman; i++ , > maxZombie; i++){
      loc = Phaser.Geom.Rectangle.RandomOutside(outerFrame,innerFrame)
      enemy = new Enemy (this, loc.x, loc.y, 'Hitman', 'Zombie', player);
      enemy.enableCollision(destructLayer);
      enemy.setBullets(HitmanBullets);
      enemy.push(Hitman);
      this.physics.add.collider(enemy.hull, player.hull);
      if(i > 0){
        for(var j = 0; j < enemy.length - 1; j++){
          this.physics.add.collider(enemy.hull, enemy[j].hull);
        }
      }
    }
    bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 1
    })
    this.anims.create({
          key: 'explode',
          frames: this.anims.generateFrameNumbers('pow', { start: 0, end: 23, first: 23 }),
          frameRate: 24
      });
    explosions = this.physics.add.group({
        defaultKey: 'pow',
        maxSize: maxEnemies +1
      });
    this.input.on('pointerdown', tryShoot, this);
    this.cameras.main.startFollow(player.hull, true, 0.5, 0.5);
}

// 4
function update(time, delta) {
    player.update();
    for(var i=0;i<enemy.length; i++ ){
      enemy[i].update(time, delta);
    }
}

// 5
function tryShoot(pointer){
  var bullet = bullets.get(player.
  	.x, player.gun.y);
  if(bullet){
    fireBullet.call(this, bullet, player.gun.rotation, Hitmans);
  }
}

// 6 
function fireBullet(bullet, rotation, target){
  bullet.setDepth(3);
  bullet.body.collideWorldBounds = true;
  bullet.body.onWorldBounds = true;
  bullet.enableBody(false);
  bullet.setActive(true);
  bullet.setVisible(true);
  bullet.rotation = rotation;
  this.physics.velocityFromRotation(bullet.rotation, 500, bullet.body.velocity);

  var destructLayer = this.map.getLayer("destructable").tilemapLayer;
  this.physics.add.collider(bullet, destructLayer, damageWall, null, this);

  if(target === player){
    this.physics.add.overlap(player.hull, bullet, bulletHitPlayer, null, this)
  }else{
    for(var i = 0 ; i < Robot.length; i++){
      this.physics.add.overlap(Robot[i].hull, bullet, bulletHitEnemy, null, this);
    }
  }
}

// 7
function killBullet(bullet){
  bullet.disableBody(true, true);
  bullet.setActive(false);
  bullet.setVisible(false);

}

// 8 
function bulletHitEnemy(hull, bullet){
  var enemy;
  var index;
  for(var i = 0; i<enemy.length; i++){
    if(Hitmans[i].hull === hull){
      Hitman = Hitman[i];
      Zombie = Zombie[i];
      index = i;
      break;
    }
  }
  killBullet(bullet);
  enemy.damage();
  // anticipates one hit will disable Hitman
  var explosion = explosions.get(hull.x, hull.y);
  if(explosion){
    activateExplosion(explosion);
    explosion.on('animationcomplete', animComplete, this);
    explosion.play('explode')
  }
  if(enemy.isDestroyed()){
    // remove from Hitmans list
    enemy.splice(index, 1);
  }
};