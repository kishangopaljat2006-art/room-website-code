* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #edf5ff;
  --bg-soft: #f9fbff;
  --card: rgba(255, 255, 255, 0.9);
  --card-strong: #ffffff;
  --primary: #1d4ed8;
  --primary-dark: #173ca7;
  --secondary: #10b981;
  --dark: #11213d;
  --text: #24324a;
  --muted: #5f6d84;
  --border: rgba(17, 33, 61, 0.08);
  --shadow: 0 25px 70px rgba(29, 78, 216, 0.13);
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(180deg, #edf5ff 0%, #f7f9fd 100%);
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

.topbar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
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
  background: linear-gradient(135deg, var(--primary), #6ea8ff);
  color: #fff;
  font-weight: 800;
  box-shadow: 0 16px 32px rgba(29, 78, 216, 0.28);
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
  gap: 26px;
  align-items: center;
  flex-wrap: wrap;
}

.nav-links a {
  color: var(--muted);
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--primary);
}

.nav-btn,
.primary-btn,
.secondary-btn,
.success-btn {
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.nav-btn,
.primary-btn,
.success-btn {
  background: linear-gradient(135deg, var(--primary), #4f8cf6);
  color: #fff;
  box-shadow: 0 12px 30px rgba(29, 78, 216, 0.25);
}

.nav-btn {
  padding: 12px 18px;
  font-weight: 600;
}

.primary-btn,
.success-btn {
  padding: 14px 22px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.secondary-btn {
  background: rgba(29, 78, 216, 0.08);
  color: var(--primary);
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
  padding: 20px 20px 40px;
}

.hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 28px;
  align-items: center;
  padding: 40px 0 18px;
}

.hero-copy {
  padding: 25px 0;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 18px;
  background: rgba(29, 78, 216, 0.08);
  color: var(--primary);
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  font-weight: 700;
  text-transform: uppercase;
}

.accent {
  background: rgba(16, 185, 129, 0.1);
  color: #0b8f69;
}

.hero-copy h1 {
  font-size: clamp(2.6rem, 5vw, 4.4rem);
  line-height: 1.08;
  letter-spacing: -0.05em;
  color: var(--dark);
  max-width: 620px;
}

.hero-copy p {
  margin-top: 18px;
  color: var(--muted);
  font-size: 1.08rem;
  line-height: 1.7;
  max-width: 600px;
}

.cta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(110px, 1fr));
  gap: 18px;
  margin-top: 36px;
  max-width: 520px;
}

.stats-grid div {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 12px 28px rgba(17, 33, 61, 0.04);
}

.stats-grid strong {
  color: var(--dark);
  font-size: 1.3rem;
}

.stats-grid span {
  color: var(--muted);
  font-size: 0.82rem;
}

.hero-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mini-card {
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.97), rgba(16, 185, 129, 0.9));
  color: white;
  border-radius: 28px;
  padding: 26px 24px;
  box-shadow: var(--shadow);
}

.glowing {
  position: relative;
  overflow: hidden;
}

.glowing::after {
  content: "";
  position: absolute;
  inset: auto -30% -40% 40%;
  height: 200px;
  width: 200px;
  background: rgba(255, 255, 255, 0.13);
  border-radius: 50%;
}

.badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 0.72rem;
  margin-bottom: 14px;
}

.mini-card h3 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.mini-card p {
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 18px;
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
  color: rgba(255, 255, 255, 0.85);
}

.mini-list {
  background: var(--card-strong);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 18px 20px;
  box-shadow: 0 20px 40px rgba(17, 33, 61, 0.08);
}

.mini-list div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(17, 33, 61, 0.08);
}

.mini-list div:last-child {
  border-bottom: none;
}

.mini-list span {
  color: var(--muted);
}

.mini-list strong {
  color: var(--dark);
}

.features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin-top: 20px;
}

.feature-box {
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 28px 24px;
  box-shadow: 0 20px 36px rgba(17, 33, 61, 0.05);
}

.icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(29, 78, 216, 0.08);
  font-size: 1.5rem;
  margin-bottom: 18px;
}

.feature-box h3 {
  color: var(--dark);
  margin-bottom: 10px;
}

.feature-box p {
  color: var(--muted);
  line-height: 1.7;
}

.rooms-section {
  margin-top: 50px;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  color: var(--dark);
  font-size: clamp(2rem, 3vw, 3rem);
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.room-card {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: 0 20px 36px rgba(17, 33, 61, 0.06);
}

.room-visual {
  height: 220px;
  background-size: cover;
  background-position: center;
}

.visual-one {
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.5), rgba(16, 185, 129, 0.4)), url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80') center/cover no-repeat;
}

.visual-two {
  background: linear-gradient(135deg, rgba(17, 33, 61, 0.4), rgba(29, 78, 216, 0.35)), url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80') center/cover no-repeat;
}

.visual-three {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(17, 33, 61, 0.4)), url('https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80') center/cover no-repeat;
}

.room-content {
  padding: 20px 20px 22px;
}

.room-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
}

.room-top h3 {
  color: var(--dark);
  font-size: 1.3rem;
}

.room-top span {
  color: var(--primary);
  font-weight: 700;
}

.room-content p {
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 12px;
}

.room-content ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
}

.room-content li {
  padding: 7px 10px;
  background: rgba(29, 78, 216, 0.06);
  border-radius: 999px;
  color: var(--dark);
  font-size: 0.8rem;
  font-weight: 600;
}

.booking-section {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 26px;
  margin-top: 44px;
}

.card-panel {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--border);
  border-radius: 28px;
  box-shadow: 0 22px 44px rgba(17, 33, 61, 0.05);
  padding: 28px 24px;
}

.section-head {
  margin-bottom: 22px;
}

.section-head h2 {
  color: var(--dark);
  font-size: clamp(1.7rem, 2vw, 2.4rem);
  line-height: 1.2;
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
  border: 1px solid rgba(17, 33, 61, 0.12);
  background: #f9fbff;
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 1rem;
  color: var(--dark);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: rgba(29, 78, 216, 0.5);
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.08);
}

.block-btn {
  width: 100%;
}

.alert-success {
  margin-top: 18px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #0f766e;
  border-radius: 14px;
  padding: 14px 16px;
  font-weight: 600;
}

.payment-box {
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.06), rgba(16, 185, 129, 0.02));
  border: 1px solid rgba(16, 185, 129, 0.14);
  border-radius: 22px;
  padding: 24px 20px;
}

.meta-label {
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 6px;
}

.payment-box h3 {
  font-size: 1.8rem;
  color: var(--dark);
  margin-bottom: 18px;
}

.hidden {
  display: none;
}

.footer {
  text-align: center;
  color: var(--muted);
  padding: 20px 12px 38px;
}

@media (max-width: 900px) {
  .topbar {
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero,
  .booking-section,
  .features,
  .room-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 540px) {
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
}
