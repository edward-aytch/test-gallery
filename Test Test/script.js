const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Ball class
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8; // Random horizontal velocity
        this.dy = (Math.random() - 0.5) * 8; // Random vertical velocity
        this.mass = radius; // Mass proportional to radius
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(balls) {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Check collision with other balls
        balls.forEach(ball => {
            if (ball === this) return; // Skip self

            // Calculate distance between ball centers
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if balls are colliding
            if (distance < this.radius + ball.radius) {
                // Collision resolution
                const normalX = dx / distance;
                const normalY = dy / distance;

                // Relative velocity
                const relativeVelocityX = this.dx - ball.dx;
                const relativeVelocityY = this.dy - ball.dy;

                // Calculate impulse
                const impulse = 2 * (normalX * relativeVelocityX + normalY * relativeVelocityY) 
                              / (1/this.mass + 1/ball.mass);

                // Update velocities
                this.dx -= (impulse * normalX) / this.mass;
                this.dy -= (impulse * normalY) / this.mass;
                ball.dx += (impulse * normalX) / ball.mass;
                ball.dy += (impulse * normalY) / ball.mass;

                // Prevent balls from sticking together
                const overlap = (this.radius + ball.radius - distance) / 2;
                this.x -= overlap * normalX;
                this.y -= overlap * normalY;
                ball.x += overlap * normalX;
                ball.y += overlap * normalY;
            }
        });

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Create balls
const balls = [
    new Ball(100, 100, 20, 'orange'),
    new Ball(200, 200, 20, 'white'),
    new Ball(300, 300, 20, 'green'),
    new Ball(400, 400, 20, 'yellow'),
    new Ball(500, 500, 20, 'blue'),
    // Adding five more green balls
    new Ball(150, 150, 20, 'green'),
    new Ball(250, 250, 20, 'green'),
    new Ball(350, 350, 20, 'green'),
    new Ball(450, 450, 20, 'green'),
    new Ball(550, 550, 20, 'green')
];

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    balls.forEach(ball => {
        ball.update(balls);
    });

    requestAnimationFrame(animate);
}

animate(); 