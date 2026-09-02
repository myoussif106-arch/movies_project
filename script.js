// بيانات الاتصال بـ Supabase
const SUPABASE_URL = "https://wdyhgweypfquorviikxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkeWhnd2V5cGZxdW9ydmlpa3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjQ2MDksImV4cCI6MjA5NjUwMDYwOX0.zNEqFeVZmTJynohdkP6cQKH-NWUgpsAQQ8gGlHaYoDs";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let moviesList = [];
let topHeroMovie = null;
let currentCategory = 'all';

// تظليل الناف بار عند التمرير
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// معالجة وتنسيق الروابط لتعمل في المشغل بدون حظر
function formatVideoUrl(url) {
  if (!url) return "";

  if (url.includes('dailymotion.com/video/')) {
    const id = url.split('/video/')[1].split('?')[0];
    return `https://www.dailymotion.com/embed/video/${id}?autoplay=1&ui-start-screen-info=0&endscreen-enable=false&queue-enable=false`;
  }
  if (url.includes('dai.ly/')) {
    const id = url.split('dai.ly/')[1].split('?')[0];
    return `https://www.dailymotion.com/embed/video/${id}?autoplay=1&ui-start-screen-info=0&endscreen-enable=false&queue-enable=false`;
  }

  if (url.includes('youtube.com/watch?v=')) {
    const id = url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }

  if (url.includes('drive.google.com/file/d/')) {
    return url.replace('/view', '/preview');
  }

  return url;
}

// تشغيل الفيديو
function launchPlayer(videoUrl) {
  if (!videoUrl) {
    alert("عذراً، لم يتم إضافة رابط تشغيل متاح بعد.");
    return;
  }

  closeDetailModal();

  const playerModal = document.getElementById('playerModal');
  const embedHolder = document.getElementById('videoEmbedHolder');
  const finalUrl = formatVideoUrl(videoUrl);

  if (videoUrl.endsWith('.mp4')) {
    embedHolder.innerHTML = `
      <video controls autoplay playsinline style="width:100%;height:100%;">
        <source src="${videoUrl}" type="video/mp4">
      </video>
    `;
  } else {
    embedHolder.innerHTML = `
      <iframe src="${finalUrl}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>
    `;
  }

  playerModal.classList.add('active');
}

function closePlayer() {
  const playerModal = document.getElementById('playerModal');
  const embedHolder = document.getElementById('videoEmbedHolder');
  playerModal.classList.remove('active');
  embedHolder.innerHTML = '';
}

// جلب الأعمال
async function fetchCatalog() {
  const container = document.getElementById('moviesContainer');
  const { data: movies, error } = await supabaseClient.from('movies').select('*');

  if (error || !movies || movies.length === 0) {
    container.innerHTML = `<p style="color:#777; grid-column:1/-1; text-align:center; padding:3rem 0;">لا توجد أعمال متاحة حالياً.</p>`;
    return;
  }

  moviesList = movies;
  setupHeroBanner(movies);
  renderMovieCards();
}

// إعداد بانر الـ Hero المتصدر
function setupHeroBanner(movies) {
  const sorted = [...movies].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  topHeroMovie = sorted[0];

  if (!topHeroMovie) return;

  const banner = document.getElementById('heroBanner');
  const bgImg = topHeroMovie.backdrop_url || topHeroMovie.image_url;
  banner.style.backgroundImage = `url('${bgImg}')`;

  document.getElementById('heroTitle').textContent = topHeroMovie.title;
  document.getElementById('heroTypeLabel').textContent = topHeroMovie.type === 'series' ? 'مسلسل أصلي' : 'فيلم أصلي';
  document.getElementById('heroQuality').textContent = topHeroMovie.badge || 'HD';
  document.getElementById('heroLikes').textContent = `🔥 ${topHeroMovie.likes || 0} إعجاب`;
  document.getElementById('heroDesc').textContent = topHeroMovie.description || 'عمل سينمائي متميز حاز على أعلى إعجاب وتفاعل من المشاهدين.';

  document.getElementById('heroPlayBtn').onclick = () => openAction(topHeroMovie);
  document.getElementById('heroMoreInfoBtn').onclick = () => openDetailModal(topHeroMovie);
}

