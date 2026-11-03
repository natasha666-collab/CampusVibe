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
