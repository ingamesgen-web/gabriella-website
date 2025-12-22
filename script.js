window.onerror = function (msg, url, lineNo, columnNo, error) {
    const errorBox = document.createElement('div');
    errorBox.style.position = 'fixed';
    errorBox.style.top = '0';
    errorBox.style.left = '0';
    errorBox.style.width = '100%';
    errorBox.style.background = 'red';
    errorBox.style.color = 'white';
    errorBox.style.zIndex = '9999';
    errorBox.style.padding = '10px';
    errorBox.textContent = 'Error: ' + msg + ' at line ' + lineNo;
    document.body.prepend(errorBox);
    return false;
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        // --- Translations ---
        const translations = {
            en: {
                title: "Artsy",
                placeholder: "Search for inspiration...",
                google: "Google Images",
                pinterest: "Pinterest",
                helperTitle: "✨ Drawing Assistant",
                prompt: "Need an idea?",
                magicBtn: "Inspire Me!",
                footerPinterest: "Go to Pinterest",
                music: "Chill Lofi Beats"
            },
            fr: {
                title: "Artsy",
                placeholder: "Cherchez de l'inspiration...",
                google: "Google Images",
                pinterest: "Pinterest",
                helperTitle: "✨ Assistant Dessin",
                prompt: "Besoin d'une idée?",
                magicBtn: "Inspirez-moi!",
                footerPinterest: "Aller sur Pinterest",
                music: "Beats Lofi Détente"
            },
            es: {
                title: "Artsy",
                placeholder: "Busca inspiración...",
                google: "Imágenes Google",
                pinterest: "Pinterest",
                helperTitle: "✨ Asistente de Dibujo",
                prompt: "¿Necesitas una idea?",
                magicBtn: "¡Inspiralme!",
                footerPinterest: "Ir a Pinterest",
                music: "Ritmos Lofi Chill"
            },
            jp: {
                title: "Artsy",
                placeholder: "インスピレーションを探す...",
                google: "Google 画像検索",
                pinterest: "ピンタレスト",
                helperTitle: "✨ お絵かきアシスタント",
                prompt: "アイデアが必要？",
                magicBtn: "ひらめきを！",
                footerPinterest: "ピンタレストへ",
                music: "チル Lofi ビーツ"
            },
            kr: {
                title: "Artsy",
                placeholder: "영감을 검색하세요...",
                google: "Google 이미지",
                pinterest: "핀터레스트",
                helperTitle: "✨ 드로잉 도우미",
                prompt: "아이디어가 필요하세요?",
                magicBtn: "영감을 주세요!",
                footerPinterest: "핀터레스트로 이동",
                music: "Lofi 비트"
            },
            ph: {
                title: "Artsy",
                placeholder: "Maghanap ng inspirasyon...",
                google: "Google Images",
                pinterest: "Pinterest",
                helperTitle: "✨ Katulong sa Pagguhit",
                prompt: "Kailangan ng ideya?",
                magicBtn: "Bigyan ng Inspirasyon!",
                footerPinterest: "Pumunta sa Pinterest",
                music: "Chill Lofi Beats"
            }
        };

        // --- Search Logic ---
        const searchInput = document.getElementById('searchInput');
        const googleBtn = document.getElementById('googleBtn');
        const pinterestBtn = document.getElementById('pinterestBtn');
        const pinterestFooterBtn = document.getElementById('pinterestFooterBtn');

        function performSearch(engine) {
            const query = searchInput.value.trim();
            if (!query && engine !== 'pinterest_home') {
                // Visual feedback for empty search
                searchInput.style.border = '2px solid red';
                setTimeout(() => searchInput.style.border = '2px solid white', 500);
                return;
            }

            let url = '';
            if (engine === 'google') {
                url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
            } else if (engine === 'pinterest') {
                url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
            } else if (engine === 'pinterest_home') {
                url = 'https://www.pinterest.com/';
            }

            // Try both methods to ensure open
            const newWindow = window.open(url, '_blank');
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                // Formatting fallback
                window.location.href = url;
            }
        }

        if (googleBtn) googleBtn.addEventListener('click', () => performSearch('google'));
        if (pinterestBtn) pinterestBtn.addEventListener('click', () => performSearch('pinterest'));
        if (pinterestFooterBtn) pinterestFooterBtn.addEventListener('click', () => performSearch('pinterest_home'));

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch('google');
            });
        }

        // --- Language Logic ---
        const langBtns = document.querySelectorAll('.lang-btn');

        function setLanguage(lang) {
            const t = translations[lang];
            const logo = document.querySelector('.logo');
            if (logo) logo.textContent = t.title;
            if (searchInput) searchInput.placeholder = t.placeholder;
            if (googleBtn) googleBtn.innerHTML = `<span class="icon">🔍</span> ${t.google}`;
            if (pinterestBtn) pinterestBtn.innerHTML = `<span class="icon">📌</span> ${t.pinterest}`;

            const helperTitle = document.querySelector('.ai-helper h3');
            if (helperTitle) helperTitle.textContent = t.helperTitle;

            const aiPrompt = document.getElementById('aiPrompt');
            if (aiPrompt) aiPrompt.textContent = t.prompt;

            const aiMagicBtn = document.getElementById('aiMagicBtn');
            if (aiMagicBtn) aiMagicBtn.textContent = t.magicBtn;

            if (pinterestFooterBtn) pinterestFooterBtn.textContent = t.footerPinterest;

            const trackName = document.querySelector('.track-name');
            if (trackName) trackName.textContent = t.music;

            langBtns.forEach(btn => {
                if (btn.dataset.lang === lang) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        }

        langBtns.forEach(btn => {
            btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
        });

        // --- Drawing Canvas Logic ---
        const canvas = document.getElementById('drawingCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let isDrawing = false;

            function resizeCanvas() {
                const parent = canvas.parentElement;
                if (!parent) return;

                // Safety check to prevent negative values
                const newWidth = Math.max(10, parent.offsetWidth - 40);
                const newHeight = Math.max(10, parent.offsetHeight - 60);

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            window.addEventListener('resize', resizeCanvas);
            setTimeout(resizeCanvas, 100);

            const colorPicker = document.getElementById('colorPicker');
            const brushSize = document.getElementById('brushSize');
            const clearBtn = document.getElementById('clearCanvas');

            function startDraw(e) {
                isDrawing = true;
                draw(e);
            }

            function stopDraw() {
                isDrawing = false;
                ctx.beginPath();
            }

            function draw(e) {
                if (!isDrawing) return;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ctx.lineWidth = brushSize ? brushSize.value : 5;
                ctx.lineCap = 'round';
                ctx.strokeStyle = colorPicker ? colorPicker.value : '#000';

                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);
            }

            canvas.addEventListener('mousedown', startDraw);
            canvas.addEventListener('mouseup', stopDraw);
            canvas.addEventListener('mouseout', stopDraw);
            canvas.addEventListener('mousemove', draw);

            // Touch support
            canvas.addEventListener('touchstart', (e) => {
                if (e.cancelable) e.preventDefault();
                const touch = e.touches[0];
                const rect = canvas.getBoundingClientRect();
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            }, { passive: false });

            canvas.addEventListener('touchmove', (e) => {
                if (e.cancelable) e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            }, { passive: false });

            canvas.addEventListener('touchend', (e) => {
                const mouseEvent = new MouseEvent('mouseup', {});
                canvas.dispatchEvent(mouseEvent);
            });

            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                });
            }
        }

        // --- AI Helper Logic ---
        const prompts = [
            "Draw a cat wearing sunglasses!",
            "Sketch your favorite food.",
            "Draw a robot flower.",
            "Create a new planet.",
            "Draw Miffy in space!",
            "Sketch a happy cloud.",
            "Draw a house made of candy.",
            "Design a futuristic car."
        ];

        const suggestionBox = document.getElementById('aiSuggestion');
        const magicBtn = document.getElementById('aiMagicBtn');

        if (magicBtn && suggestionBox) {
            magicBtn.addEventListener('click', () => {
                suggestionBox.style.opacity = 0;
                // Force random select immediately for feedback
                const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
                suggestionBox.textContent = randomPrompt;
                setTimeout(() => {
                    suggestionBox.style.opacity = 1;
                }, 100);
            });
        }

        // --- Music Player (Web Audio API) ---
        const playPauseBtn = document.getElementById('playPauseBtn');
        let isPlaying = false;
        let audioContext = null;
        let oscillators = [];

        // Simple ambient chord (Cmaj7ish)
        const frequencies = [261.63, 329.63, 392.00, 493.88];

        function startMusic() {
            if (!audioContext) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContext = new AudioContext();
            }
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            // Stop any existing
            stopMusic();

            frequencies.forEach(freq => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, audioContext.currentTime);

                // Low volume for ambient feel
                gain.gain.setValueAtTime(0.01, audioContext.currentTime); // Very quiet

                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.start();
                oscillators.push({ osc, gain });
            });
        }

        function stopMusic() {
            oscillators.forEach(node => {
                try {
                    node.gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);
                    node.osc.stop(audioContext.currentTime + 1);
                } catch (e) { }
            });
            oscillators = [];
        }

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                isPlaying = !isPlaying;
                playPauseBtn.textContent = isPlaying ? "⏸" : "▶";

                const trackName = document.querySelector('.track-name');
                const icon = document.querySelector('.music-icon');

                if (isPlaying) {
                    startMusic();
                    if (trackName) trackName.textContent = "▶ Now Playing: Smooth Synth...";
                    if (icon) icon.style.animationPlayState = 'running';
                } else {
                    stopMusic();
                    if (trackName) trackName.textContent = "Chill Lofi Beats";
                    if (icon) icon.style.animationPlayState = 'paused';
                }
            });
            const icon = document.querySelector('.music-icon');
            if (icon) icon.style.animationPlayState = 'paused';
        }

    } catch (err) {
        console.error("Main Script Error:", err);
        const errDiv = document.createElement('div');
        errDiv.style.color = 'red';
        errDiv.textContent = 'System Error: ' + err.message;
        document.body.appendChild(errDiv);
    }
});


