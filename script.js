let currentPage = 1;
let totalPages = 9;
let musicPlaying = false;
let musicMuted = false;
let balloonsPopped = 0;
let candlesBlown = 0;
let totalCandles = 5;
let candlesBlownOut = false;
let giftOpened = false;

const bgMusic = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const muteBtn = document.getElementById('mute-btn');
const volumeIcon = document.getElementById('volume-icon');
const muteIcon = document.getElementById('mute-icon');

const messages = [
    "You are so special ❤️",
    "Keep smiling forever 😊",
    "You're one of a kind ✨",
    "Your smile brightens every day 🌸",
    "Stay happy always 💖"
];

const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#87CEEB'
];

function goToPage(pageNum) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`page${pageNum}`).classList.add('active');
    currentPage = pageNum;
    if (pageNum === 9) {
        startGrandFinale();
    }
}

function typeWriter(element, text, speed) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function playMusic() {
    bgMusic.play().then(() => {
        musicPlaying = true;
        updateMusicIcons();
        createMusicNotes();
    }).catch(e => {
        console.log('Audio play failed:', e);
        musicPlaying = true;
        updateMusicIcons();
        createMusicNotes();
    });
}

function toggleMusic() {
    if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
    } else {
        bgMusic.play().then(() => {
            musicPlaying = true;
            createMusicNotes();
        }).catch(e => {
            console.log('Audio play failed:', e);
            musicPlaying = true;
            createMusicNotes();
        });
    }
    updateMusicIcons();
}

function toggleMute() {
    musicMuted = !musicMuted;
    bgMusic.muted = musicMuted;
    updateMuteIcons();
}

function updateMusicIcons() {
    playIcon.style.display = musicPlaying ? 'none' : 'inline';
    pauseIcon.style.display = musicPlaying ? 'inline' : 'none';
}

function updateMuteIcons() {
    volumeIcon.style.display = musicMuted ? 'none' : 'inline';
    muteIcon.style.display = musicMuted ? 'inline' : 'none';
}

function createMusicNotes() {
    const container = document.getElementById('music-notes-container');
    const notes = ['🎵', '🎶', '🎼', '🎤', '🎹'];
    setInterval(() => {
        if (musicPlaying && container) {
            const note = document.createElement('span');
            note.textContent = notes[Math.floor(Math.random() * notes.length)];
            note.style.position = 'absolute';
            note.style.fontSize = Math.random() * 20 + 10 + 'px';
            note.style.left = Math.random() * 100 + '%';
            note.style.animation = 'float 3s linear forwards';
            note.style.pointerEvents = 'none';
            container.appendChild(note);
            setTimeout(() => {
                container.removeChild(note);
            }, 3000);
        }
    }, 500);
}

function createBalloons() {
    const container = document.getElementById('balloons-container');
    container.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.background = `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`;
        balloon.style.animationDelay = `${i * 0.2}s`;
        balloon.addEventListener('click', () => popBalloon(balloon, i));
        container.appendChild(balloon);
    }
}

function popBalloon(balloon, index) {
    balloon.classList.add('balloon-pop');
    showCompliment(index % messages.length);
    createConfetti(balloon);
    setTimeout(() => {
        balloon.style.visibility = 'hidden';
        balloonsPopped++;
        if (balloonsPopped === 8) {
            document.getElementById('page3-next-btn').disabled = false;
        }
    }, 500);
}

function showCompliment(index) {
    const popup = document.createElement('div');
    popup.className = 'compliment-popup';
    popup.textContent = messages[index];
    document.body.appendChild(popup);
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 2000);
}

function createConfetti(element) {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = element.getBoundingClientRect().left + element.offsetWidth / 2 + 'px';
        confetti.style.top = element.getBoundingClientRect().top + element.offsetHeight / 2 + 'px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '999';
        document.body.appendChild(confetti);
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 200 + 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        let x = 0, y = 0;
        let opacity = 1;
        const animate = () => {
            x += vx * 0.02;
            y += vy * 0.02 + 2;
            opacity -= 0.02;
            confetti.style.transform = `translate(${x}px, ${y}px)`;
            confetti.style.opacity = opacity;
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(confetti);
            }
        };
        requestAnimationFrame(animate);
    }
}

function moveNoButton() {
    const noBtn = document.getElementById('no-btn');
    const rect = noBtn.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 40;
    const maxY = window.innerHeight - rect.height - 40;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    noBtn.style.position = 'fixed';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
}

function createCandles() {
    const container = document.getElementById('candles-container');
    container.innerHTML = '';
    for (let i = 0; i < totalCandles; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        const flame = document.createElement('div');
        flame.className = 'flame';
        candle.appendChild(flame);
        container.appendChild(candle);
    }
    container.addEventListener('click', blowOutAllCandles);
    document.getElementById('cake').addEventListener('click', blowOutAllCandles);
}

function blowOutAllCandles() {
    if (candlesBlownOut) return;
    candlesBlownOut = true;
    const flames = document.querySelectorAll('.flame');
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.classList.add('flame-out');
        }, index * 100);
    });
    candlesBlown = totalCandles;
    document.getElementById('wish-message').style.display = 'block';
    setTimeout(() => {
        document.getElementById('page5-next-btn').disabled = false;
    }, 3000);
}

function openGift() {
    if (giftOpened) return;
    giftOpened = true;
    const giftBox = document.getElementById('gift-box');
    giftBox.classList.add('open');
    const bouquet = document.getElementById('flower-bouquet');
    bouquet.classList.add('show');
    setTimeout(() => {
        document.getElementById('page6-next-btn').disabled = false;
    }, 1200);
}

