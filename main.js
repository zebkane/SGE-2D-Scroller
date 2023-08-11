// Set up the game object
const game = new engine.Game({
  name: "SGE 2D Scroller",
  loop: loop,
  // Set the game size
  s: {
    h: 500,
    w: 800,
  },
});
// Stop the weird object flashing
game.setFps({
  fps: 1000,
});
// Create a custom gravity property in the game
game.add({
  name: "gravity",
  value: 1.03,
});
// Add a custom list/array property in game that stores the obstacles
game.add({
  name: "obstacles",
  // [] is an empty list
  value: [],
});
// Set up a background image
let background = new engine.Object({
  pos: {
    x: 0,
    y: 0,
  },
  s: {
    w: game.w,
    h: game.h,
  },
  img: "https://img.itch.zone/aW1nLzQ1MzE4MzIucG5n/original/tzKyzs.png",
});

// Create the player
let player = new engine.Object({
  color: "blue",
  img: "https://media.tenor.com/tJX87ej-F3sAAAAi/ra%C3%B1a-pixel.gif",
  s: {
    w: 60,
    h: 100,
  },
});
// Create a custom property to store when the player is jumping/in the air
player.add({
  name: "isJumping",
  value: false,
});
// Create a custom player function that makes the player fall
player.add({
  name: "useGravity",
  value: function () {
    // 100 is the offset between the bottom of the game and the ground in the image
    if (player.pos.y + player.s.h < game.h - 100 && player.isJumping == false) {
      // Using multiplication makes the player speed up as they fall
      player.pos.y *= game.gravity;
    } else if (player.isJumping == true) {
      if (player.pos.y <= 100) {
        player.isJumping = false;
      }
    } else {
      player.pos.y = game.h - player.s.h - 100;
    }
  },
});
// Create a custom function that moves the player jump
player.add({
  name: "move",
  value: function () {
    // Check if the space bar is pressed
    // && means and so this means if uparrow is pressed and the player is not jumping
    if (
      game.key({ key: "arrowup" }) &&
      player.isJumping == false &&
      player.pos.y == game.h - player.s.h - 100
    ) {
      // Set the player as jumping
      player.isJumping = true;
    }

    // Check to see if the player should be jumping
    if (player.isJumping == true) {
      player.pos.y *= 0.98;
    }
  },
});

// Create 10 obsticles
for (let i = 0; i < 10; i++) {
  // Add a new obsticle to the game obsticle array/list
  game.obstacles.push(
    new engine.Object({
      color: "red",
      img: "https://www.digitaltq.com/images/uploads/coromon/db/Froshell_potent.png",
      s: {
        w: 50,
        h: 50,
      },
      pos: {
        // Start them off the right side of the screen
        // + (i * 300) spaces them out becuase i increases by one for each new enmemy created
        x: game.w - 100 + i * 300,
        y: game.h - 50 - 100,
      },
    })
  );
}

// The main loop function which will run every frame
function loop() {
  // Update the background
  background.update();
  // Make the player jump with up arrow
  player.move();
  // Update the player
  player.update();
  // Run the custom function in the player to make it fall
  player.useGravity();

  // Update obsticles and move them at player
  game.obstacles.forEach((obstacle) => {
    obstacle.move({
      x: -2,
    });
    obstacle.update();
  });

  // Check the collision for each obstacle
  game.obstacles.forEach((obstacle) => {
    if (
      engine.collide({
        object1: obstacle,
        object2: player,
      })
    ) {
      game.end();
    }
  });
}

// Start the game
game.begin();
