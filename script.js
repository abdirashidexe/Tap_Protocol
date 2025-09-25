const $ = (id) => document.getElementById(id);

// Monster images
const monsterImages = [
  "images/orange.png", // stage 1
  "images/blue.png",   // stage 2
  "images/green.png",  // stage 3
  "images/purple.png", // stage 4
];

const bossImage = "images/boss.png";

function monsterImage(stage) {
    if (stage % 5 == 0) {
        return bossImage;
    } 

    return monsterImages[(stage - 1) %  monsterImages.length];
}

// Default Game state
const S = {
    stage: 1, 
    gold: 0,
    tap: 1,
    hp: 10,
    maxHp: 10,
    costTap: 15
};

// Scaling
const names = ["Nacho Cheese Ooze", "Tide Pod cousin", "Gooey Grape", "Booger", "King Goop"];
const stageName = (s) => `${names[(s - 1) % names.length]} Lv. ${s}`;
const stageHp   = (s) => Math.floor(10 * Math.pow(1.35, s - 1));

const update = {
    stage: $('stage'),
    gold: $('gold'),
    name: $('monsterName'),
    hpText: $('monsterHPText'),
    tapCost: $('costTap'),
    buyTap: $('buyTap'),
    btn: $('monster')
};

function setMonsterArt() {
    const img = monsterImage(S.stage);
    if (!update.btn) {
        console.warn('monster button element not found');
        return;
    }

    update.btn.innerHTML = `<img src="${img}" alt="monster" class="monsterImg">`;
    update.btn.style.background = 'none';
}

setMonsterArt();

// render new info when they change, i.e when gold changes
function render() {
    update.stage.textContent = S.stage;
    update.gold.textContent = S.gold;
    update.name.textContent = stageName(S.stage);
    update.hpText.textContent = `HP: ${Math.max(0, S.hp)} / ${S.maxHp}`;
    update.tapCost.textContent = `${S.costTap} gold`;
    update.buyTap.disabled = S.gold < S.costTap;
}

// new monster spawns
function spawn() {
    S.maxHp = stageHp(S.stage);
    S.hp = S.maxHp;
    setMonsterArt();
    render();
}

// Get gold for every tap
function tap() {
    S.gold += 1; 

    S.hp -= S.tap;
    if (S.hp <= 0) {
        S.stage +=1;
        spawn();
    } else {
        render();
    }
}   

// Shop +1 damage 
function buyTap() {
    // Not enough gold
    if (S.gold < S.costTap) return;

    S.gold -= S.costTap;
    S.tap += 1;
    S.costTap = Math.ceil(S.costTap * 1.6); // Price scales after each purchase
    render();
}

update.btn.addEventListener('click', tap);
update.buyTap.addEventListener('click', buyTap);

spawn();

// Background music handling -------------------------------------------------
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

function setMusicButtonState(playing) {
    if (!musicToggle) return;
    musicToggle.textContent = playing ? 'Pause Music' : 'Play Music';
    musicToggle.style.display = 'inline-block';
}

// Try to autoplay; many browsers block autoplay without user gesture.
if (bgMusic) {
    bgMusic.volume = 0.6;
    bgMusic.play().then(() => {
        // playing succeeded
        setMusicButtonState(true);
    }).catch(() => {
        // autoplay blocked - show toggle so user can start music
        if (musicToggle) {
            setMusicButtonState(false);
        }
    });

    // toggle click handler
    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                setMusicButtonState(true);
            } else {
                bgMusic.pause();
                setMusicButtonState(false);
            }
        });
    }

    // Some browsers allow resume on any user gesture; listen to first click anywhere
    // to attempt resume if autoplay was blocked.
    const resumeOnUserGesture = () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => setMusicButtonState(true)).catch(() => {});
        }
        window.removeEventListener('click', resumeOnUserGesture);
    };
    window.addEventListener('click', resumeOnUserGesture);
}





