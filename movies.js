const movies = [
    {
        id: "detective-l",
        title: "مسلسل المحقق إل",
        genre: "Mystery / تحقيق",
        rating: "10.0",
        poster: "https://i.postimg.cc/3NpRQxXw/detective-l.png",
        episodes: [
            {
                name: "الحلقة 1",
                video: "https://archive.org/download/ep-1-detective-l/EP1%EF%BC%9ADetective%20L.mp4",
                introStart: 20,
                introEnd: 80
            },
            {
                name: "الحلقة 2",
                video: "https://archive.org/download/detective-l-ep-2/Detective%20L%20-%20EP2.mp4",
                introStart: 10,
                introEnd: 70
            },
            {
                name: "الحلقة 3",
                video: "https://archive.org/download/detective-l-ep-2/Detective%20L%20-%20EP2.mp4",
                introStart: 15,
                introEnd: 75
            }
        ]
    }
];

function displayMovies(moviesToRender = movies) {
    init3DBackground();

    const container = document.getElementById('movies-container');
    if (!container) return;
    
    container.innerHTML = ''; 

    moviesToRender.forEach((movie, movieIndex) => {
        const originalIndex = movies.findIndex(m => m.id === movie.id);
        
        const card = `
            <div class="scene-3d">
                <div class="netflix-card-3d" id="card-3d-${originalIndex}" onclick="goToPlayer(${originalIndex})" style="cursor: pointer; position: relative;">
                    
                    <button id="watchlist-btn-${movie.id}" onclick="toggleWatchlist(event, '${movie.id}')" style="position: absolute; top: 15px; left: 15px; background: rgba(0,0,0,0.75); border: 1px solid #333; color: white; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; z-index: 10; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">➕</button>

                    <div class="netflix-media-zone-3d">
                        <div class="netflix-poster-wrapper-3d">
                            <img src="${movie.poster}" alt="${movie.title}" class="netflix-poster-img-3d">
                            <div class="netflix-play-overlay-3d">
                                <div class="netflix-play-circle-3d">▶</div>
                            </div>
                        </div>
                    </div>

                    <div class="netflix-details-3d">
                        <h3 class="netflix-title-3d">${movie.title}</h3>
                        <div class="netflix-meta-3d">
                            <span class="netflix-rating-3d">⭐ ${movie.rating}</span>
                            <span class="netflix-genre-3d">${movie.genre}</span>
                        </div>
                        
                        <div class="movie-reactions" style="display: flex; gap: 20px; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; direction: ltr; justify-content: flex-end;">
                            <button onclick="handleMovieInteraction(event, '${movie.id}', ${originalIndex}, 'like')" style="background: none; border: none; color: #22c55e; cursor: pointer; font-weight: bold; font-size: 15px; display: flex; align-items: center; gap: 5px;">
                                👍 <span id="like-count-${originalIndex}">0</span>
                            </button>
                            <button onclick="handleMovieInteraction(event, '${movie.id}', ${originalIndex}, 'dislike')" style="background: none; border: none; color: #ef4444; cursor: pointer; font-weight: bold; font-size: 15px; display: flex; align-items: center; gap: 5px;">
                                👎 <span id="dislike-count-${originalIndex}">0</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;
        container.innerHTML += card;
        initCard3DEffect(originalIndex);
        
        if (typeof fetchInteractions === 'function') fetchInteractions(movie.id, originalIndex);
        if (typeof checkWatchlistStatus === 'function') checkWatchlistStatus(movie.id);
    });

    injectNetflix3DStyles();
}

function goToPlayer(movieIndex) {
    localStorage.setItem('selectedMovie', JSON.stringify(movies[movieIndex]));
    window.location.href = `player.html?id=${movieIndex}`;
}

function initCard3DEffect(index) {
    setTimeout(() => {
        const card = document.getElementById(`card-3d-${index}`);
        if (!card) return;
        const scene = card.parentElement;

        scene.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return; 
            const rect = scene.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((rect.height / 2) - y) / 14; 
            const rotateY = (x - (rect.width / 2)) / 14;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        scene.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    }, 100);
}

function init3DBackground() {
    if (document.getElementById('bg-canvas-3d')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas-3d';
    canvas.style.position = 'fixed'; canvas.style.top = '0'; canvas.style.left = '0';
    canvas.style.width = '100vw'; canvas.style.height = '100vh'; canvas.style.zIndex = '-1';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const numParticles = window.innerWidth <= 768 ? 40 : 85; 
    const particles = [];
    let mouseX = 0, mouseY = 0;

    for (let i = 0; i < numParticles; i++) {
        particles.push({ x: (Math.random() - 0.5) * width * 2, y: (Math.random() - 0.5) * height * 2, z: Math.random() * width, size: Math.random() * 1.5 + 0.5 });
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - width / 2) * 0.05; mouseY = (e.clientY - height / 2) * 0.05;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        const grad = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, width);
        grad.addColorStop(0, '#121216'); grad.addColorStop(1, '#050507');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.z -= 0.6; if (p.z <= 0) p.z = width;
            const k = 250 / p.z;
            const px = (p.x - mouseX) * k + width / 2; const py = (p.y - mouseY) * k + height / 2;
            if (px >= 0 && px <= width && py >= 0 && py <= height) {
                const alpha = (1 - p.z / width);
                ctx.beginPath(); ctx.arc(px, py, p.size * k * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(229, 9, 20, ${alpha * 0.5})`;
                ctx.fill();
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function injectNetflix3DStyles() {
    if (document.getElementById('netflix-3d-styles')) return;
    const style = document.createElement('style');
    style.id = 'netflix-3d-styles';
    style.innerHTML = `
        .scene-3d { perspective: 1000px; width: 100%; box-sizing: border-box; }
        .netflix-card-3d { background-color: rgba(20, 20, 24, 0.85); backdrop-filter: blur(8px); border-radius: 12px; text-align: right; direction: rtl; font-family: sans-serif; box-shadow: 0 15px 35px rgba(0,0,0,0.7); overflow: hidden; transform-style: preserve-3d; transition: transform 0.2s ease, box-shadow 0.2s; border: 1px solid rgba(255, 255, 255, 0.06); width: 100%; box-sizing: border-box; }
        .netflix-card-3d:hover { box-shadow: 0 20px 40px rgba(229, 9, 20, 0.15); }
        .netflix-media-zone-3d { position: relative; width: 100%; height: 280px; background-color: #000; }
        .netflix-poster-wrapper-3d { width: 100%; height: 100%; position: relative; }
        .netflix-poster-img-3d { width: 100%; height: 100%; object-fit: cover; }
        .netflix-play-overlay-3d { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; }
        .netflix-card-3d:hover .netflix-play-overlay-3d { opacity: 1; }
        .netflix-play-circle-3d { background: #e50914; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 26px; padding-left: 4px; box-shadow: 0 0 15px rgba(229,9,20,0.7); }
        .netflix-details-3d { padding: 18px; }
        .netflix-title-3d { color: #fff; font-size: 20px; margin: 0 0 8px 0; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .netflix-meta-3d { display: flex; gap: 12px; align-items: center; font-size: 13px; }
        .netflix-rating-3d { color: #46d369; font-weight: bold; }
        .netflix-genre-3d { color: #aaa; border: 1px solid #444; padding: 2px 6px; border-radius: 4px; font-size: 11px; }

        @media (max-width: 768px) {
            .netflix-card-3d { transform: none !important; }
            .netflix-media-zone-3d { height: 210px; }
            .netflix-title-3d { font-size: 18px; }
            .netflix-play-overlay-3d { opacity: 1; background: rgba(0,0,0,0.15); }
            .netflix-play-circle-3d { width: 50px; height: 50px; font-size: 22px; }
        }
    `;
    document.head.appendChild(style);
}
