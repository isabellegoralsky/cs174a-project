# Bruin Smoothies

Welcome to the fruit stand! Our customers are thirsty, and they want their smoothies now! Unfortunately, we spilled the ingredients everywhere and they're bouncing around. Help us out by clicking the necessary ingredients to fulfill the recipe!

## TDL
- Visuals
  - Fix board thing
    - Add texture idk why its not working
    - Make the shapes look how theyr're supposed to
  - Add more fruits
    - Strawberries, kiwis, raspberries, blackberries
  - Fix models
    - Banana
      - Looks weird, also too small?
      - Hard to click
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
      - [Violation] 'requestAnimationFrame' handler took 67ms
      - Mem leaks?
    - Crash on generating '0' in line 611 col 68??
  - Fix collisions
    - Kinda go thru the wall rn (banana, watermelon? spawns outside)
    - Sometimes randomly start orbiting each other
  - Improve recipes
    - More variation in amounts/ingredients, once we have more fruit
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