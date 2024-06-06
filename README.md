# Bruin Smoothies

Welcome to the fruit stand! Our customers are thirsty, and they want their smoothies now! Unfortunately, we spilled the ingredients everywhere and they're bouncing around. Help us out by clicking the necessary ingredients to fulfill the recipe!

## TDL
- Visuals
  - Fix board thing
    - Make the fruits look like they do inside
  - Add more fruits
    - Finish raspberries
    - Strawberries, blackberries
  - Fix models
    - Banana
      - Looks weird, also too small?
      - Hard to click
      - goes thru walls
  - Fix text display
    - Make strikes be red X's
    - Fix rotation
  - Shadows?
  - Make ingredients spin a little?
- Gameplay
  - Fix bugs
    - First clicks dont work
      - Give a few secs to load somehow?
    - Laggy!
      - Crash on reading properties of undefined '0' let new_x = ingredient.center[0] + ingredient.direction[0] * this.speed_mult;
      - [Violation] 'requestAnimationFrame' handler took 67ms
      - Mem leaks?
  - Fix collisions
    - Kinda go thru the wall rn (banana, spawns outside)
    - Sometimes randomly start orbiting each other
  - Improve recipes
    - More variation in amounts/ingredients, once we have more fruit
      - Use kiwis, rasps when done
    - Multiples as x2?
    - Use control panel?
    - Probability of ingredient inclusion?
  - Level system
    - You lost! popup?
    - Change speedup amount? Increase amount of ingredients too?
  - Collision - speed up then decel? some randomness?
  - Level timer?
- General
  - Clean/organize code
    - Top part with const defns looks ugly