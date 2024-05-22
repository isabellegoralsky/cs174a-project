import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
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

////////////////////////////// WATERMELON //////////////////////////////

class Watermelon extends Ingredient {
  constructor(x_pos, y_pos, x_spd, y_spd) {
      const shp = new defs.Subdivision_Sphere(4);
      const mat = new Material(new Watermelon_Shader(), {ambient: 1, diffusivity: 0.2, specularity: .8, color: hex_color("#5ab669")});

      super(x_pos, y_pos, x_spd, y_spd, 1, 3, shp, mat);
  }
}

class Watermelon_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        varying vec2 v_texture_coord;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
        attribute vec3 position;
        attribute vec2 texture_coord;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
            point_position = model_transform* vec4(position, 1); // vec4(origin (position), 1) to convert pos to vec4
            center = model_transform* vec4(0, 0, 0, 1);
            v_texture_coord = texture_coord;
      
            gl_Position = projection_camera_model_transform* vec4(position, 1); 
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO possibly change green shades
        return this.shared_glsl_code() + `
        void main(){
            // percent opacities of red green blue
            vec4 light_green = vec4(0.2980, 0.6863, 0.3137, 1.0);  // #4CAF50
            vec4 dark_green = vec4(0.1804, 0.4902, 0.1961, 1.0);   // #2E7D32
            
            float stripe = sin(55.0 * v_texture_coord.x);  // Adjust frequency as needed
            vec4 color = mix(light_green, dark_green, step(0.0, stripe));
            
            gl_FragColor = color;
        }`;
    }
}

////////////////////////////// APPLE //////////////////////////////

const HalfApple = defs.HalfApple = class HalfApple extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");

        const numSegments = 20; // Number of segments for smoothness
        const radius = 0.5; // Radius of the apple
        const height = 1.0; // Height of the apple

        for (let i = 0; i <= numSegments; i++) {
            const theta = i * Math.PI / numSegments; // Angle for height segments

            for (let j = 0; j <= numSegments; j++) {
                const phi = j * 2 * Math.PI / numSegments; // Angle for circular segments

                // Calculate the x, y, z positions of the vertices
                const x = radius * Math.sin(theta) * Math.cos(phi);
                const y = height * (Math.cos(theta) - 0.5); // Adjusted to look more like an apple
                const z = radius * Math.sin(theta) * Math.sin(phi);

                // Push the position
                this.arrays.position.push(vec3(x, y, z));

                // Calculate and push the normal
                const normal = vec3(x, y, z).normalized();
                this.arrays.normal.push(normal);

                // Push the texture coordinate
                this.arrays.texture_coord.push(vec(j / numSegments, i / numSegments));
            }
        }

        // Create the indices for the apple shape
        for (let i = 0; i < numSegments; i++) {
            for (let j = 0; j < numSegments; j++) {
                const first = i * (numSegments + 1) + j;
                const second = first + numSegments + 1;

                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }
    }
}

const AppleShape = defs.AppleShape = class AppleShape extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");

        const halfApple1 = new defs.HalfApple();
        const halfApple2 = new defs.HalfApple();

        // Offset the second half to form the complete apple
        const offset = Mat4.translation(0, 0, -0.5);

        // Merge the first half apple vertices
        this.arrays.position.push(...halfApple1.arrays.position);
        this.arrays.normal.push(...halfApple1.arrays.normal);
        this.arrays.texture_coord.push(...halfApple1.arrays.texture_coord);

        // Merge the second half apple vertices
        for (let i = 0; i < halfApple2.arrays.position.length; i++) {
            const pos = halfApple2.arrays.position[i];
            const transformedPos = offset.times(pos.to4(1)).to3();
            this.arrays.position.push(transformedPos);
            this.arrays.normal.push(halfApple2.arrays.normal[i]);
            this.arrays.texture_coord.push(halfApple2.arrays.texture_coord[i]);
        }

        // Merge the indices
        const len = halfApple1.arrays.position.length;
        this.indices.push(...halfApple1.indices);
        for (let i = 0; i < halfApple2.indices.length; i++) {
            this.indices.push(halfApple2.indices[i] + len);
        }
    }
}

class Apple extends Ingredient {
  constructor(x_pos, y_pos, x_spd, y_spd) {
      const shp = new defs.AppleShape();
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

////////////////////////////// ORANGE //////////////////////////////

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

////////////////////////////// BANANA //////////////////////////////

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
        const shp = new defs.BananaShape();
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

// berries? spinning?

////////////////////////////////// BORDER ////////////////////////////////////

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

// detecting mouse clicks
// check if the mouse ray intersects with any ingredient
class MouseControls extends Scene {
    constructor(bruin_smoothies) {
        super();
        this.bruin_smoothies = bruin_smoothies;
        this.mouse_enabled_canvases = new Set();
    }

    add_mouse_controls(canvas) {
        const mouse_position = (e, rect = canvas.getBoundingClientRect()) =>
            vec(e.clientX - (rect.left + rect.right) / 2, e.clientY - (rect.bottom + rect.top) / 2);

        canvas.addEventListener("mousedown", e => {
            e.preventDefault();
            this.handle_click(e, canvas);
        });
    }

    handle_click(event, canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const world_space = vec3(
            (x / rect.width) * this.bruin_smoothies.width - this.bruin_smoothies.width / 2,
            this.bruin_smoothies.height / 2 - (y / rect.height) * this.bruin_smoothies.height,
            0
        );

        this.bruin_smoothies.check_ingredient_click(world_space);
    }

    display(context, graphics_state) {
        if (!this.mouse_enabled_canvases.has(context.canvas)) {
            this.add_mouse_controls(context.canvas);
            this.mouse_enabled_canvases.add(context.canvas);
        }
    }
}

export class BruinSmoothies extends Scene {
    constructor() {
        super();

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

        // Player score
        this.score = 0;
        this.click_controls = new MouseControls(this);
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
                this.play_sound();
                break;
            }
        }
    }

    play_sound() {
        const audio = new Audio('mp3-sounds/juicy-splash.mp3');
        audio.play();
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
        const total_ingr_count = 8;
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
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            program_state.set_camera(this.initial_camera_location);

        }
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, .1, 1000);
        program_state.lights = [new Light(vec4(0, 0, 1000, 1), color(1, 1, 1, 1), 10000000)];
        const model_transform = Mat4.identity();

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

            if (ingredient instanceof Watermelon) {
                shape_mtx = shape_mtx.times(Mat4.scale(1.3, 1.5, 1.3));
            }

            let shape_mtx_non_rotate = shape_mtx;
            if (ingredient instanceof Apple) {
                shape_mtx = shape_mtx.times(Mat4.scale(1.5, 1.175, 1.5)).times(Mat4.rotation(Math.PI / 2,0,1,0));
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