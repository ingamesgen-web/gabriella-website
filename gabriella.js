// --- Music Logic (Shared Web Audio) ---
let audioContext = null;
let isPlaying = false;
const globalMusicBtn = document.getElementById('globalMusicBtn');

function toggleMusic() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') audioContext.resume();

    if (!isPlaying) {
        isPlaying = true;
        globalMusicBtn.textContent = "⏸ Pause Music";
        startLoop();
    } else {
        isPlaying = false;
        globalMusicBtn.textContent = "🎵 Play Music";
        stopLoop();
    }
}

let nextNoteTime = 0;
let toneLoop;

function playTone(freq, time) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.frequency.value = freq;
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(time);
    osc.stop(time + 0.5);
}

function scheduler() {
    const melody = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 196.00];
    while (nextNoteTime < audioContext.currentTime + 0.1) {
        const note = melody[Math.floor(Math.random() * melody.length)];
        playTone(note, nextNoteTime);
        nextNoteTime += 0.25;
    }
    if (isPlaying) {
        toneLoop = requestAnimationFrame(scheduler);
    }
}

function startLoop() {
    nextNoteTime = audioContext.currentTime;
    scheduler();
}

function stopLoop() {
    cancelAnimationFrame(toneLoop);
}

globalMusicBtn.addEventListener('click', toggleMusic);

// --- K-Pop Stan Card Logic ---
const stanName = document.getElementById('stanName');
const stanBias = document.getElementById('stanBias');
const generateCardBtn = document.getElementById('generateCardBtn');
const stanCardDisplay = document.getElementById('stanCardDisplay');
const cardName = document.getElementById('cardName');
const cardBias = document.getElementById('cardBias');
const danceBtn = document.getElementById('danceBtn');
const dancer = document.querySelector('.dancer');

if (generateCardBtn) {
    generateCardBtn.addEventListener('click', () => {
        if (stanName.value.trim() === "") {
            alert("Please enter your name!");
            return;
        }
        cardName.textContent = stanName.value;
        cardBias.textContent = "Bias: " + stanBias.value;
        stanCardDisplay.style.display = 'flex';
        stanCardDisplay.classList.add('stan-active');
        setTimeout(() => stanCardDisplay.classList.remove('stan-active'), 500);
    });
}

if (danceBtn) {
    danceBtn.addEventListener('click', () => {
        dancer.classList.toggle('dancing');
        if (dancer.classList.contains('dancing')) {
            danceBtn.textContent = "🛑 Stop Dance";
            createConfetti();
        } else {
            danceBtn.textContent = "💃 Enable Dance Mode";
        }
    });
}

function createConfetti() {
    const colors = ['#FFD1DC', '#E0F7FA', '#FF69B4'];
    for (let i = 0; i < 20; i++) {
        const c = document.createElement('div');
        c.style.position = 'fixed';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = '-10px';
        c.style.width = '10px';
        c.style.height = '10px';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.zIndex = '999';
        c.style.transition = 'top 3s linear, transform 3s ease';
        document.body.appendChild(c);
        setTimeout(() => {
            c.style.top = '100vh';
            c.style.transform = `rotate(${Math.random() * 360}deg)`;
        }, 100);
        setTimeout(() => c.remove(), 3000);
    }
}



// --- Idea Generator (Slot Machine Animation) ---
const ideas = [
    "A game where you play as a cat",
    "A website for virtual pets",
    "A K-Pop quiz app",
    "A Roblox outfit planner",
    "A weather app for Mars",
    "A digital diary with stickers",
    "A random dance generator",
    "A virtual lightstick app"
];
const ideaBtn = document.getElementById('ideaBtn');
const ideaResult = document.getElementById('ideaResult');

if (ideaBtn) {
    ideaBtn.addEventListener('click', () => {
        ideaBtn.disabled = true;
        let shuffleCount = 0;
        const interval = setInterval(() => {
            ideaResult.textContent = ideas[Math.floor(Math.random() * ideas.length)];
            shuffleCount++;
            if (shuffleCount > 15) {
                clearInterval(interval);
                const finalIdea = ideas[Math.floor(Math.random() * ideas.length)];
                ideaResult.textContent = "✨ " + finalIdea + " ✨";
                ideaBtn.disabled = false;
            }
        }, 100);
    });
}

// --- Fun Zone Logic ---

// Mood Switcher
const moodBtns = document.querySelectorAll('.mood-btn');
const heroSection = document.querySelector('.hero');

moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const bg = btn.dataset.color;
        // Animate transition
        heroSection.style.background = bg;
        document.body.style.background = bg; // Fallback
    });
});

// Virtual Pet
const petIcon = document.getElementById('petIcon');
const petStatus = document.getElementById('petStatus');
const petArea = document.getElementById('petArea');

const petStages = ['🥚', '🐣', '🐥', '🐓', '🍖']; // Life cycle
const petMessages = ['Tap to hatch!', 'Hello world!', 'Chirp chirp!', 'Big chicken!', 'Oops...'];
let petStageIndex = 0;

if (petArea) {
    petArea.addEventListener('click', () => {
        // Simple evolution
        if (petStageIndex < petStages.length - 1) {
            petStageIndex++;
            // Jump animation
            petIcon.style.transform = "scale(1.2)";
            setTimeout(() => petIcon.style.transform = "scale(1)", 200);
        } else {
            petStageIndex = 0; // Reset (Reincarnation)
        }

        petIcon.textContent = petStages[petStageIndex];
        petStatus.textContent = petMessages[petStageIndex];
    });
}






