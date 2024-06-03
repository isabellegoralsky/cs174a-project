# Bruin Smoothies

Welcome to the fruit stand! Our customers are thirsty, and they want their smoothies now! Unfortunately, we spilled the ingredients everywhere and they're bouncing around. Help us out by clicking the necessary ingredients to fulfill the recipe!

## TDL
- Visuals
  - Fix models
    - Banana
      - Looks weird, also too small?
      - Hard to click
    - Apple
      - Move 2 sides a little closer together, fix double specular
  - Add more fruits (peaches, strawberries, raspberries, blackberries, milk?)
    - Peaches could look similar to apples
  - Make ingredients spin a little?
  - Shadows?
- Gameplay
  - Mouse picking kinda broken, hitbox/model sizing might be weird (or check radius)
  - Fix collisions
    - Kinda go thru the wall rn (banana, watermelon?)
  - Create level progression system
    - Maintain score across levels
    - 3 strikes and you're out (rotate text)
    - Speed up to make it harder
  - Improve recipes
    - More variation (diff amounts, more fruits too, implement multiples of 1 fruit - like x3)
    - Use control panel?
  - Fix bugs
    - Laggy
  - Sound
    - Make ding when u get points? Or level up? And new sound for collision? Doesn't play pre-click?
  - Collision - speed up then decel? some randomness?
  - Level timer?
- General
  - Add fun ingredients?
    - Bomb that explodes and knocks stuff back
    - Freeze that freezes screen for a bit (powerup)
    - Fake ingredients
    - Insta lose
    - Probabilities of inclusion?
  - Clean/organize code
    - Top part with const defns looks ugly