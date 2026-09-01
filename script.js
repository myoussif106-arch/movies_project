// 1. إعداد الاتصال بقاعدة بيانات Supabase
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. التحكم في قائمة الموبايل والشريط العلوي
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.backgroundColor = 'rgba(7, 7, 8, 0.95)';
    navbar.style.boxShadow = '0 2px 10px rgba(179, 0, 0, 0.15)';
  } else {
    navbar.style.backgroundColor = 'transparent';
    navbar.style.boxShadow = 'none';
  }
});

// 3. جلب بيانات التفاعلات من Supabase وتحديث الأزرار المحفوظة محلياً
async function loadMovieStats() {
  const { data, error } = await supabaseClient
    .from('movie_reactions')
    .select('movie_id, likes, dislikes');

  if (error) {
    console.error("خطأ في جلب تفاعلات الأفلام:", error);
    return;
  }

  data.forEach(item => {
    const card = document.querySelector(`.movie-card[data-id="${item.movie_id}"]`);
    if (!card) return;

    card.querySelector('.like-count').textContent = item.likes;
    card.querySelector('.dislike-count').textContent = item.dislikes;

    // تلوين الزر إذا كان المستخدم قد تفاعل مسبقاً
    const savedVote = localStorage.getItem(`reaction_${item.movie_id}`);
    if (savedVote === 'like') {
      card.querySelector('.like-btn').classList.add('voted');
    } else if (savedVote === 'dislike') {
      card.querySelector('.dislike-btn').classList.add('voted');
    }
  });
}

// 4. معالجة ضغط المستخدم على Like / Dislike
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

  // إذا ضغط المستخدم على نفس الزر المفعل حالياً، يُلغى التفاعل
  if (previousVote === clickedType) {
    newVote = 'none';
  }

  // --- تحديث فوري للواجهة (Optimistic UI) ---
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

  // حفظ الاختيار محلياً في جهاز المستخدم
  if (newVote === 'none') {
    localStorage.removeItem(storageKey);
  } else {
    localStorage.setItem(storageKey, newVote);
  }

  // --- إرسال التحديث إلى قاعدة بيانات Supabase ---
  const { error } = await supabaseClient.rpc('update_reaction', {
    target_id: movieId,
    new_type: newVote,
    previous_type: previousVote
  });

  if (error) {
    console.error("فشل حفظ التفاعل في السيرفر:", error);
  }
}

// تشغيل جلب البيانات فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadMovieStats);
