// بيانات الاتصال الخاصة بمشروعك في Supabase
const SUPABASE_URL = "https://wdyhgweypfquorviikxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkeWhnd2V5cGZxdW9ydmlpa3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjQ2MDksImV4cCI6MjA5NjUwMDYwOX0.zNEqFeVZmTJynohdkP6cQKH-NWUgpsAQQ8gGlHaYoDs";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// التحكم في قائمة الموبايل
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// تغيير خلفية الـ Navbar عند التمرير
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

// جلب الأفلام من جدول movies في قاعدة بياناتك وعرضها
async function loadMovies() {
  const container = document.getElementById('moviesContainer');
  if (!container) return;

  const { data: movies, error } = await supabaseClient
    .from('movies')
    .select('*');

  if (error) {
    console.error("خطأ في جلب الأفلام من Supabase:", error);
    container.innerHTML = `<p style="color: #ff1a1a; font-weight: bold;">تعذر جلب الأفلام. تأكد من تشغيل كود الـ SQL في Supabase أولاً.</p>`;
    return;
  }

  if (!movies || movies.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">لا توجد أفلام مضافة حتى الآن في قاعدة البيانات. أضف أفلامك من لوحة تحكم Supabase!</p>`;
    return;
  }

  // بناء كروت الأفلام ديناميكياً
  container.innerHTML = movies.map(movie => {
    const savedVote = localStorage.getItem(`reaction_${movie.id}`);
    const likeActive = savedVote === 'like' ? 'voted' : '';
    const dislikeActive = savedVote === 'dislike' ? 'voted' : '';

    return `
      <div class="movie-card" data-id="${movie.id}">
        <div class="card-img-container">
          <img src="${movie.image_url}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450/141419/ff1a1a?text=Crime+World'">
          <span class="card-badge">${movie.badge || 'HD'}</span>
        </div>
        <div class="card-content">
          <h3>${movie.title}</h3>
          <p>${movie.genre || 'جريمة • غموض'}</p>
          <div class="card-footer">
            <div class="reaction-box">
              <button class="vote-btn like-btn ${likeActive}" onclick="handleVote('${movie.id}', 'like')">
                👍 <span class="like-count">${movie.likes || 0}</span>
              </button>
              <button class="vote-btn dislike-btn ${dislikeActive}" onclick="handleVote('${movie.id}', 'dislike')">
                👎 <span class="dislike-count">${movie.dislikes || 0}</span>
              </button>
            </div>
            <button class="play-mini-btn" title="تشغيل">▶</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// دالة التعامل مع الضغط على Like أو Dislike
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

  // في حال ضغط المستخدم على نفس الزر مرة ثانية يتم إلغاء التصويت
  if (previousVote === clickedType) {
    newVote = 'none';
  }

  // 1. تحديث الأرقام والواجهة فوراً للزائر
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

  // حفظ الاختيار محلياً بجهاز الزائر
  if (newVote === 'none') {
    localStorage.removeItem(storageKey);
  } else {
    localStorage.setItem(storageKey, newVote);
  }

  // 2. تحديث الإحصائيات في قاعدة بيانات Supabase
  const { error } = await supabaseClient.rpc('update_reaction', {
    target_id: movieId,
    new_type: newVote,
    previous_type: previousVote
  });

  if (error) {
    console.error("فشل إرسال التفاعل إلى Supabase:", error);
  }
}

// تشغيل جلب الأفلام فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadMovies);
