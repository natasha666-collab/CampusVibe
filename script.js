// ==========================================
// 1. MOBILE MENU (Basic click listener)
// ==========================================
var menuBtn = document.querySelector('.menu-toggle');
var navMenu = document.querySelector('.nav');

// Only run if the menu button actually exists on this page
if (menuBtn !== null && navMenu !== null) {
    menuBtn.addEventListener('click', function() {
        // Toggles the 'open' CSS class on and off
        navMenu.classList.toggle('open');
    });
}

// ==========================================
// 2. FORM VALIDATION (Basic conditionals)
// ==========================================
var regForm = document.getElementById('regForm');

if (regForm !== null) {
    regForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stops the page from refreshing

        var nameInput = document.getElementById('name').value;
        var emailInput = document.getElementById('email').value;
        var msgBox = document.getElementById('msg');

        // Check if fields are empty
        if (nameInput === "" || emailInput === "") {
            msgBox.textContent = "Please fill in all the required fields.";
            msgBox.className = "err"; // Applies red error CSS
        } else {
            msgBox.textContent = "Thank you, " + nameInput + "! Registration successful.";
            msgBox.className = "ok";  // Applies green success CSS
        }
    });
}

// ==========================================
// 3. ARTIST POLL (Variables, Math, and UI Updates)
// ==========================================
// Setup starting variables
var votesSautiSol = 0;
var votesNyashinski = 0;
var votesBien = 0;
var votesBensoul = 0;
var totalVotes = 0;
var hasVoted = false;

// Get all the vote buttons on the page
var pollButtons = document.querySelectorAll('[data-artist]');

// Loop through every button and attach a click listener
for (var i = 0; i < pollButtons.length; i++) {
    pollButtons[i].addEventListener('click', function(event) {
        
        // 1. Check if they already voted
        if (hasVoted === true) {
            alert("You have already voted!");
            return; // Stops the function immediately
        }

        // 2. Figure out which artist they clicked
        var clickedButton = event.target;
        var artistName = clickedButton.getAttribute('data-artist');

        // 3. Add 1 to the correct artist's variable
        if (artistName === "Sauti Sol") {
            votesSautiSol = votesSautiSol + 1;
        } else if (artistName === "Nyashinski") {
            votesNyashinski = votesNyashinski + 1;
        } else if (artistName === "Bien") {
            votesBien = votesBien + 1;
        } else if (artistName === "Bensoul") {
            votesBensoul = votesBensoul + 1;
        }

        // 4. Update the total and lock the poll
        totalVotes = totalVotes + 1;
        hasVoted = true;

        // 5. Trigger the visual update
        updatePollVisuals();
    });
}

// Function to update the HTML text and CSS widths
function updatePollVisuals() {
    // Update the text numbers on the screen
    document.querySelector('[data-count="Sauti Sol"]').textContent = votesSautiSol;
    document.querySelector('[data-count="Nyashinski"]').textContent = votesNyashinski;
    document.querySelector('[data-count="Bien"]').textContent = votesBien;
    document.querySelector('[data-count="Bensoul"]').textContent = votesBensoul;

    // Calculate percentages using basic math: (Part / Whole) * 100
    if (totalVotes > 0) {
        var percentSauti = Math.round((votesSautiSol / totalVotes) * 100);
        var percentNyash = Math.round((votesNyashinski / totalVotes) * 100);
        var percentBien = Math.round((votesBien / totalVotes) * 100);
        var percentBensoul = Math.round((votesBensoul / totalVotes) * 100);

        // Update the CSS width of the progress bars
        document.querySelector('[data-bar="Sauti Sol"]').style.width = percentSauti + "%";
        document.querySelector('[data-bar="Nyashinski"]').style.width = percentNyash + "%";
        document.querySelector('[data-bar="Bien"]').style.width = percentBien + "%";
        document.querySelector('[data-bar="Bensoul"]').style.width = percentBensoul + "%";
    }

    // Update the total message
    document.getElementById("pollTotal").textContent = totalVotes + " votes so far";
}

// ==========================================
// 4. COUNTDOWN TIMER (Basic Date Math)
// ==========================================
var countdownBox = document.getElementById('countdown');

if (countdownBox !== null) {
    // Set the target date in milliseconds
    var targetDate = new Date("2026-12-05T18:00:00").getTime();

    // Run this block of code every 1000 milliseconds (1 second)
    setInterval(function() {
        var rightNow = new Date().getTime();
        var timeRemaining = targetDate - rightNow;

        if (timeRemaining > 0) {
            // Convert milliseconds to total seconds
            var totalSeconds = Math.floor(timeRemaining / 1000);

            // Basic math to extract days, hours, minutes, and seconds
            var days = Math.floor(totalSeconds / (60 * 60 * 24));
            var hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
            var minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            var seconds = Math.floor(totalSeconds % 60);

            // Output the numbers to the HTML
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;
        }
    }, 1000);
}