function openEnvelope() {
    const envelope = document.getElementById('envelope');
    envelope.classList.add('open');
    setTimeout(() => {
        document.getElementById('letter-container').style.display = 'block';
        typeWriterLetter();
    }, 800);
}

function typeWriterLetter() {
    const letterContent = document.getElementById('letter-content');
    const letterText = `Dear Nupur,

Happiest Birthday! may bappa bless you... I wanted to take this moment to tell you how much you mean to me. Our friendship is one of the most precious gifts in my life.

Thank you for being in my life , and everything in between. You've made my life brighter just by being you.

I'm sorry for the times I may have let you down, and I'm grateful for your forgiveness and understanding.

On this special day, I wish you endless happiness, love, success, and all the wonderful things life has to offer. May your smile always shine as brightly as it does today

With all love,
Your Nishant ❤️`;
    let i = 0;
    function type() {
        if (i < letterText.length) {
            letterContent.textContent += letterText.charAt(i);
            i++;
            setTimeout(type, 30);
        } else {
            document.getElementById('page7-next-btn').disabled = false;
        }
    }
    type();
}

function startGrandFinale() {
    createFireworks();
    createContinuousConfetti();
}

function createFireworks() {
    const container = document.getElementById('fireworks-container');
    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            createFirework(container);
        }
    }, 2000);
}

function createFirework(container) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight / 2);
    for (let i = 0; i < 50; i++) {
        const spark = document.createElement('div');
        spark.style.position = 'absolute';
        spark.style.width = '4px';
        spark.style.height = '4px';
        spark.style.background = colors[Math.floor(Math.random() * colors.length)];
        spark.style.left = x + 'px';
        spark.style.top = y + 'px';
        spark.style.borderRadius = '50%';
        spark.style.pointerEvents = 'none';
        container.appendChild(spark);
        const angle = (Math.PI * 2 / 50) * i;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        let xPos = 0, yPos = 0;
        let opacity = 1;
        const animate = () => {
            xPos += vx * 0.02;
            yPos += vy * 0.02 + 1;
            opacity -= 0.01;
            spark.style.transform = `translate(${xPos}px, ${yPos}px)`;
            spark.style.opacity = opacity;
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                container.removeChild(spark);
            }
        };
        requestAnimationFrame(animate);
    }
}

function createContinuousConfetti() {
    const container = document.getElementById('confetti-container');
    setInterval(() => {
        for (let i = 0; i < 5; i++) {
            createConfettiPiece(container);
        }
    }, 100);
}

function createConfettiPiece(container) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = confetti.style.width;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-20px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.pointerEvents = 'none';
    container.appendChild(confetti);
    let yPos = 0;
    let rotation = 0;
    const animate = () => {
        yPos += 2;
        rotation += 5;
        confetti.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
        if (yPos < window.innerHeight) {
            requestAnimationFrame(animate);
        } else {
            container.removeChild(confetti);
        }
    };
    requestAnimationFrame(animate);
}



document.getElementById('start-btn').addEventListener('click', () => {
    playMusic();
    goToPage(2);
});

document.getElementById('page2-next-btn').addEventListener('click', () => {
    createBalloons();
    goToPage(3);
});

document.getElementById('page3-next-btn').addEventListener('click', () => {
    goToPage(4);
});

document.getElementById('yes-btn').addEventListener('click', () => {
    createCandles();
    goToPage(5);
});

document.getElementById('no-btn').addEventListener('mouseenter', moveNoButton);
document.getElementById('no-btn').addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

document.getElementById('page5-next-btn').addEventListener('click', () => {
    goToPage(6);
});

document.getElementById('gift-box').addEventListener('click', openGift);
document.getElementById('page6-next-btn').addEventListener('click', () => {
    goToPage(7);
});

document.getElementById('envelope').addEventListener('click', openEnvelope);
document.getElementById('page7-next-btn').addEventListener('click', () => {
    goToPage(8);
});

document.getElementById('page8-next-btn').addEventListener('click', () => {
    goToPage(9);
});

document.getElementById('replay-btn').addEventListener('click', () => {
    currentPage = 1;
    balloonsPopped = 0;
    candlesBlown = 0;
    candlesBlownOut = false;
    giftOpened = false;
    document.getElementById('welcome-title').textContent = '';
    document.getElementById('page3-next-btn').disabled = true;
    document.getElementById('page5-next-btn').disabled = true;
    document.getElementById('page6-next-btn').disabled = true;
    document.getElementById('page7-next-btn').disabled = true;
    document.getElementById('page8-next-btn').disabled = false;
    document.getElementById('wish-message').style.display = 'none';
    document.getElementById('letter-container').style.display = 'none';
    document.getElementById('envelope').classList.remove('open');
    document.getElementById('letter-content').textContent = '';
    document.getElementById('gift-box').classList.remove('open');
    document.getElementById('flower-bouquet').classList.remove('show');
    goToPage(1);
    typeWriter(document.getElementById('welcome-title'), 'Happy Birthday Dear Nupur! 🎂', 150);
});

playPauseBtn.addEventListener('click', toggleMusic);
muteBtn.addEventListener('click', toggleMute);

window.addEventListener('load', () => {
    const welcomeTitle = document.getElementById('welcome-title');
    console.log('Window loaded! Welcome title element:', welcomeTitle);
    if (welcomeTitle) {
        // First set the text directly to test visibility
        welcomeTitle.textContent = 'Happy Birthday Dear Nupur! 🎂';
        // Now uncomment the typing line if this works!
        // setTimeout(() => {
        //     welcomeTitle.textContent = '';
        //     typeWriter(welcomeTitle, 'Happy Birthday Dear Nupur! 🎂', 150);
        // }, 500);
    } else {
        console.error('Could not find welcome-title element!');
    }
});
