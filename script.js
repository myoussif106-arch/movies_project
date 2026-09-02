// بيانات الاتصال بقاعدة بيانات Supabase
const SUPABASE_URL = "https://wdyhgweypfquorviikxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkeWhnd2V5cGZxdW9ydmlpa3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjQ2MDksImV4cCI6MjA5NjUwMDYwOX0.zNEqFeVZmTJynohdkP6cQKH-NWUgpsAQQ8gGlHaYoDs";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let allMoviesData = [];
let currentFilter = 'all';
let currentTopMovieVideo = "";

// التحكم في قائمة الموبايل
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// شريط التنقل عند التمرير
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = 'rgba(7, 7, 8, 0.95)';
      navbar.style.boxShadow = '0 2px 10px rgba(179, 0, 0, 0.15)';
    } else {
      navbar.style.backgroundColor = 'transparent';
      navbar.style.boxShadow = 'none';
    }
  }
});

// دالة تصحيح روابط الفيديو
function formatVideoEmbedUrl(url) {
  if (!url) return "";

  if (url.includes('dailymotion.com/video/')) {
    const videoId = url.split('/video/')[1].split('?')[0];
    return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1&ui-start-screen-info=0&endscreen-enable=false&queue-enable=false&sharing-enable=false&ui-logo=0`;
  }
  if (url.includes('dai.ly/')) {
    const videoId = url.split('dai.ly/')[1].split('?')[0];
    return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1&ui-start-screen-info=0&endscreen-enable=false&queue-enable=false&sharing-enable=false&ui-logo=0`;
  }

  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }

  if (url.includes('drive.google.com/file/d/')) {
    return url.replace('/view', '/preview');
  }

  return url;
}

// المشغل السينمائي
function playVideo(videoUrl) {
  if (!videoUrl) {
    alert("لم يتم إضافة رابط فيديو لهذا العمل بعد!");
    return;
  }

  const modal = document.getElementById('videoModal');
  const playerBox = document.getElementById('videoPlayerBox');
  const finalUrl = formatVideoEmbedUrl(videoUrl);

  if (videoUrl.endsWith('.mp4')) {
    playerBox.innerHTML = `
      <video controls autoplay playsinline style="width:100%; height:100%;">
        <source src="${videoUrl}" type="video/mp4">
        متصفحك لا يدعم تشغيل الفيديو.
      </video>
    `;
  } else {
    playerBox.innerHTML = `
      <iframe 
        src="${finalUrl}" 
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;
  }

  modal.classList.add('active');
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const playerBox = document.getElementById('videoPlayerBox');
  modal.classList.remove('active');
  playerBox.innerHTML = '';
}

document.getElementById('heroPlayBtn').addEventListener('click', () => {
  playVideo(currentTopMovieVideo);
});

// تحديث قسم الـ Hero بالعمل المتصدر
function updateTopMovieHero(movies) {
  if (!movies || movies.length === 0) return;

  const sortedMovies = [...movies].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  const topMovie = sortedMovies[0];

  const heroSection = document.getElementById('home');
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');
  const heroMeta = document.getElementById('heroMeta');
  const heroLikes = document.getElementById('heroLikes');
  const heroTypeBadge = document.getElementById('heroTypeBadge');

  if (topMovie) {
    heroSection.style.backgroundImage = `url('${topMovie.image_url}')`;
    heroTitle.textContent = topMovie.title;
    const typeLabel = topMovie.type === 'series' ? 'مسلسل' : 'فيلم';
    heroDesc.textContent = `${typeLabel} التحقيق والجريمة الحاصل على أعلى تصويت وتفضيل في المنصة.`;
    heroLikes.textContent = `🔥 ${topMovie.likes || 0} إعجاب`;
    heroTypeBadge.textContent = topMovie.type === 'series' ? '📺 مسلسل' : '🎬 فيلم';
    heroMeta.style.display = 'flex';
    currentTopMovieVideo = topMovie.video_url || "";
  }
}

// رسم بطاقات الأعمال حسب الفلتر المختار
function renderCards() {
  const container = document.getElementById('moviesContainer');
  if (!container) return;

  const filtered = currentFilter === 'all' 
    ? allMoviesData 
    : allMoviesData.filter(m => (m.type || 'movie') === currentFilter);

  if (filtered.length === 0) {
    container.innerHTML = `<p class="empty-msg">لا توجد أعمال متاحة في هذا القسم حالياً.</p>`;
    return;
  }

  container.innerHTML = filtered.map(movie => {
    const savedVote = localStorage.getItem(`reaction_${movie.id}`);
    const likeActive = savedVote === 'like' ? 'voted' : '';
    const dislikeActive = savedVote === 'dislike' ? 'voted' : '';
    const movieVideo = movie.video_url || '';
    const typeTag = (movie.type === 'series') ? '📺 مسلسل' : '🎬 فيلم';

    return `
      <div class="movie-card" data-id="${movie.id}">
        <div class="card-img-container" onclick="playVideo('${movieVideo}')">
          <img src="${movie.image_url}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450/141419/ff1a1a?text=Crime+World'">
          <span class="card-badge">${movie.badge || 'HD'}</span>
          <span class="card-type-tag">${typeTag}</span>
        </div>
        <div class="card-content">
          <h3>${movie.title}</h3>
          <div class="card-footer">
            <div class="reaction-box">
              <button class="vote-btn like-btn ${likeActive}" onclick="handleVote('${movie.id}', 'like')">
                👍 <span class="like-count">${movie.likes || 0}</span>
              </button>
              <button class="vote-btn dislike-btn ${dislikeActive}" onclick="handleVote('${movie.id}', 'dislike')">
                👎 <span class="dislike-count">${movie.dislikes || 0}</span>
              </button>
            </div>
            <button class="play-mini-btn" title="تشغيل" onclick="playVideo('${movieVideo}')">▶</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// دالة الفلترة (الكل / أفلام / مسلسلات)
function filterContent(type) {
  currentFilter = type;

  // تحديث حالة الأزرار النشطة
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === type);
  });

  renderCards();
}

