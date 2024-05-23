import {defs, tiny} from './examples/common.js';
import {custom_shapes} from './assets/shapes.js';
import {custom_shaders} from './assets/shaders.js';
import {custom_scenes} from './assets/scenes.js';
const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene
} = tiny;

class Ingredient {
    constructor(x_pos, y_pos, x_spd, y_spd, rad, mas, 
                shp, mat, shp2=null, mat2=null, shp3=null, mat3=null) {
        this.center = vec3(x_pos, y_pos, 0);
        this.direction = vec3(x_spd, y_spd, 0);
        this.radius = rad;
        this.mass = mas;
        this.shape = shp;
        this.material = mat;
        this.shape2 = shp2;
        this.material2 = mat2;
        this.shape3 = shp3;
        this.material3 = mat3;
    }
}

class Watermelon extends Ingredient {
  constructor(x_pos, y_pos, x_spd, y_spd) {
      const shp = new defs.Subdivision_Sphere(4);
      const mat = new Material(new custom_shaders.WatermelonShader(), {ambient: 1, diffusivity: 0.2, specularity: 1, color: hex_color("#5ab669")});

      super(x_pos, y_pos, x_spd, y_spd, 1.3, 3, shp, mat);
  }
}

class Apple extends Ingredient {
  constructor(x_pos, y_pos, x_spd, y_spd) {
      const shp = new custom_shapes.AppleShape();
      const mat = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: .9, color: hex_color("#ff0800")});

      // leaf
      const shp2 = new defs.Triangle();
      const mat2 = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.1, color: hex_color("#1F9A0E")});

      // stem
      const shp3 = new defs.Square();
      const mat3 = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0, color: hex_color("#594A4B")});

      super(x_pos, y_pos, x_spd, y_spd, .5, 1, shp, mat, shp2, mat2, shp3, mat3);
  }
}

class Orange extends Ingredient {
  constructor(x_pos, y_pos, x_spd, y_spd) {
      const shp = new defs.Subdivision_Sphere(4);
      const mat = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.3, color: hex_color("#ff8100")});

      // leaf
      const shp2 = new defs.Triangle();
      const mat2 = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.1, color: hex_color("#1F9A0E")});

      super(x_pos, y_pos, x_spd, y_spd, .75, 1.5, shp, mat, shp2, mat2);

  }
}

// Banana looks a little weird in 3D, need to move camera angle so it looks normal
class Banana extends Ingredient {
    constructor(x_pos, y_pos, x_spd, y_spd) {
        const shp = new custom_shapes.BananaShape();
        const mat = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.2, color: hex_color("#fdd835")});

        super(x_pos, y_pos, x_spd, y_spd, 0.6, 2, shp, mat);

        this.rotation = 0;
    }

    draw(context, program_state, model_transform) {
        // Draw the banana with rotation
        let shape_mtx = model_transform
            .times(Mat4.translation(this.center[0], this.center[1], 0))
            .times(Mat4.rotation(this.rotation, 1, 0, 0)) // Apply rotation
            .times(Mat4.scale(this.radius, this.radius, this.radius));
        this.shape.draw(context, program_state, shape_mtx, this.material);
    }
}

export class BruinSmoothies extends Scene {
    constructor() {
        super();

        this.initial_camera_location = Mat4.look_at(vec3(0, 0, 25), vec3(0, 0, 0), vec3(0, 1, 0));
        this.width = 36;
        this.height = 20;

        this.border_shape = new custom_shapes.BorderShape();
        this.border_material = new Material(new defs.Basic_Shader(), {color: color(1, 1, 1, 1)});

        this.valid_ingredients = ["Watermelon", "Apple", "Orange", "Banana"];
        this.ingredient_mapping = {
            "Watermelon": Watermelon,
            "Apple": Apple,
            "Orange": Orange,
            "Banana": Banana
        };

        [this.recipe, this.ingredients] = this.setup_level();

        this.score = 0;
        this.click_controls = new custom_scenes.MouseControls(this);
    }

