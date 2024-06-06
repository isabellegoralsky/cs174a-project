# Bruin Smoothies

Welcome to the fruit stand! Our customers are thirsty, and they want their smoothies now! Unfortunately, we spilled the ingredients everywhere and they're bouncing around. Help us out by clicking the necessary ingredients to fulfill the recipe!

## TDL
- Visuals
  - Fix board thing
    - Make the fruits look like they do inside
  - Add more fruits
    - Finish raspberries
    - Strawberries
  - Fix models
    - Banana
      - Looks weird, also too small?
      - Hard to click
- Gameplay
  - Fix bugs
    - First clicks dont work
      - Give a few secs to load somehow?
    - Laggy!
      - Crash on reading properties of undefined '0' let new_x = ingredient.center[0] + ingredient.direction[0] * this.speed_mult;
        - From level prog
      - [Violation] 'requestAnimationFrame' handler took 67ms
      - Mem leaks?
  - Fix collisions
    - Sometimes randomly start orbiting each other
  - Improve recipes
    - More variation in amounts/ingredients, once we have more fruit
      - Use kiwis + straw/raspberries
    - Use control panel?
    - Probability of ingredient inclusion?
  - Level system
    - Change speedup amount?
- General
  - Clean/organize code
    - Top part with const defns looks ugly
