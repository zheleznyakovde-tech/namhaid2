// =============================================
//  Симферополь — Городской портал
//  main.js
// =============================================

// ---- Clock ----
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) +
    ' · ' + now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}
updateClock();
setInterval(updateClock, 1000);

// ---- Sticky header shadow ----
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ---- Burger / Mobile menu ----
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- Active nav on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === entry.target.id);
      });
    }
  });
}, { threshold: 0.35, rootMargin: '-60px 0px -60px 0px' });

sections.forEach(s => observer.observe(s));

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Docs tabs ----
const tabs = document.querySelectorAll('.docs-tab');
const docsContent = document.getElementById('docsContent');

const docsData = {
  normative: [
    { title: 'Устав муниципального образования городской округ Симферополь', meta: 'PDF · 2.4 МБ · Обновлено 10.01.2026' },
    { title: 'Генеральный план города Симферополя до 2035 года', meta: 'PDF · 18.7 МБ · Обновлено 05.02.2026' },
    { title: 'Правила землепользования и застройки', meta: 'PDF · 5.1 МБ · Обновлено 20.02.2026' },
    { title: 'Порядок проведения публичных слушаний', meta: 'PDF · 1.2 МБ · Обновлено 11.03.2026' },
    { title: 'Регламент работы администрации города', meta: 'PDF · 890 КБ · Обновлено 01.01.2026' },
  ],
  budget: [
    { title: 'Решение горсовета № 123 «О бюджете на 2026 год»', meta: 'PDF · 3.8 МБ · Обновлено 15.12.2025' },
    { title: 'Отчёт об исполнении бюджета за 2025 год', meta: 'PDF · 6.2 МБ · Обновлено 01.03.2026' },
    { title: 'Проект бюджета на 2027 год (проект)', meta: 'PDF · 4.1 МБ · Обновлено 10.03.2026' },
    { title: 'Муниципальный долг — справочная информация', meta: 'PDF · 0.8 МБ · Обновлено 01.02.2026' },
  ],
  plans: [
    { title: 'Муниципальная программа «Комфортная городская среда 2024-2026»', meta: 'PDF · 1.9 МБ · Обновлено 30.01.2026' },
    { title: 'Программа развития транспортной инфраструктуры', meta: 'PDF · 3.3 МБ · Обновлено 15.01.2026' },
    { title: 'Программа «Безопасный город» 2025-2030', meta: 'PDF · 2.1 МБ · Обновлено 20.01.2026' },
    { title: 'Стратегия социально-экономического развития до 2030', meta: 'PDF · 7.5 МБ · Обновлено 01.12.2025' },
  ],
  reports: [
    { title: 'Отчёт главы администрации за 2025 год', meta: 'PDF · 5.8 МБ · Обновлено 01.03.2026' },
    { title: 'Статистический ежегодник г. Симферополя 2025', meta: 'PDF · 12.4 МБ · Обновлено 28.02.2026' },
    { title: 'Отчёт о реализации муниципальных программ 2025', meta: 'PDF · 4.7 МБ · Обновлено 15.02.2026' },
  ]
};

function renderDocs(tabKey) {
  const items = docsData[tabKey] || docsData.normative;
  docsContent.innerHTML = items.map(doc => `
    <a href="#" class="doc-item">
      <div class="doc-item__icon">📄</div>
      <div class="doc-item__info">
        <h4 class="doc-item__title">${doc.title}</h4>
        <div class="doc-item__meta">${doc.meta}</div>
      </div>
      <div class="doc-item__download">⬇</div>
    </a>
  `).join('');

  // animate
  docsContent.querySelectorAll('.doc-item').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(12px)';
    requestAnimationFrame(() => {
      setTimeout(() => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, i * 60);
    });
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderDocs(tab.dataset.tab);
  });
});

// ---- File drop zone ----
const fileDropzone = document.getElementById('fileDropzone');
const fileInput = document.getElementById('fileInput');

if (fileDropzone && fileInput) {
  fileDropzone.addEventListener('click', () => fileInput.click());
  fileDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropzone.style.borderColor = '#234785';
    fileDropzone.style.background = '#EEF1F7';
  });
  fileDropzone.addEventListener('dragleave', () => {
    fileDropzone.style.borderColor = '';
    fileDropzone.style.background = '';
  });
  fileDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropzone.style.borderColor = '';
    fileDropzone.style.background = '';
    const files = Array.from(e.dataTransfer.files);
    fileDropzone.querySelector('span').textContent = `📎 Прикреплено файлов: ${files.length}`;
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      fileDropzone.querySelector('span').textContent = `📎 Прикреплено файлов: ${fileInput.files.length}`;
    }
  });
}

// ---- Appeal form submit ----
const appealForm = document.getElementById('appealForm');
const toast = document.getElementById('toast');

if (appealForm) {
  appealForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast();
    appealForm.reset();
    if (fileDropzone) fileDropzone.querySelector('span').innerHTML = '📎 Перетащите файлы сюда или <u>выберите</u>';
  });
}

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ---- Animate on scroll (intersection observer) ----
const animateEls = document.querySelectorAll(
  '.service-card, .dept-card, .doc-item, .news-card, .stat-item, .budget-card, .budget-breakdown, .contact-block'
);

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animateEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${(i % 6) * 0.08}s, transform 0.5s ease ${(i % 6) * 0.08}s`;
  animObserver.observe(el);
});

// ---- Stats counter animation ----
const statNums = document.querySelectorAll('.stat-item__num');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent.trim();
      const match = text.match(/^([\d,]+)/);
      if (match) {
        const target = parseInt(match[1].replace(',', ''));
        let current = 0;
        const step = Math.ceil(target / 40);
        const suffix = text.replace(match[1], '');
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current.toLocaleString('ru-RU') + suffix;
          if (current >= target) clearInterval(interval);
        }, 40);
      }
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => countObserver.observe(el));