    check_ingredient_click(world_space) {
        for (let i = 0; i < this.ingredients.length; i++) {
            const ingredient = this.ingredients[i];
            const distance = Math.sqrt(
                Math.pow(world_space[0] - ingredient.center[0], 2) +
                Math.pow(world_space[1] - ingredient.center[1], 2)
            );

            if (distance < ingredient.radius) {
                this.score += 1;
                this.ingredients.splice(i, 1);
                this.play_sound('sounds/juicy-splash.mp3');
                break;
            }
        }
    }

    play_sound(path) {
        const audio = new Audio(path);
        audio.play();
    }

    // inclusive, int flag for integers only
    random_number(min=0, max=1, int=false) {
        let num = Math.random() * (max-min) + min;
        num = int ? Math.round(num) : num;
        return num;
    }

    // avoids ingredients spawning at the same location
    generate_valid_position(existing_ingredients, radius, margin) {
        let is_valid_position = false;
        let x, y;

        while (!is_valid_position) {
            is_valid_position = true;
            x = this.random_number(-this.width/2 + radius + margin, this.width/2 - radius - margin);
            y = this.random_number(-this.height/2 + radius + margin, this.height/2 - radius - margin);

            for (let ingr of existing_ingredients) {
                const distance = Math.sqrt(Math.pow(x - ingr.center[0], 2) + Math.pow(y - ingr.center[1], 2));
                if (distance < radius + ingr.radius + margin) {
                    is_valid_position = false;
                    break;
                }
            }
        }

        return [x, y];
    }

    setup_level() {
        const margin = 0.5; // avoid spawn on border
        const ingredient_list = [];
        const total_ingr_count = 10;

        const recipes = {};
        // randomly select a recipe
        const recipe_ingr_count = 0; // get from size of chosen recipe
        // add chosen recipe's ingredients

        const other_ingr_count = total_ingr_count - recipe_ingr_count;
        for (let i = 0; i < other_ingr_count; i++) { // generate random other ingredients
            const ingredient_str = this.valid_ingredients[this.random_number(0, this.valid_ingredients.length-1, true)];
            const ingredient_type = this.ingredient_mapping[ingredient_str];
            const radius = ingredient_type === Watermelon ? 1 : 0.5; // Define radius based on ingredient type
            const [init_x, init_y] = this.generate_valid_position(ingredient_list, radius, margin);
            const init_x_spd = this.random_number(-0.05, 0.05);
            const init_y_spd = this.random_number(-0.05, 0.05);
            ingredient_list.push(new ingredient_type(init_x, init_y, init_x_spd, init_y_spd));
        }

        return [recipes, ingredient_list];
    }

    check_wall_collision(ingredient) {
        const half_width = this.width / 2;
        const half_height = this.height / 2;

        if (ingredient.center[0]-ingredient.radius <= -half_width || ingredient.center[0]+ingredient.radius >= half_width) {
            ingredient.direction[0] *= -1;
        }

        if (ingredient.center[1]-ingredient.radius <= -half_height || ingredient.center[1]+ingredient.radius >= half_height) {
            ingredient.direction[1] *= -1;
        }
    }

    check_ingredient_collision(ingredient1, ingredient2) {
        const x_dist = ingredient1.center[0] - ingredient2.center[0];
        const y_dist = ingredient1.center[1] - ingredient2.center[1];
        const dist = Math.sqrt(x_dist*x_dist + y_dist*y_dist);

        if (dist < ingredient1.radius + ingredient2.radius) {
            const normalX = x_dist / dist;
            const normalY = y_dist / dist;

            const relVelX = ingredient2.direction[0] - ingredient1.direction[0];
            const relVelY = ingredient2.direction[1] - ingredient1.direction[1];

            const velAlongNormal = relVelX * normalX + relVelY * normalY;

            const totalMass = ingredient1.mass + ingredient2.mass;
            const impulseMag = (2 * velAlongNormal) / totalMass;
            const impulseX = impulseMag * normalX;
            const impulseY = impulseMag * normalY;

            ingredient1.direction[0] += impulseX * ingredient2.mass;
            ingredient1.direction[1] += impulseY * ingredient2.mass;
            ingredient2.direction[0] -= impulseX * ingredient1.mass;
            ingredient2.direction[1] -= impulseY * ingredient1.mass;
        }
    }

