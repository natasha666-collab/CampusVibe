var sautiVotes = 0;
var nyashinskiVotes = 0;

function voteSauti() {
    sautiVotes = sautiVotes + 1;
    document.getElementById("sauti-count").innerText = sautiVotes;
}

function voteNyash() {
    nyashinskiVotes = nyashinskiVotes + 1;
    document.getElementById("nyash-count").innerText = nyashinskiVotes;
}


// Mic Check Live countdown
// Format: YYYY-MM-DDTHH:MM:SS (24-hour time, local time)
const EVENT_DATE = new Date("2026-12-05T18:00:00");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const countdownEl = document.getElementById("countdown");
const messageEl = document.getElementById("countdown-message");

// Turns 8 into "08" so the display stays two digits wide
function pad(number) {
  return String(number).padStart(2, "0");
}

let timerId; // declared up front so updateCountdown can stop it safely

function updateCountdown() {
  const now = new Date();
  const diff = EVENT_DATE - now; // milliseconds remaining

  // Event has started: stop the timer and show the message (no negative numbers)
  if (diff <= 0) {
    clearInterval(timerId);
    countdownEl.hidden = true;
    messageEl.hidden = false;
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor(totalSeconds / (60 * 60)) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

// Run once immediately so the page doesn't show 00s for the first second, then every second
updateCountdown();
timerId = setInterval(updateCountdown, 1000);
