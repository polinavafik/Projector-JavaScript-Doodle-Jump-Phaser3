# Stardew-Jump-Phaser3

"Stardew Jump" is a simple game, built using the Phaser 3 game engine. Basically, it's a "Doodle Jump" game with "Stardew Valley" inspired design 😉

The game is played on a single screen, which displays the player, the platforms, and the score and max score counters. There are also some turnips-boosters and fly monsters. 

I also added some small animations: 
1) The player is blinking each time we jump on the platform
2) when the player bumps into a fly, there is a crying animation
3) fly has flying animation

There is also background music, sound for jumping, sound for eating a booster, and the "game over" melody.

The platforms, flies, and boosters in the game are randomly generated. The player must jump from one platform to another to avoid falling. If the player falls, the game ends, and the player has to start over from the beginning.

As the player successfully jumps from one platform to another, the game loads new platforms and raises the current screen. The game has a counter for the maximum result, which is displayed on the screen. This counter displays the highest score achieved by the player in their current session. The score is saved using local storage, so even if the player refreshes the page or closes the browser, their highest score will still be saved and displayed the next time they play the game.

The player can move across the screen by moving between the left and right edges of the map. This allows the player to jump on the next platform. The controls for moving our player are simple and can be operated using the arrow keys on the keyboard.