// رسم بطاقات الأعمال
function renderMovieCards() {
  const container = document.getElementById('moviesContainer');
  const filtered = currentCategory === 'all' 
    ? moviesList 
    : moviesList.filter(m => (m.type || 'movie') === currentCategory);

  if (filtered.length === 0) {
    container.innerHTML = `<p style="color:#777; grid-column:1/-1; text-align:center; padding:3rem 0;">لا توجد أعمال في هذا القسم.</p>`;
    return;
  }

  container.innerHTML = filtered.map(movie => {
    const isSeries = movie.type === 'series';
    const tag = isSeries ? 'مسلسل' : 'فيلم';
    const saved = localStorage.getItem(`react_${movie.id}`);
    const likeVoted = saved === 'like' ? 'voted-like' : '';
    const dislikeVoted = saved === 'dislike' ? 'voted-dislike' : '';

    return `
      <div class="netflix-card" onclick="openDetailModalById('${movie.id}')">
        <div class="card-poster">
          <img src="${movie.image_url}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450/141414/e50914?text=CRIME+WORLD'">
          <span class="card-top-tag">${tag}</span>
        </div>
        <div class="card-hover-info">
          <h4 class="card-title">${movie.title}</h4>
          <div class="card-quick-actions">
            <button class="card-play-circle" title="تشغيل" onclick="event.stopPropagation(); openActionById('${movie.id}')">▶</button>
            <div class="vote-actions">
              <button class="vote-chip ${likeVoted}" onclick="event.stopPropagation(); voteAction('${movie.id}', 'like')">👍 ${movie.likes || 0}</button>
              <button class="vote-chip ${dislikeVoted}" onclick="event.stopPropagation(); voteAction('${movie.id}', 'dislike')">👎</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// نافذة التفاصيل
async function openDetailModal(movie) {
  const modal = document.getElementById('detailModal');
  const heroBg = document.getElementById('modalHeroBg');
  
  heroBg.style.backgroundImage = `url('${movie.backdrop_url || movie.image_url}')`;
  document.getElementById('modalTitle').textContent = movie.title;
  document.getElementById('modalBadge').textContent = movie.badge || 'HD';
  document.getElementById('modalGenre').textContent = movie.genre || 'غموض • جريمة';
  document.getElementById('modalDescription').textContent = movie.description || 'لا يوجد وصف مختصر متاح حالياً.';

  document.getElementById('modalMainPlayBtn').onclick = () => openAction(movie);

  const episodesSection = document.getElementById('episodesSection');
  const episodesList = document.getElementById('episodesListContainer');

  if (movie.type === 'series') {
    episodesSection.style.display = 'block';
    episodesList.innerHTML = `<p style="color:#777;">جاري جلب الحلقات...</p>`;

    const { data: episodes } = await supabaseClient
      .from('episodes')
      .select('*')
      .eq('series_id', movie.id)
      .order('episode_number', { ascending: true });

    if (episodes && episodes.length > 0) {
      episodesList.innerHTML = episodes.map(ep => `
        <div class="episode-card" onclick="launchPlayer('${ep.video_url}')">
          <span class="ep-number">${ep.episode_number}</span>
          <div class="ep-info">
            <div class="ep-top-bar">
              <span class="ep-title-text">${ep.title}</span>
              <span class="ep-duration">${ep.duration || '45 دقيقة'}</span>
            </div>
            <p class="ep-desc">${ep.overview || 'اضغط لمشاهدة الحلقة بجودة عالية.'}</p>
          </div>
          <button class="ep-play-btn">▶</button>
        </div>
      `).join('');
    } else {
      episodesList.innerHTML = `<p style="color:#777; padding:1rem 0;">لم يتم إدراج حلقات لهذا المسلسل بعد.</p>`;
    }
  } else {
    episodesSection.style.display = 'none';
  }

  modal.classList.add('active');
}

function openDetailModalById(id) {
  const item = moviesList.find(m => m.id === id);
  if (item) openDetailModal(item);
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.remove('active');
}

function openAction(item) {
  if (item.type === 'series') {
    openDetailModal(item);
  } else {
    launchPlayer(item.video_url);
  }
}

function openActionById(id) {
  const item = moviesList.find(m => m.id === id);
  if (item) openAction(item);
}

// فلترة المحتوى
function filterContent(category, element) {
  currentCategory = category;
  document.querySelectorAll('.pill, .nav-item').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');
  renderMovieCards();
}

// معالجة تصويت اللايك والديسلايك واستدعاء update_reaction
async function voteAction(id, type) {
  const key = `react_${id}`;
  const prev = localStorage.getItem(key) || 'none';
  let next = (prev === type) ? 'none' : type;

  if (next === 'none') localStorage.removeItem(key);
  else localStorage.setItem(key, next);

  const movie = moviesList.find(m => m.id === id);
  if (movie) {
    if (prev === 'like') movie.likes = Math.max(0, (movie.likes || 0) - 1);
    if (prev === 'dislike') movie.dislikes = Math.max(0, (movie.dislikes || 0) - 1);
    if (next === 'like') movie.likes = (movie.likes || 0) + 1;
    if (next === 'dislike') movie.dislikes = (movie.dislikes || 0) + 1;
  }

  renderMovieCards();

  if (topHeroMovie && topHeroMovie.id === id) {
    document.getElementById('heroLikes').textContent = `🔥 ${movie.likes || 0} إعجاب`;
  }

  // حفظ التفاعل في قاعدة البيانات عبر دالة RPC
  const { error } = await supabaseClient.rpc('update_reaction', {
    target_id: id,
    new_type: next,
    previous_type: prev
  });

  if (error) {
    console.error("خطأ في تسجيل التفاعل:", error);
  }
}

// زر الهروب Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePlayer();
    closeDetailModal();
  }
});

document.addEventListener('DOMContentLoaded', fetchCatalog);
