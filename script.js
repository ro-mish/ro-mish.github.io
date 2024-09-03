function generateSineWave() {
    const path = document.getElementById('sine-wave');
    let d = 'M -800 100';
    for (let x = -800; x <= 1600; x++) {
        const y = 100 + 50 * Math.sin((x + 800) * Math.PI / 180);
        d += ` L ${x} ${y}`;
    }
    path.setAttribute('d', d);
}

generateSineWave();

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    updateThemeToggle();
});

function updateThemeToggle() {
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