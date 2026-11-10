// script.js is shared by EVERY page. Each block first checks that its elements exist,
// so a block only runs on the page that has it (otherwise one missing element would crash the rest).
const $ = id => document.getElementById(id); // shortcut for document.getElementById

// ===== MOBILE MENU (all pages) =====
// The ☰ button toggles the .open class, which CSS uses to show the menu on phones.
const menuBtn = document.querySelector('.menu-toggle');
const navEl = document.querySelector('.nav');
if (menuBtn && navEl) {
  menuBtn.addEventListener('click', () => {
    const open = navEl.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open); // tells screen readers if the menu is open
  });
}

// ===== EVENT FILTER TABS =====
// Each tab has data-filter; each card has data-cat. Clicking a tab shows only matching cards.
const tabs = document.querySelectorAll('.tab');
const eventCards = document.querySelectorAll('.event');
if (tabs.length) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      let shown = 0;
      eventCards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.hidden = !match;
        if (match) shown++;
      });
      if ($('noEvents')) $('noEvents').hidden = shown > 0;
    });
  });
}

// ===== "GET TICKET" BUTTONS =====
// Pre-selects the ticket type in the form, then scrolls down to it.
const typeSelect = $('type');
if (typeSelect) {
  document.querySelectorAll('[data-ticket]').forEach(btn => {
    btn.addEventListener('click', () => {
      for (const opt of typeSelect.options) {
        if (opt.text.startsWith(btn.dataset.ticket)) typeSelect.value = opt.text;
      }
      $('register').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ===== REGISTRATION FORM VALIDATION =====
const regForm = $('regForm');
if (regForm) {
  const msg = $('msg');
  regForm.addEventListener('submit', e => {
    e.preventDefault();                               // stop the page reloading
    const name = $('name').value.trim();              // trim removes extra spaces
    const email = $('email').value.trim();
    const ticket = typeSelect.value;
    const pay = $('pay').value;
    msg.className = '';
    if (!name || !email || !ticket || !pay) {
      msg.textContent = 'Please fill in all the required fields.';
      msg.className = 'err';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // regex: text@text.text
      msg.textContent = 'Please enter a valid email address.';
      msg.className = 'err';
      return;
    }
    msg.textContent = 'Thank you, ' + name + '! Your registration for ' + ticket + ' has been received.';
    msg.className = 'ok';
    regForm.reset();
  });
}

// ===== MIC CHECK COUNTDOWN =====
// The event date is written ONCE, in the HTML: <div id="countdown" data-date="2026-12-05T18:00:00">.
// Format: YYYY-MM-DDTHH:MM:SS (24-hour, local time). Change it there and the countdown follows.
if ($('countdown')) {
  const EVENT_DATE = new Date($('countdown').dataset.date || '2026-12-05T18:00:00');
  let timerId;                                        // declared first so the timer can be stopped safely
  const pad = n => String(n).padStart(2, '0');        // 8 -> "08"
  function updateCountdown() {
    const diff = EVENT_DATE - new Date();            // milliseconds left
    if (diff <= 0) {                                 // started: stop and show the message
      clearInterval(timerId);
      $('countdown').hidden = true;
      $('started').hidden = false;
      return;
    }
    const total = Math.floor(diff / 1000);           // total seconds left
    $('days').textContent = pad(Math.floor(total / 86400));      // 86400 seconds in a day
    $('hours').textContent = pad(Math.floor(total / 3600) % 24); // % 24 keeps hours 0-23
    $('minutes').textContent = pad(Math.floor(total / 60) % 60);
    $('seconds').textContent = pad(total % 60);
  }
  updateCountdown();                                 // run once now so it doesn't start at 00
  timerId = setInterval(updateCountdown, 1000);      // then repeat every second
}

// ===== ARTIST POLL =====
// Buttons have data-artist; counts have data-count; bars have data-bar (all optional except buttons).
// Votes are saved in localStorage so they survive a refresh, and one vote is allowed per browser.
// NOTE: localStorage is private to each visitor's browser. A real shared poll needs a backend/database.
const pollButtons = document.querySelectorAll('[data-artist]');
if (pollButtons.length) {
  const artists = [...pollButtons].map(b => b.dataset.artist);
  let votes = {};
  let hasVoted = false;
  try {                                               // try/catch: storage can be blocked by the browser
    votes = JSON.parse(localStorage.getItem('cvVotes')) || {};
    hasVoted = localStorage.getItem('cvVoted') === '1';
  } catch (err) { votes = {}; }
  artists.forEach(a => { if (typeof votes[a] !== 'number') votes[a] = 0; }); // start any new artist at 0

  function renderPoll() {
    const total = artists.reduce((sum, a) => sum + votes[a], 0);
    artists.forEach(a => {
      const count = document.querySelector('[data-count="' + a + '"]');
      const bar = document.querySelector('[data-bar="' + a + '"]');
      if (count) count.textContent = votes[a];
      if (bar) bar.style.width = (total ? Math.round(votes[a] / total * 100) : 0) + '%'; // share of all votes
    });
    if ($('pollTotal')) $('pollTotal').textContent = total + (total === 1 ? ' vote' : ' votes') + ' so far';
    pollButtons.forEach(b => { b.disabled = hasVoted; });  // lock buttons after voting
    if ($('pollMsg')) $('pollMsg').textContent = hasVoted ? 'Thanks for voting! Your vote has been counted.' : '';
  }

  pollButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasVoted) return;
      votes[btn.dataset.artist]++;                    // add one vote
      hasVoted = true;
      try {
        localStorage.setItem('cvVotes', JSON.stringify(votes));
        localStorage.setItem('cvVoted', '1');
      } catch (err) { /* ignore: voting still works for this visit */ }
      renderPoll();
    });
  });
  renderPoll();                                       // show saved counts on page load
}

// ===== EVENT "VIEW DETAILS" BUTTONS =====
// Each button points (aria-controls) at its own hidden panel; clicking shows or hides it.
document.querySelectorAll('.details-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = $(btn.getAttribute('aria-controls'));
    const opening = panel.hidden;
    panel.hidden = !opening;
    btn.setAttribute('aria-expanded', opening);
    btn.textContent = opening ? 'Hide Details' : 'View Details \u2192';
  });
});

// ===== FOOTER NEWSLETTER =====
const newsForm = $('newsletterForm');
if (newsForm) {
  newsForm.addEventListener('submit', e => {
    e.preventDefault();
    $('newsMsg').textContent = 'Thanks for subscribing!';
    newsForm.reset();
  });
}
