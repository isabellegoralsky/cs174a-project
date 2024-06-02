# Bruin Smoothies

Welcome to the fruit stand! Our customers are thirsty, and they want their smoothies now! Unfortunately, we spilled the ingredients everywhere and they're bouncing around. Help us out by clicking the necessary ingredients to fulfill the recipe!

## TDL
- Visuals
  - Fix models
    - Watermelon
      - Revert to sphere model?
    - Banana
      - Fix hitbox - hard to click + weird border collisions (it goes thru the wall a bit)
    - Apple
      - Fix specular, double shine is weird?
    - Blueberry
      - Basic rn, make it look a little cooler, small stem or smth maybe
  - Make ingredients spin a little?
- Gameplay
  - Create level progression system
    - Maintain score across levels
    - Speed up to make it harder
  - Improve recipes
    - More variation (diff amounts, more fruits too, implement multiples of 1 fruit)
    - Use control panel?
  - Fix bugs
    - Error messages in console
      - Audio.play()
      - Laggy
      - tiny-graphics.js:751 Uncaught Error: You are sending a lot of object definitions to the GPU, probably by mistake!  
                    Many of them are likely duplicates, which you don't want since sending each one is very slow.  
                    To avoid this, from your display() function avoid ever declaring a Shape Shader or Texture (or 
                    subclass of these) with "new", thus causing the definition to be re-created and re-transmitted every
                    frame. Instead, call these in your scene's constructor and keep the result as a class member, 
                    or otherwise make sure it only happens once.  In the off chance that you have a somehow deformable 
                    shape that MUST change every frame, then at least use the special arguments of 
                    copy_onto_graphics_card to limit which buffers get overwritten every frame to only 
                    the necessary ones.
        - Pass all shapes to GPU 1x at start maybe? I think we did this in a prev proj
- General
  - Add more fruits (raspberries, strawberries, cherries, blackberries, milk?, peaches)
    - Peaches and cherries could look similar to apples, cherries smaller + in a pair?
  - Clean/organize code
