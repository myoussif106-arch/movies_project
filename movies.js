:root {
  --bg-color: #0b0b0d;
  --card-bg: #141419;
  --blood-red: #b30000;
  --blood-hover: #ff1a1a;
  --blood-glow: rgba(179, 0, 0, 0.4);
  --text-main: #f0f0f0;
  --text-muted: #8c8c9a;
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Cairo', sans-serif;
}

body {
  background-color: var(--bg-color);
  color: var(--text-main);
  overflow-x: hidden;
}

/* شريط التنقل */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1.2rem 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(11,11,13,0.7) 100%);
  backdrop-filter: blur(8px);
  z-index: 1000;
  transition: var(--transition);
}

.logo {
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 2px;
}

.blood-text {
  color: var(--blood-red);
  text-shadow: 0 0 15px var(--blood-red);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 700;
  transition: var(--transition);
}

.nav-links a:hover, .nav-links a.active {
  color: var(--blood-hover);
  text-shadow: 0 0 8px var(--blood-glow);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-btn, .profile-btn, .menu-toggle {
  background: transparent;
  border: none;
  color: var(--text-main);
  font-size: 1.2rem;
  cursor: pointer;
  transition: var(--transition);
}

.menu-toggle {
  display: none;
}

/* القسم الرئيسي Hero */
.hero {
  position: relative;
  height: 90vh;
  display: flex;
  align-items: center;
  padding: 0 5%;
  background: url('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;
}

.hero-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(90deg, rgba(11, 11, 13, 0.95) 20%, rgba(11, 11, 13, 0.5) 60%, rgba(179, 0, 0, 0.2) 100%),
              linear-gradient(0deg, var(--bg-color) 0%, transparent 40%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 650px;
}

.badge {
  display: inline-block;
  background: var(--blood-red);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1rem;
  box-shadow: 0 0 10px var(--blood-glow);
}

.movie-title {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}

.movie-desc {
  color: #ccc;
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.movie-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.8rem 1.8rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background: var(--blood-red);
  color: #fff;
  box-shadow: 0 0 15px var(--blood-glow);
}

.btn-primary:hover {
  background: var(--blood-hover);
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(255, 26, 26, 0.6);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  backdrop-filter: blur(5px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* شبكة الأفلام */
.container {
  padding: 3rem 5%;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  border-right: 4px solid var(--blood-red);
  padding-right: 12px;
}

.section-title span {
  color: var(--blood-red);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2rem;
}

.movie-card {
  background: var(--card-bg);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: var(--transition);
  position: relative;
}

.movie-card:hover {
  transform: translateY(-8px);
  border-color: var(--blood-red);
  box-shadow: 0 10px 20px rgba(179, 0, 0, 0.25);
}

.card-img-container {
  position: relative;
  width: 100%;
  height: 320px;
}

.card-img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--blood-red);
  color: #fff;
  padding: 2px 8px;
  font-size: 0.75rem;
  border-radius: 4px;
}

.card-content {
  padding: 1rem;
}

.card-content h3 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.card-content p {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 0.8rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* أزرار التفاعل Like / Dislike */
.reaction-box {
  display: flex;
  gap: 8px;
  align-items: center;
}

.vote-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: var(--transition);
}

.vote-btn:hover {
  background: rgba(179, 0, 0, 0.2);
  border-color: var(--blood-red);
}

.like-btn.voted {
  background: var(--blood-red);
  color: #fff;
  border-color: var(--blood-hover);
  box-shadow: 0 0 10px var(--blood-glow);
}

.dislike-btn.voted {
  background: #33333d;
  color: #fff;
  border-color: #666;
}

.play-mini-btn {
  background: var(--blood-red);
  border: none;
  color: #fff;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-mini-btn:hover {
  background: var(--blood-hover);
  transform: scale(1.1);
}

/* تذييل الصفحة */
footer {
  background: #070708;
  border-top: 1px solid rgba(179, 0, 0, 0.2);
  padding: 3rem 5%;
  text-align: center;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: var(--blood-hover);
}

.copyright {
  color: #555;
  font-size: 0.8rem;
}

/* التجاوب مع شاشات الموبايل */
@media (max-width: 768px) {
  .nav-links {
    position: absolute;
    top: 100%;
    right: 0;
    width: 100%;
    background: rgba(11, 11, 13, 0.98);
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 0;
    gap: 1.2rem;
    display: none;
    border-bottom: 2px solid var(--blood-red);
  }

  .nav-links.active {
    display: flex;
  }

  .menu-toggle {
    display: block;
  }

  .movie-title {
    font-size: 2rem;
  }

  .hero-content {
    text-align: center;
  }

  .hero-buttons {
    justify-content: center;
  }

  .movie-meta {
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.8rem;
  }
}
