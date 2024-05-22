import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Ingredient {
    constructor(x_pos, y_pos, x_spd, y_spd, rad, shp, mat) {
        this.center = vec3(x_pos, y_pos, 0);
        this.direction = vec3(x_spd, y_spd, 0);
        this.radius = rad;
        this.shape = shp;
        this.material = mat;
    }
}

class Watermelon extends Ingredient {
  constructor(x_pos, y_pos, x_spd, y_spd) {
      const mat = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.2, color: hex_color("#5ab669")});
      const shp = new defs.Subdivision_Sphere(4);
      super(x_pos, y_pos, x_spd, y_spd, 1, shp, mat);
  }
}

class Apple extends Ingredient {
  constructor(x_pos, y_pos, x_spd, y_spd) {
      const mat = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.2, color: hex_color("#cc2525")});
      const shp = new defs.Subdivision_Sphere(4);
      super(x_pos, y_pos, x_spd, y_spd, 0.5, shp, mat);
  }
}

class Orange extends Ingredient {
  constructor(x_pos, y_pos, x_spd, y_spd) {
      const mat = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.2, color: hex_color("#f68f24")});
      const shp = new defs.Subdivision_Sphere(4);
      super(x_pos, y_pos, x_spd, y_spd, 0.5, shp, mat);
  }
}

// other fruit shapes? berry banana etc
// sprite images somehow?? textures? (assn 4?)
// if we do bananas, we could make them rotate/spin too for fun?

const BananaShape = defs.BananaShape = class BananaShape extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");
        const segments = 50; // More segments for smoother curves
        const radius = 0.4; // Thickness of the banana
        const length = 4.0; // Length of the banana
        const curve_radius = 2.0; // Radius of the curve of the banana

        // Create the banana shape using cylindrical segments around the curve
        for (let i = 0; i <= segments; i++) {
            const angle = Math.PI / segments * i;
            const x = curve_radius * Math.sin(angle);
            const y = length / segments * i - length / 2;
            const z = curve_radius * Math.cos(angle) - curve_radius;

            // Create circular segments along the banana
            for (let j = 0; j <= segments; j++) {
                const theta = 2 * Math.PI / segments * j;
                const nx = radius * Math.cos(theta);
                const nz = radius * Math.sin(theta);
                this.arrays.position.push(vec3(x + nx, y, z + nz));
                this.arrays.normal.push(vec3(nx, 0, nz).normalized());
                this.arrays.texture_coord.push(vec(i / segments, j / segments));
            }
        }

        // Create indices for the triangular segments
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const first = i * (segments + 1) + j;
                const second = first + segments + 1;
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }

    }
}


// Banana looks a little weird in 3D, need to move camera angle so it looks normal
class Banana extends Ingredient {
    constructor(x_pos, y_pos, x_spd, y_spd) {
        const mat = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.2, color: hex_color("#fdd835")});
        const shp = new defs.BananaShape(); // Use the custom banana shape
        super(x_pos, y_pos, x_spd, y_spd, 0.5, shp, mat); // Adjust the radius as needed
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


class BorderShape extends Shape {
    constructor() {
        super("position", "color");
        const border_color = color(0.75, 0, 0.25, 1);
        const thickness = 0.2;
        const width = 36;
        const height = 20;
        this.arrays.position = [
            // Bottom border
            vec3(-width / 2 - thickness, -height / 2 - thickness, 0), vec3(width / 2 + thickness, -height / 2 - thickness, 0),
            vec3(width / 2 + thickness, -height / 2, 0), vec3(-width / 2 - thickness, -height / 2, 0),

            // Top border
            vec3(-width / 2 - thickness, height / 2, 0), vec3(width / 2 + thickness, height / 2, 0),
            vec3(width / 2 + thickness, height / 2 + thickness, 0), vec3(-width / 2 - thickness, height / 2 + thickness, 0),

            // Left border
            vec3(-width / 2 - thickness, -height / 2 - thickness, 0), vec3(-width / 2, -height / 2 - thickness, 0),
            vec3(-width / 2, height / 2 + thickness, 0), vec3(-width / 2 - thickness, height / 2 + thickness, 0),

            // Right border
            vec3(width / 2, -height / 2 - thickness, 0), vec3(width / 2 + thickness, -height / 2 - thickness, 0),
            vec3(width / 2 + thickness, height / 2 + thickness, 0), vec3(width / 2, height / 2 + thickness, 0),
        ];
        this.arrays.color = [
            border_color, border_color, border_color, border_color,
            border_color, border_color, border_color, border_color,
            border_color, border_color, border_color, border_color,
            border_color, border_color, border_color, border_color
        ];
        this.indices.push(0, 1, 2, 0, 2, 3); // Bottom border
        this.indices.push(4, 5, 6, 4, 6, 7); // Top border
        this.indices.push(8, 9, 10, 8, 10, 11); // Left border
        this.indices.push(12, 13, 14, 12, 14, 15); // Right border
    }
}


