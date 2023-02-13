//VARIABLES
var PLAY = 1;  
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver1, reinicio;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

//FUNCIÓN PARA CARGAR ANIMACIONES,IMÁGENES Y SONIDOS.
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png"); //Se usa "loadAnimation" cuando es más de una imagen.
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  //Trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  //Suelo
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //Suelo invisible
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  //Gameover
  gameOver1 = createSprite(300,100);
  gameOver1.addImage(gameOverImg);
  gameOver1.scale = 0.5;
  gameOver1.visible=false;

  //Reinicio
  reinicio = createSprite(300,140);
  reinicio.addImage(restartImg);
  reinicio.scale =  0.5;
  reinicio.visible = false;


  
  //Crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  //Radio colisionador 
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  //Declara puntaje
  score = 0;
  
}

function draw() {
  //Fondo
  background(180);

  //Mostrar la puntuación
  text("Puntuación: "+ score, 500,50);
  
  //Estado del juego de PLAY  
  if(gameState === PLAY){
    
    //mover suelo
    ground.velocityX = -4;
    //puntuación
    score = score + Math.round(frameCount/60);

    //Sonido cada 10 puntos
if(score>0 && score & 100 ===0){
  checkPointSound.play();
} 

    //Regresar el suelo a la mitad
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el Trex salte al presionar la barra espaciadora
    if(keyDown("space")&& trex.y >= 150) {
        trex.velocityY = -12;
        jumpSound.play();
    }

  
    
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
      gameOver1.visible = true;  
      reinicio.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //cambiar la animación del trex.
      trex.changeAnimation("collided", trex_collided);
     
      //establecer tiempo de vida a los objetos del juego para que nunca se destruyan
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //evitar que el trex caiga
  trex.collide(invisibleGround);

  if(mousePressedOver(reinicio)){
    reset();
  }
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6+score/100);
   
    //generar obstáculos aleatorios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar tamaño y tiempo de vida al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes 
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar tiempo de vida a la variable
    cloud.lifetime = 134;
    
    //ajustar profundidad.
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar nubes al grupo.
   cloudsGroup.add(cloud);
    }
}

function reset(){
  gameState = PLAY;
  gameOver1.visible=false;
  reinicio.visible = false;
  score=0;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
}
