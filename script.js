function generateSineWave() {
    const path = document.getElementById('sine-wave');
    if (!path) return;
    let d = 'M -800 100';
    for (let x = -800; x <= 1600; x++) {
        const y = 100 + 50 * Math.sin((x + 800) * Math.PI / 180);
        d += ` L ${x} ${y}`;
    }
    path.setAttribute('d', d);
}

generateSineWave();

// LIDAR-style point cloud background
(function() {
    const canvas = document.getElementById('point-cloud');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let points = [];
    const numPoints = 120;
    
    // Color palette - sensor visualization colors
    const colors = [
        { r: 80, g: 200, b: 255 },   // Cyan
        { r: 255, g: 100, b: 100 },  // Red (accent)
        { r: 150, g: 255, b: 150 },  // Green
        { r: 200, g: 180, b: 255 },  // Lavender
    ];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    function createPoints() {
        points = [];
        for (let i = 0; i < numPoints; i++) {
            const colorIndex = Math.random() < 0.85 ? 0 : Math.floor(Math.random() * colors.length);
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * 1000, // Depth for parallax
                baseSize: Math.random() * 1.5 + 0.5,
                color: colors[colorIndex],
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.005,
                drift: {
                    x: (Math.random() - 0.5) * 0.15,
                    y: (Math.random() - 0.5) * 0.1
                }
            });
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        points.forEach(point => {
            // Subtle drift movement
            point.x += point.drift.x;
            point.y += point.drift.y;
            
            // Wrap around edges
            if (point.x < -10) point.x = width + 10;
            if (point.x > width + 10) point.x = -10;
            if (point.y < -10) point.y = height + 10;
            if (point.y > height + 10) point.y = -10;
            
            // Pulse animation
            point.pulse += point.pulseSpeed;
            const pulseFactor = 0.3 + Math.sin(point.pulse) * 0.2;
            
            // Size based on depth
            const depthFactor = 1 - (point.z / 1500);
            const size = point.baseSize * depthFactor * (0.8 + pulseFactor * 0.4);
            
            // Alpha based on depth and pulse
            const alpha = (0.15 + pulseFactor * 0.25) * depthFactor;
            
            const { r, g, b } = point.color;
            
            // Outer glow
            const gradient = ctx.createRadialGradient(
                point.x, point.y, 0,
                point.x, point.y, size * 4
            );
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
            gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            ctx.beginPath();
            ctx.arc(point.x, point.y, size * 4, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Core point
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 2})`;
            ctx.fill();
        });
        
        requestAnimationFrame(draw);
    }
    
    resize();
    createPoints();
    draw();
    
    window.addEventListener('resize', () => {
        resize();
        createPoints();
    });
})();

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        updateThemeToggle();
    });
}

function updateThemeToggle() {
    if (!themeToggle) return;
    if (body.classList.contains('dark-theme')) {
        themeToggle.textContent = '🌙';
    } else {
        themeToggle.textContent = '🌞';
    }
}

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDarkScheme.matches)) {
    body.classList.add('dark-theme');
}
updateThemeToggle();

// Subtle parallax tilt effect on device
const device = document.querySelector('.device');
const ambientLight = document.querySelector('.ambient-light');

if (device && window.matchMedia('(hover: hover)').matches) {
    device.addEventListener('mousemove', (e) => {
        const rect = device.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Subtle rotation based on mouse position
        const rotateY = (x - 0.5) * 3; // max 1.5 degrees
        const rotateX = (0.5 - y) * 2; // max 1 degree
        
        device.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Move ambient light based on mouse
        if (ambientLight) {
            const lightX = x * 100;
            const lightY = y * 100;
            ambientLight.style.background = `
                radial-gradient(
                    ellipse at ${lightX}% ${lightY}%,
                    rgba(255, 255, 255, 0.1) 0%,
                    transparent 50%
                ),
                linear-gradient(
                    160deg,
                    rgba(255, 255, 255, 0.05) 0%,
                    transparent 30%,
                    transparent 70%,
                    rgba(0, 0, 0, 0.03) 100%
                )
            `;
        }
    });
    
    device.addEventListener('mouseleave', () => {
        device.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        if (ambientLight) {
            ambientLight.style.background = `
                linear-gradient(
                    160deg,
                    rgba(255, 255, 255, 0.08) 0%,
                    transparent 30%,
                    transparent 70%,
                    rgba(0, 0, 0, 0.03) 100%
                )
            `;
        }
    });
    
    device.style.transition = 'transform 0.1s ease-out';
}