    draw_border(context, program_state) {
        const model_transform = Mat4.identity();
        this.border_shape.draw(context, program_state, model_transform, this.border_material);
    }

    make_control_panel() {
        // do we need this? maybe for show/hide recipe
        this.key_triggered_button("Put stuff here", ["Control", "0"], () => console.log('test'));
        this.new_line();
        this.key_triggered_button("Score!?", ["Control", "0"], () => console.log('test'));
        this.new_line();
    }

    display(context, program_state) {
        // set up initial stuff
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, .1, 1000);
        program_state.lights = [new Light(vec4(0, 0, 1000, 1), color(1, 1, 1, 1), 10000000)];

        this.draw_border(context, program_state);

        const model_transform = Mat4.identity();

        // check for collisions
        for (let i = 0; i < this.ingredients.length; i++) {
            this.check_wall_collision(this.ingredients[i]);
            for (let j = i + 1; j < this.ingredients.length; j++) {
                this.check_ingredient_collision(this.ingredients[i], this.ingredients[j]);
            }
        }

        // draw each ingredient
        for (let ingredient of this.ingredients) {
            let shape_mtx = model_transform;
            let new_x = ingredient.center[0]+ingredient.direction[0];
            let new_y = ingredient.center[1]+ingredient.direction[1];
            shape_mtx = shape_mtx
                .times(Mat4.translation(new_x, new_y, 0))
                .times(Mat4.scale(ingredient.radius, ingredient.radius, ingredient.radius));

            if (ingredient instanceof Watermelon) {
                shape_mtx = shape_mtx
                    .times(Mat4.scale(1, 1.15, 1)); // make watermelon oval
            }

            let shape_mtx_non_rotate = shape_mtx;
            if (ingredient instanceof Apple) {
                shape_mtx = shape_mtx
                    .times(Mat4.scale(1.5, 1.175, 1.5))
                    .times(Mat4.rotation(Math.PI / 2,0,1,0));
            }

            ingredient.shape.draw(context, program_state, shape_mtx, ingredient.material);

            if (ingredient.shape2 !== null){
                // below line proves Orange enters here
                // ingredient.shape.draw(context, program_state, shape_mtx.times(Mat4.scale(3,3,3)), ingredient.material);
                let leaf_transform = shape_mtx_non_rotate;
                let leaf_offset = Mat4.identity();
                if(ingredient instanceof Apple){
                    leaf_offset = Mat4.translation(0, .25, 0).times(Mat4.rotation(Math.PI / 2, 0, 0, 1));
                    leaf_transform = leaf_transform.times(leaf_offset).times(Mat4.scale(.8,.8, .8));
                }else{
                    // orange
                    leaf_offset = Mat4.translation(0, .8, 0).times(Mat4.rotation(Math.PI / 3, 0, 0, 1));
                    leaf_transform = leaf_transform.times(leaf_offset).times(Mat4.scale(.8,.8, .8));
                }

                ingredient.shape2.draw(context, program_state, leaf_transform, ingredient.material2);
            }

            if (ingredient.shape3 !== null){
                // below line proves Orange enters here
                // ingredient.shape.draw(context, program_state, shape_mtx.times(Mat4.scale(3,3,3)), ingredient.material);
                let stem_transform = shape_mtx_non_rotate.times(Mat4.translation(-.5, .22, 0)).times(Mat4.scale(.1,1, .8));

                ingredient.shape3.draw(context, program_state, stem_transform, ingredient.material3);
            }

            ingredient.center[0] = new_x;
            ingredient.center[1] = new_y;
        }

        if (!this.children.includes(this.click_controls)) {
            this.children.push(this.click_controls);
        }
    }
}