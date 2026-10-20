* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #fffaf5;
  --bg-strong: #fff3ec;
  --panel: rgba(255, 255, 255, 0.9);
  --panel-soft: #fffdfb;
  --primary: #ff5a5f;
  --primary-dark: #e74448;
  --accent: #fe8b5d;
  --text: #1d1d1f;
  --muted: #5d5d63;
  --border: rgba(29, 29, 31, 0.08);
  --shadow: 0 24px 55px rgba(255, 90, 95, 0.12);
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(180deg, #fffaf5 0%, #fff7f2 100%);
  color: var(--text);
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
  padding: 22px 18px 54px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 10px 6px 20px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  font-weight: 800;
  box-shadow: 0 14px 28px rgba(255, 90, 95, 0.24);
}

.brand-name {
  color: var(--text);
  font-weight: 700;
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
  font-weight: 500;
}

.nav-links a:hover {
  color: var(--primary-dark);
}

.nav-btn,
.primary-btn,
.success-btn {
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.nav-btn,
.primary-btn,
.success-btn {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  box-shadow: 0 14px 28px rgba(255, 90, 95, 0.2);
}

.nav-btn {
  padding: 12px 18px;
}

.primary-btn,
.success-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 22px;
}

.nav-btn:hover,
.primary-btn:hover,
.success-btn:hover {
  transform: translateY(-2px);
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 0 0;
}

.hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 30px;
  align-items: center;
  padding: 26px 0 14px;
}

.hero-copy {
  padding: 18px 0;
}

.eyebrow {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 90, 95, 0.08);
  color: var(--primary-dark);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.accent {
  background: rgba(254, 139, 93, 0.1);
  color: #d8653d;
}

.hero-copy h1 {
  max-width: 620px;
  margin-top: 18px;
  font-size: clamp(2.8rem, 5vw, 4.8rem);
  line-height: 1.06;
  letter-spacing: -0.06em;
  color: var(--text);
}

.hero-copy p {
  margin-top: 18px;
  max-width: 560px;
  color: var(--muted);
  line-height: 1.8;
  font-size: 1.08rem;
}

.search-bar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 14px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 14px 14px 14px 18px;
  margin-top: 28px;
  box-shadow: var(--shadow);
}

.search-bar > div {
  padding: 10px 8px;
}

.search-bar label {
  display: block;
  color: var(--muted);
  font-size: 0.74rem;
  margin-bottom: 4px;
}

.search-bar span {
  color: var(--text);
  font-weight: 600;
}

.search-btn {
  align-self: center;
  border: none;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  padding: 14px 18px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
}

.rating-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(110px, 1fr));
  gap: 18px;
  max-width: 520px;
  margin-top: 28px;
}

.rating-row div {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-row strong {
  color: var(--text);
  font-size: 1.2rem;
}

.rating-row span {
  color: var(--muted);
  font-size: 0.8rem;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-card {
  width: 100%;
  max-width: 430px;
  background: linear-gradient(135deg, rgba(255, 90, 95, 0.18), rgba(254, 139, 93, 0.12));
  border: 1px solid var(--border);
  border-radius: 28px;
  padding: 24px 22px;
  box-shadow: var(--shadow);
  min-height: 330px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-image: linear-gradient(180deg, rgba(12, 12, 18, 0.15), rgba(12, 12, 18, 0.52)), url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  color: white;
}

.pill {
  display: inline-block;
  width: fit-content;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.72rem;
  margin-bottom: 12px;
}

.visual-card h3 {
  font-size: 2.2rem;
  margin-bottom: 8px;
}

.visual-card p {
  margin-bottom: 18px;
  color: rgba(255, 255, 255, 0.8);
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-row strong {
  font-size: 2rem;
}

.price-row span {
  color: rgba(255, 255, 255, 0.8);
}

.feature-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 26px;
}

.feature-box {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 18px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.feature-box span {
  font-size: 1.5rem;
}

.feature-box h4 {
  color: var(--text);
  margin-bottom: 5px;
}

.feature-box p {
  color: var(--muted);
  line-height: 1.6;
}

.rooms-section {
  margin-top: 54px;
}

.section-head {
  margin-bottom: 24px;
}

.section-head h2 {
  font-size: clamp(2rem, 3vw, 3rem);
  color: var(--text);
  margin-top: 10px;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.room-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--border);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 18px 30px rgba(29, 29, 31, 0.04);
}

.room-visual {
  height: 220px;
  background-size: cover;
  background-position: center;
}

.visual-one {
  background: linear-gradient(135deg, rgba(255, 90, 95, 0.28), rgba(254, 139, 93, 0.16)), url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80') center/cover no-repeat;
}

.visual-two {
  background: linear-gradient(135deg, rgba(255, 90, 95, 0.18), rgba(22, 30, 48, 0.2)), url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80') center/cover no-repeat;
}

.visual-three {
  background: linear-gradient(135deg, rgba(254, 139, 93, 0.22), rgba(22, 30, 48, 0.12)), url('https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80') center/cover no-repeat;
}

.room-body {
  padding: 20px 20px 22px;
}

.room-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.room-top h3 {
  color: var(--text);
}

.room-top span {
  color: var(--primary-dark);
  font-weight: 700;
}

.room-body p {
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 16px;
}

.room-body ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.room-body li {
  background: rgba(255, 90, 95, 0.07);
  border: 1px solid rgba(255, 90, 95, 0.1);
  border-radius: 999px;
  padding: 7px 10px;
  color: var(--primary-dark);
  font-size: 0.76rem;
  font-weight: 600;
}

.booking-section {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  margin-top: 52px;
}

.card-panel {
  background: rgba(255, 255, 255, 0.83);
  border: 1px solid var(--border);
  border-radius: 28px;
  padding: 28px 24px;
  box-shadow: 0 18px 30px rgba(29, 29, 31, 0.04);
}

.section-head h2 {
  color: var(--text);
  margin-top: 12px;
  font-size: clamp(1.8rem, 2vw, 2.5rem);
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: var(--text);
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #fffefc;
  padding: 14px 16px;
  font-size: 1rem;
  color: var(--text);
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: rgba(255, 90, 95, 0.45);
  box-shadow: 0 0 0 4px rgba(255, 90, 95, 0.08);
}

.block-btn {
  width: 100%;
}

.alert-success {
  margin-top: 20px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.18);
  color: #1a6d38;
  border-radius: 14px;
  padding: 14px 16px;
  font-weight: 600;
}

.payment-box {
  background: rgba(255, 90, 95, 0.04);
  border: 1px solid rgba(255, 90, 95, 0.14);
  border-radius: 20px;
  padding: 22px 20px;
}

.meta-label {
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 7px;
}

.payment-box h3 {
  color: var(--text);
  font-size: 2rem;
  margin-bottom: 18px;
}

.hidden {
  display: none;
}

.footer {
  text-align: center;
  color: var(--muted);
  padding: 24px 12px 8px;
}

@media (max-width: 980px) {
  .hero,
  .feature-strip,
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

  .search-bar {
    grid-template-columns: 1fr;
  }

  .rating-row {
    grid-template-columns: 1fr;
  }

  .nav-btn,
  .primary-btn,
  .success-btn,
  .search-btn {
    width: 100%;
  }
}
