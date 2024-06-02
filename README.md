# Bruin Smoothies

Welcome to the fruit stand! Our customers are thirsty, and they want their smoothies now! Unfortunately, we spilled the ingredients everywhere and they're bouncing around. Help us out by clicking the necessary ingredients to fulfill the recipe!

## TDL
- Transition to 3D
  - Revert watermelon to sphere model?
  - Fix border collisions with banana bc it kinda goes thru rn
- Visuals
  - Fruit are skewed/shearing a little as they move from the center, fix that
  - Fix banana model
  - Fix apple specular (double shine is weird?)
  - Make ingredients spin a little?
- Gameplay
  - Fix collisions
    - Banana shape doesnt match visual
    - Watermelon overlaps w fruits/border before colliding with it
      - I think bc we scaled it to look oval but it only takes up spherical space
    - Parallel collisions make them like orbit each other (rare)
    - Fruit sometimes get stuck on the border and vibrate (rare)
  - Add recipe set (once we have more ingredients) + random selection + display w ctrl panel?
  - Add level system, with speed ups
- General
  - Add more fruits (berries, milk?, peaches, cherries)
    - Peaches and cherries could look similar to apples, cherries smaller + in a pair?
  - Clean/organize code
