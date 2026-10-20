* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #081120;
  --bg-soft: #101b2f;
  --panel: rgba(15, 24, 39, 0.8);
  --panel-strong: rgba(20, 32, 48, 0.92);
  --primary: #79a8ff;
  --primary-strong: #dfe9ff;
  --alt: #77efc5;
  --dark: #edf3ff;
  --text: #dfe8f7;
  --muted: #a6b6d6;
  --border: rgba(161, 185, 255, 0.18);
  --shadow: 0 25px 70px rgba(71, 104, 196, 0.28);
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Poppins', sans-serif;
  background:
    radial-gradient(circle at top left, rgba(121, 168, 255, 0.18), transparent 30%),
    radial-gradient(circle at top right, rgba(119, 239, 197, 0.18), transparent 25%),
    linear-gradient(180deg, #081120 0%, #0d1830 100%);
  color: var(--text);
}

img {
  max-width: 100%;
  display: block;
}

a {
  text-decoration: none;
}

button,
input,
select {
  font: inherit;
}

.page-shell {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 18px 60px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 10px 12px;
  border-bottom: 1px solid var(--border);
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #07131f;
  background: linear-gradient(135deg, #dfe9ff, #77efc5);
  box-shadow: 0 20px 30px rgba(119, 239, 197, 0.24);
}

.brand-name {
  font-weight: 700;
  color: var(--dark);
}

.brand-wrap small {
  color: var(--muted);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 26px;
  flex-wrap: wrap;
}

.nav-links a {
  color: var(--muted);
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--primary-strong);
}

.nav-btn,
.primary-btn,
.secondary-btn,
.success-btn {
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.nav-btn,
.primary-btn,
.success-btn {
  background: linear-gradient(135deg, #dfe9ff, #77efc5);
  color: #081120;
  box-shadow: 0 16px 30px rgba(121, 168, 255, 0.22);
}

.nav-btn {
  padding: 12px 18px;
  font-weight: 700;
}

.primary-btn,
.success-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 22px;
  font-weight: 700;
}

.secondary-btn {
  background: rgba(121, 168, 255, 0.12);
  color: var(--primary-strong);
  border: 1px solid var(--border);
  padding: 14px 22px;
  font-weight: 700;
}

.nav-btn:hover,
.primary-btn:hover,
.secondary-btn:hover,
.success-btn:hover {
  transform: translateY(-2px);
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 0 20px;
}

.hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 28px;
  align-items: center;
}

.hero-copy {
  padding: 20px 0;
}

.eyebrow {
  display: inline-block;
  background: rgba(121, 168, 255, 0.12);
  border: 1px solid var(--border);
  color: var(--primary-strong);
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.accent {
  background: rgba(119, 239, 197, 0.12);
  color: #b8f8de;
}

.hero-copy h1 {
  margin-top: 16px;
  font-size: clamp(2.8rem, 5vw, 4.8rem);
  line-height: 1.06;
  letter-spacing: -0.06em;
  color: var(--dark);
  max-width: 620px;
}

.hero-copy p {
  margin-top: 18px;
  color: var(--muted);
  font-size: 1.08rem;
  line-height: 1.8;
  max-width: 590px;
}

.cta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 26px;
}

.rating-box {
  display: grid;
  grid-template-columns: repeat(3, minmax(110px, 1fr));
  gap: 18px;
  max-width: 540px;
  margin-top: 30px;
}

