# Bruin Smoothies

Welcome to the fruit stand! Our customers are thirsty, and they want their smoothies now! Unfortunately, we spilled the ingredients everywhere and they're bouncing around. Help us out by clicking the necessary ingredients to fulfill the recipe!

## TDL
- Visuals
  - Fix models
    - Fix hitboxes
      - Watermelon & banana hard to click
    - Banana
      - Looks weird
    - Apple
      - Push 2 halves closer together, fix double specular
  - Add more fruits (raspberries, strawberries, cherries, blackberries, milk?, peaches)
    - Peaches and cherries could look similar to apples, cherries smaller + in a pair?
  - Make ingredients spin a little?
  - Shadows?
- Gameplay
  - Mouse picking kinda broken, hitbox/model sizing might be weird (or check radius)
  - Fix collisions
    - Kinda go thru the wall rn
  - Create level progression system
    - Maintain score across levels
    - Speed up to make it harder
  - Improve recipes
    - More variation (diff amounts, more fruits too, implement multiples of 1 fruit)
    - Use control panel?
  - Fix bugs
    - Error messages in console
      - Audio.play()
      - Laggy (fix 'new' creations)
  - Collision - speed up then decel? some randomness?
  - Level timer?
- General
  - Add fun ingredients?
    - Bomb that explodes and knocks stuff back
    - Freeze that freezes screen for a bit (powerup)
    - Fake ingredients
    - Insta lose
  - Clean/organize code
    - Top part with const defns looks ugly
