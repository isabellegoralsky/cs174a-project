import {tiny} from '../tiny-graphics.js';
const {
  Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene
} = tiny;

export const custom_shapes = {};

const Circle = custom_shapes.Circle =
    class Circle extends Shape {
        // **FullCircle** A 2D Circle Shape with a given number of segments.
        constructor(num_segments = 30) {
            super("position", "normal", "texture_coord");

            // Calculate the angle between each segment
            const angle_step = 2 * Math.PI / num_segments;

            // Center vertex
            this.arrays.position.push(vec3(0, 0, 0));
            this.arrays.normal.push(vec3(0, 0, 1));
            this.arrays.texture_coord.push(vec(0.5, 0.5));

            // Vertices around the circumference of the circle
            for (let i = 0; i <= num_segments; i++) {
                const angle = i * angle_step;
                const x = Math.cos(angle);
                const y = Math.sin(angle);

                this.arrays.position.push(vec3(x, y, 0));
                this.arrays.normal.push(vec3(0, 0, 1));
                this.arrays.texture_coord.push(vec(0.5 + 0.5 * x, 0.5 + 0.5 * y));

                if (i > 0) {
                    this.indices.push(0, i, i + 1);
                }
            }

            // Connect the last vertex back to the first circumference vertex to close the circle
            this.indices.push(0, num_segments, 1);
        }}

const HalfCircle = custom_shapes.HalfCircle =
    class HalfCircle extends Shape {
        // **HalfCircle** A 2D Half Circle Shape with a given number of segments.
        constructor(num_segments = 30) {
            super("position", "normal", "texture_coord");

            // Calculate the angle between each segment
            const angle_step = Math.PI / num_segments;

            // Center vertex
            this.arrays.position.push(vec3(0, 0, 0));
            this.arrays.normal.push(vec3(0, 0, 1));
            this.arrays.texture_coord.push(vec(0.5, 0.5));

            // Vertices around the circumference of the half circle
            for (let i = 0; i <= num_segments; i++) {
                const angle = i * angle_step;
                const x = Math.cos(angle);
                const y = Math.sin(angle);

                this.arrays.position.push(vec3(x, y, 0));
                this.arrays.normal.push(vec3(0, 0, 1));
                this.arrays.texture_coord.push(vec(0.5 + 0.5 * x, 0.5 + 0.5 * y));

                if (i > 0) {
                    this.indices.push(0, i, i + 1);
                }
            }

            // Close the half circle by connecting the last vertex to the edge vertex at -1 in the x-axis
            this.arrays.position.push(vec3(-1, 0, 0));
            this.arrays.normal.push(vec3(0, 0, 1));
            this.arrays.texture_coord.push(vec(0, 0.5));
            this.indices.push(0, num_segments + 1, 1);
        }
    }


const HalfApple = custom_shapes.HalfApple = class HalfApple extends Shape {
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

const AppleShape = custom_shapes.AppleShape = class AppleShape extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");

        const halfApple1 = new custom_shapes.HalfApple();
        const halfApple2 = new custom_shapes.HalfApple();

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

const BananaShape = custom_shapes.BananaShape = class BananaShape extends Shape {
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

const BorderShape = custom_shapes.BorderShape = class BorderShape extends Shape {
    constructor() {
        super("position", "color");
        const border_color = color(0.75, 0, 0.25, 1);
        const thickness = 0.2;
        const width = 36.8;
        const height = 20.3;
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

const BoxShape = custom_shapes.BoxShape = class BoxShape extends Shape {
    constructor() {
        super("position", "normal", "texture_coord", "color");

        const light_brown = color(0.54, 0.27, 0.07, 1); // Slightly darker brown color
        const width = 36.8;
        const height = 20.3;
        const thickness = 0.2;
        const depth = 20.3; // Add depth

        this.arrays.position = [
            // Front face (Transparent)
            vec3(-width / 2 - thickness, -height / 2 - thickness, depth / 2), vec3(width / 2 + thickness, -height / 2 - thickness, depth / 2),
            vec3(width / 2 + thickness, height / 2 + thickness, depth / 2), vec3(-width / 2 - thickness, height / 2 + thickness, depth / 2),
            // Back face
            vec3(-width / 2 - thickness, -height / 2 - thickness, -depth / 2), vec3(width / 2 + thickness, -height / 2 - thickness, -depth / 2),
            vec3(width / 2 + thickness, height / 2 + thickness, -depth / 2), vec3(-width / 2 - thickness, height / 2 + thickness, -depth / 2),
            // Top face
            vec3(-width / 2 - thickness, height / 2 + thickness, -depth / 2), vec3(width / 2 + thickness, height / 2 + thickness, -depth / 2),
            vec3(width / 2 + thickness, height / 2 + thickness, depth / 2), vec3(-width / 2 - thickness, height / 2 + thickness, depth / 2),
            // Bottom face
            vec3(-width / 2 - thickness, -height / 2 - thickness, -depth / 2), vec3(width / 2 + thickness, -height / 2 - thickness, -depth / 2),
            vec3(width / 2 + thickness, -height / 2 - thickness, depth / 2), vec3(-width / 2 - thickness, -height / 2 - thickness, depth / 2),
            // Right face
            vec3(width / 2 + thickness, -height / 2 - thickness, -depth / 2), vec3(width / 2 + thickness, height / 2 + thickness, -depth / 2),
            vec3(width / 2 + thickness, height / 2 + thickness, depth / 2), vec3(width / 2 + thickness, -height / 2 - thickness, depth / 2),
            // Left face
            vec3(-width / 2 - thickness, -height / 2 - thickness, -depth / 2), vec3(-width / 2 - thickness, height / 2 + thickness, -depth / 2),
            vec3(-width / 2 - thickness, height / 2 + thickness, depth / 2), vec3(-width / 2 - thickness, -height / 2 - thickness, depth / 2),
        ];

        this.arrays.normal = [
            // Front face (Transparent)
            vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
            // Back face
            vec3(0, 0, -1), vec3(0, 0, -1), vec3(0, 0, -1), vec3(0, 0, -1),
            // Top face
            vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0),
            // Bottom face
            vec3(0, -1, 0), vec3(0, -1, 0), vec3(0, -1, 0), vec3(0, -1, 0),
            // Right face
            vec3(1, 0, 0), vec3(1, 0, 0), vec3(1, 0, 0), vec3(1, 0, 0),
            // Left face
            vec3(-1, 0, 0), vec3(-1, 0, 0), vec3(-1, 0, 0), vec3(-1, 0, 0),
        ];

        this.arrays.texture_coord = [
            // Front face (Transparent)
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Back face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Top face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Bottom face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Right face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Left face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
        ];

        this.arrays.color = [
            // Front face (Transparent)
            light_brown, light_brown, light_brown, light_brown,
            // Back face
            light_brown, light_brown, light_brown, light_brown,
            // Top face
            light_brown, light_brown, light_brown, light_brown,
            // Bottom face
            light_brown, light_brown, light_brown, light_brown,
            // Right face
            light_brown, light_brown, light_brown, light_brown,
            // Left face
            light_brown, light_brown, light_brown, light_brown,
        ];

        this.indices.push(
            // Front face (Transparent) - Skip indices to make it transparent
            //0, 1, 2, 0, 2, 3,
            // Back face
            4, 5, 6, 4, 6, 7,
            // Top face
            8, 9, 10, 8, 10, 11,
            // Bottom face
            12, 13, 14, 12, 14, 15,
            // Right face
            16, 17, 18, 16, 18, 19,
            // Left face
            20, 21, 22, 20, 22, 23
        );
    }
};
