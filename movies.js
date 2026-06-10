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
            },
            {
                name: "الحلقة 2",
                video: "https://archive.org/download/detective-l-ep-2/Detective%20L%20-%20EP2.mp4",
            },
            {
                name: "الحلقة 3",
                video: "https://archive.org/download/detective-l-ep-2/Detective%20L%20-%20EP2.mp4",
            }
        ]
    }, // <--- شايف الفاصلة دي؟ دي مهمة جداً عشان تفصل بين الفيلم الأول والتاني
    // ⬇️ هنا تضيف الفيلم أو المسلسل التاني الجديد ⬇️
{
    id: "sherlock-holmes-movie", // معرف فريد خاص بالفيلم الجديد
    title: "فيلم شيرلوك هولمز",
    genre: "Mystery / ذكاء",
    rating: "9.5",
    poster: "https://link-to-poster-image.png", // رابط بوستر الفيلم
    episodes: [
      {
        name: "الفيلم كامل",
        video: "رابط_الفيديو_بتاع_الفيلم_هنا.mp4" // الرابط المباشر من أرشيف الإنترنت أو سيرفرك
      }
    ]
  } // <--- لو مفيش أفلام تانية بعده متسيبش فاصلة هنا
];

function displayMovies() {
    // تشغيل الخلفية الـ 3D الفخمة
    init3DBackground();

    const container = document.getElementById('movies-container');
    if (!container) return;
    
    container.innerHTML = ''; 

    movies.forEach((movie, movieIndex) => {
        const card = `
            <div class="scene-3d">
                <div class="netflix-card-3d" id="card-3d-${movieIndex}" onclick="goToPlayer(${movieIndex})" style="cursor: pointer;">
                    
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
                    </div>

                </div>
            </div>
        `;
        container.innerHTML += card;
        initCard3DEffect(movieIndex);
    });

    injectNetflix3DStyles();
}

// دالة العبور السحرية للصفحة الثانية مع حفظ البيانات
function goToPlayer(movieIndex) {
    // حفظ بيانات المسلسل المختار في الـ LocalStorage عشان الصفحة التانية تقراها
    localStorage.setItem('selectedMovie', JSON.stringify(movies[movieIndex]));
    // الانتقال لصفحة المشاهدة
    window.location.href = 'player.html';
}

// دالة تأثير حركة الكارت الـ 3D بالماوس
function initCard3DEffect(index) {
    setTimeout(() => {
        const card = document.getElementById(`card-3d-${index}`);
        if (!card) return;
        const scene = card.parentElement;

        scene.addEventListener('mousemove', (e) => {
            const rect = scene.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((rect.height / 2) - y) / 10; 
            const rotateY = (x - (rect.width / 2)) / 10;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });

        scene.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    }, 100);
}

// نفس دالة النجوم الـ 3D اللي عملناها
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

    const numParticles = 120; const particles = [];
    let mouseX = 0, mouseY = 0;

    for (let i = 0; i < numParticles; i++) {
        particles.push({ x: (Math.random() - 0.5) * width * 2, y: (Math.random() - 0.5) * height * 2, z: Math.random() * width, size: Math.random() * 2 + 0.5 });
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - width / 2) * 0.08; mouseY = (e.clientY - height / 2) * 0.08;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        const grad = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, width);
        grad.addColorStop(0, '#14141c'); grad.addColorStop(1, '#030305');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.z -= 0.8; if (p.z <= 0) p.z = width;
            const k = 300 / p.z;
            const px = (p.x - mouseX) * k + width / 2; const py = (p.y - mouseY) * k + height / 2;
            if (px >= 0 && px <= width && py >= 0 && py <= height) {
                const alpha = (1 - p.z / width);
                ctx.beginPath(); ctx.arc(px, py, p.size * k * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(229, 9, 20, ${alpha * 0.6})`;
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
        .scene-3d { perspective: 1000px; max-width: 550px; margin: 80px auto; }
        .netflix-card-3d { background-color: rgba(24, 24, 28, 0.85); backdrop-filter: blur(10px); border-radius: 12px; text-align: right; direction: rtl; font-family: sans-serif; box-shadow: 0 20px 40px rgba(0,0,0,0.8); overflow: hidden; transform-style: preserve-3d; transition: transform 0.1s ease; border: 1px solid rgba(255, 255, 255, 0.08); }
        .netflix-media-zone-3d { position: relative; width: 100%; height: 310px; background-color: #000; transform: translateZ(30px); }
        .netflix-poster-wrapper-3d { width: 100%; height: 100%; position: relative; }
        .netflix-poster-img-3d { width: 100%; height: 100%; object-fit: cover; }
        .netflix-play-overlay-3d { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; }
        .netflix-card-3d:hover .netflix-play-overlay-3d { opacity: 1; }
        .netflix-play-circle-3d { background: #e50914; width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 30px; padding-left: 6px; box-shadow: 0 0 20px rgba(229,9,20,0.8); transform: translateZ(50px); }
        .netflix-details-3d { padding: 20px; transform: translateZ(25px); }
        .netflix-title-3d { color: #fff; font-size: 26px; margin: 0 0 8px 0; }
        .netflix-meta-3d { display: flex; gap: 15px; align-items: center; font-size: 14px; }
        .netflix-rating-3d { color: #46d369; font-weight: bold; }
        .netflix-genre-3d { color: #aaa; border: 1px solid #aaa; padding: 1px 6px; border-radius: 3px; font-size: 12px; }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', displayMovies);