// جلب الأعمال من Supabase
async function loadMovies() {
  const container = document.getElementById('moviesContainer');
  if (!container) return;

  const { data: movies, error } = await supabaseClient
    .from('movies')
    .select('*');

  if (error || !movies || movies.length === 0) {
    container.innerHTML = `<p class="empty-msg">لا توجد أعمال متاحة حالياً</p>`;
    return;
  }

  allMoviesData = movies;
  updateTopMovieHero(movies);
  renderCards();
}

// معالجة تصويت Like / Dislike
async function handleVote(movieId, clickedType) {
  const card = document.querySelector(`.movie-card[data-id="${movieId}"]`);
  if (!card) return;

  const likeBtn = card.querySelector('.like-btn');
  const dislikeBtn = card.querySelector('.dislike-btn');
  const likeSpan = card.querySelector('.like-count');
  const dislikeSpan = card.querySelector('.dislike-count');

  const storageKey = `reaction_${movieId}`;
  const previousVote = localStorage.getItem(storageKey) || 'none';
  
  let newVote = clickedType;

  if (previousVote === clickedType) {
    newVote = 'none';
  }

  if (previousVote === 'like') {
    likeSpan.textContent = Math.max(0, parseInt(likeSpan.textContent) - 1);
    likeBtn.classList.remove('voted');
  } else if (previousVote === 'dislike') {
    dislikeSpan.textContent = Math.max(0, parseInt(dislikeSpan.textContent) - 1);
    dislikeBtn.classList.remove('voted');
  }

  if (newVote === 'like') {
    likeSpan.textContent = parseInt(likeSpan.textContent) + 1;
    likeBtn.classList.add('voted');
  } else if (newVote === 'dislike') {
    dislikeSpan.textContent = parseInt(dislikeSpan.textContent) + 1;
    dislikeBtn.classList.add('voted');
  }

  if (newVote === 'none') {
    localStorage.removeItem(storageKey);
  } else {
    localStorage.setItem(storageKey, newVote);
  }

  // تحديث البيانات محلياً للمحافظة على الترتيب والفلترة
  const targetItem = allMoviesData.find(m => m.id === movieId);
  if (targetItem) {
    if (previousVote === 'like') targetItem.likes = Math.max(0, (targetItem.likes || 0) - 1);
    if (previousVote === 'dislike') targetItem.dislikes = Math.max(0, (targetItem.dislikes || 0) - 1);
    if (newVote === 'like') targetItem.likes = (targetItem.likes || 0) + 1;
    if (newVote === 'dislike') targetItem.dislikes = (targetItem.dislikes || 0) + 1;
  }

  const { error } = await supabaseClient.rpc('update_reaction', {
    target_id: movieId,
    new_type: newVote,
    previous_type: previousVote
  });

  if (error) {
    console.error("فشل التحديث:", error);
  } else {
    updateTopMovieHero(allMoviesData);
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeVideoModal();
});

document.addEventListener('DOMContentLoaded', loadMovies);