.rating-box div {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-box strong {
  color: var(--dark);
  font-size: 1.4rem;
}

.rating-box span {
  color: var(--muted);
  font-size: 0.8rem;
}

.hero-showcase {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.showcase-card {
  border-radius: 28px;
  border: 1px solid var(--border);
  background: linear-gradient(135deg, rgba(121, 168, 255, 0.18), rgba(119, 239, 197, 0.09));
  box-shadow: var(--shadow);
}

.main-card {
  padding: 28px 24px;
}

.pill {
  display: inline-block;
  background: rgba(119, 239, 197, 0.12);
  color: #bbf4df;
  border: 1px solid rgba(119, 239, 197, 0.25);
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 0.72rem;
  font-weight: 600;
  margin-bottom: 18px;
}

.main-card h3 {
  font-size: 2.1rem;
  margin-bottom: 8px;
}

.main-card p {
  color: var(--muted);
  margin-bottom: 16px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-row strong {
  font-size: 2.2rem;
  color: var(--dark);
}

.price-row span {
  color: var(--muted);
}

.floating-card {
  padding: 22px 20px;
  display: grid;
  gap: 16px;
}

.mini-info {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
}

.mini-info span {
  color: var(--muted);
}

.feature-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 28px;
}

.feature-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 20px 18px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.feature-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(121, 168, 255, 0.12);
  font-size: 1.4rem;
}

.feature-item h4 {
  color: var(--dark);
  margin-bottom: 6px;
}

.feature-item p {
  color: var(--muted);
  line-height: 1.6;
}

.rooms-section {
  margin-top: 52px;
}

.section-header {
  margin-bottom: 26px;
}

.section-header h2 {
  color: var(--dark);
  font-size: clamp(2rem, 3vw, 3rem);
  margin-top: 10px;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.room-card {
  background: rgba(20, 32, 48, 0.85);
  border: 1px solid var(--border);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 18px 32px rgba(4, 8, 18, 0.24);
}

.room-visual {
  height: 220px;
  background-size: cover;
  background-position: center;
}

.visual-one {
  background: linear-gradient(135deg, rgba(121, 168, 255, 0.28), rgba(17, 33, 61, 0.1)), url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80') center/cover no-repeat;
}

.visual-two {
  background: linear-gradient(135deg, rgba(119, 239, 197, 0.2), rgba(17, 33, 61, 0.1)), url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80') center/cover no-repeat;
}

.visual-three {
  background: linear-gradient(135deg, rgba(121, 168, 255, 0.2), rgba(17, 33, 61, 0.12)), url('https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80') center/cover no-repeat;
}

.room-body {
  padding: 20px 20px 22px;
}

.room-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.room-head h3 {
  color: var(--dark);
}

.room-head span {
  color: #bfe0ff;
  font-weight: 700;
}

.room-body p {
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 20px;
}

.room-body ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.room-body li {
  border-radius: 999px;
  background: rgba(121, 168, 255, 0.08);
  color: var(--primary-strong);
  border: 1px solid var(--border);
  padding: 7px 10px;
  font-size: 0.74rem;
  font-weight: 600;
}

.booking-section {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 24px;
  margin-top: 52px;
}

.card-panel {
  background: rgba(15, 24, 39, 0.8);
  border: 1px solid var(--border);
  border-radius: 26px;
  padding: 28px 24px;
  box-shadow: 0 22px 40px rgba(4, 8, 18, 0.18);
}

.section-head {
  margin-bottom: 20px;
}

.section-head h2 {
  color: var(--dark);
  font-size: clamp(1.8rem, 2vw, 2.5rem);
  margin-top: 14px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--dark);
}

.form-group input,
.form-group select {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  color: var(--dark);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 1rem;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: rgba(121, 168, 255, 0.55);
  box-shadow: 0 0 0 4px rgba(121, 168, 255, 0.12);
}

.block-btn {
  width: 100%;
}

.alert-success {
  margin-top: 18px;
  border-radius: 14px;
  padding: 14px 16px;
  font-weight: 600;
  background: rgba(119, 239, 197, 0.1);
  color: #bcf9e1;
  border: 1px solid rgba(119, 239, 197, 0.24);
}

.payment-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 22px 20px;
}

.meta-label {
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 6px;
}

.payment-box h3 {
  color: var(--dark);
  font-size: 2rem;
  margin-bottom: 18px;
}

.hidden {
  display: none;
}

.footer {
  text-align: center;
  color: var(--muted);
  padding: 30px 12px 10px;
}

@media (max-width: 980px) {
  .hero,
  .feature-row,
  .room-grid,
  .booking-section {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 560px) {
  .nav-links {
    display: none;
  }

  .topbar {
    justify-content: space-between;
  }

  .cta-row {
    flex-direction: column;
    align-items: stretch;
  }

  .primary-btn,
  .secondary-btn,
  .nav-btn,
  .success-btn {
    width: 100%;
  }

  .rating-box {
    grid-template-columns: 1fr;
  }
}