export class BruinSmoothies extends Scene {
    constructor() {
        super();

        // make it frame the game better if possible
        this.initial_camera_location = Mat4.look_at(vec3(0, 0, 25), vec3(0, 0, 0), vec3(0, 1, 0));
        this.width = 36;
        this.height = 20;

        this.border_shape = new BorderShape();
        this.border_material = new Material(new defs.Basic_Shader(), {color: color(1, 1, 1, 1)});


        this.valid_ingredients = ["Watermelon", "Apple", "Orange", "Banana"];
        this.ingredient_mapping = {
            "Watermelon": Watermelon,
            "Apple": Apple,
            "Orange": Orange,
            "Banana": Banana
        };

        [this.recipe, this.ingredients] = this.setup_level();
    }

    random_number(min=0, max=1, int=false) { // inclusive, int for integers only
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
        const total_ingr_count = 4;
        const ingredient_list = [];
        const recipe = {}; // pick from set options?
        const margin = 0.5; // Margin to avoid spawning on the border
        const recipe_ingr_count = 0; // get from recipe size
        const other_ingr_count = total_ingr_count - recipe_ingr_count;
        for (let i = 0; i < other_ingr_count; i++) { // generate random other ingredients
            const ingredient_type = this.valid_ingredients[this.random_number(0, this.valid_ingredients.length-1, true)];
            const radius = ingredient_type === "Watermelon" ? 1 : 0.5; // Define radius based on ingredient type
            const [init_x, init_y] = this.generate_valid_position(ingredient_list, radius, margin);
            const init_x_spd = this.random_number(-0.05, 0.05);
            const init_y_spd = this.random_number(-0.05, 0.05);
            ingredient_list.push(new this.ingredient_mapping[ingredient_type](init_x, init_y, init_x_spd, init_y_spd));
        }
        return [recipe, ingredient_list];
    }

    check_wall_collision(ingredient) {
      const half_width = this.width / 2;
      const half_height = this.height / 2;

      if (ingredient.center[0]-ingredient.radius <= -half_width || ingredient.center[0]+ingredient.radius >= half_width) {
          ingredient.direction[0] *= -1; // could easily speed up with > |1| if desired
      }

      if (ingredient.center[1]-ingredient.radius <= -half_height || ingredient.center[1]+ingredient.radius >= half_height) {
          ingredient.direction[1] *= -1;
      }
    }

    // check for collisions with each other (n^2 overlap? z-buffer?) --> update direction vector
    check_ingredient_collision(ingredient1, ingredient2) {
        const distance = Math.sqrt(
            Math.pow(ingredient1.center[0] - ingredient2.center[0], 2) +
            Math.pow(ingredient1.center[1] - ingredient2.center[1], 2)
        );

        if (distance < ingredient1.radius + ingredient2.radius) {
            // Simple collision response: reverse the directions
            ingredient1.direction = ingredient1.direction.times(-1);
            ingredient2.direction = ingredient2.direction.times(-1);
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
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            program_state.set_camera(this.initial_camera_location);
        }
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, .1, 1000);
        // const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        program_state.lights = [new Light(vec4(0, 0, 1000, 1), color(1, 1, 1, 1), 10000000)];
        const model_transform = Mat4.identity();

        // draw actual border? or frame game better so stuff hits the wall rather than a random space
        this.draw_border(context, program_state);

        // Check for collisions between ingredients
        for (let i = 0; i < this.ingredients.length; i++) {
            for (let j = i + 1; j < this.ingredients.length; j++) {
                this.check_ingredient_collision(this.ingredients[i], this.ingredients[j]);
            }
        }

        // draw each ingredient
        for (let ingredient of this.ingredients) {
            this.check_wall_collision(ingredient);
            let shape_mtx = model_transform;
            let new_x = ingredient.center[0]+ingredient.direction[0];
            let new_y = ingredient.center[1]+ingredient.direction[1];
            // not using z?
            // things look a little skewed in the corners, maybe move the camera back? might get fixed by framing game fully?
            shape_mtx = shape_mtx
                .times(Mat4.translation(new_x, new_y, 0))
                .times(Mat4.scale(ingredient.radius, ingredient.radius, ingredient.radius));
            ingredient.shape.draw(context, program_state, shape_mtx, ingredient.material);
            ingredient.center[0] = new_x;
            ingredient.center[1] = new_y;
        }


        // check for mouse picking --> handle by removing from array? and from recipe if correct? and affect score
    }
}