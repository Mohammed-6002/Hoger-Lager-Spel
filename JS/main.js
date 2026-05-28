console.log('Main loaded');
// Dit is een debug-uitvoer die laat zien dat het script geladen is.

let playerScore = 0;
let computerScore = 0;
let playerCredits = 0;
let computerCredits = 0;
let currentDiceSum = 0;
let computerDiceSum = 0;
let timer;
let timeLeft = 60;  
let playerChoice = null; 
// Variabelen die de scores, dobbelstenen, tijd en keuze van de speler bijhouden.

// HTML-elementen
const goButton = document.querySelector("#go-button");
const lowerButton = document.querySelector("#lower-button");
const higherButton = document.querySelector("#higher-button");
const diceButton = document.querySelector("#dice-button");
const resultDisplay = document.querySelector("#result-display");
const playerCreditsDisplay = document.querySelector(".player-credits");
const computerCreditsDisplay = document.querySelector('.computer-credits');
const timerDisplay = document.querySelector(".timer-display");

const playerDiceOne = document.querySelector('.player-dice-one');
const playerDiceTwo = document.querySelector('.player-dice-two');
const computerDiceOne = document.querySelector('.computer-dice-one');
const computerDiceTwo = document.querySelector('.computer-dice-two');
// Selecteert de HTML-elementen die we nodig hebben voor de interface en interactie (zoals knoppen, displays voor resultaten, dobbelstenen, etc.).

goButton.addEventListener('click', function() {
    console.log('Go button clicked');
    goButton.remove();  
    document.querySelector(".message-box").remove(); 

    resetGame(); 
    startTimer(); 

    lowerButton.disabled = false;
    higherButton.disabled = false;
    diceButton.disabled = true; 
});
// Event listener voor de "Go" knop. Als deze wordt ingedrukt, wordt het spel gereset en start de timer. De knoppen voor "lower" en "higher" worden ingeschakeld, de "dice" knop wordt uitgeschakeld.

lowerButton.addEventListener('click', function() {
    console.log('Lower button clicked');
    playerChoice = 'lower'; 
    enableDiceButton(); 
});
// Event listener voor de "Lower" knop. Bij klikken wordt de keuze van de speler opgeslagen als 'lower' en wordt de dobbelsteen-knop ingeschakeld.

higherButton.addEventListener('click', function() {
    console.log('Higher button clicked');
    playerChoice = 'higher'; 
    enableDiceButton(); 
});
// Event listener voor de "Higher" knop. Bij klikken wordt de keuze van de speler opgeslagen als 'higher' en wordt de dobbelsteen-knop ingeschakeld.

function enableDiceButton() {
    if (playerChoice) {
        diceButton.disabled = false; 
        lowerButton.disabled = true; 
        higherButton.disabled = true;
    }
}
// Deze functie schakelt de dobbelsteen-knop in en de andere keuzeknoppen uit zodra de speler een keuze heeft gemaakt (hoger of lager).

function rollDiceValue() {
    return Math.floor(Math.random() * 6) + 1; 
}
// Functie die een willekeurig getal tussen 1 en 6 genereert, wat de waarde is van een dobbelsteenworp.

diceButton.addEventListener('click', rollDice);
// Event listener voor de dobbelsteen-knop. Bij klikken wordt de functie `rollDice` aangeroepen om de dobbelstenen te rollen.

function rollDice() {
    currentDiceSum = 0;
    computerDiceSum = 0;

    playerDiceOne.classList.add('roll');
    playerDiceTwo.classList.add('roll');

    setTimeout(() => {
        const playerRoll1 = rollDiceValue();
        const playerRoll2 = rollDiceValue();
        currentDiceSum = playerRoll1 + playerRoll2;
        playerDiceOne.textContent = playerRoll1; 
        playerDiceTwo.textContent = playerRoll2; 

        setTimeout(() => {
            simulateDiceRollForComputer();
        }, 500);

    }, 500);
}
// Functie die de dobbelstenen rolt voor de speler. Het resultaat wordt in de bijbehorende HTML-elementen getoond. Daarna wordt de dobbelsteenworp van de computer gesimuleerd.

function simulateDiceRollForComputer() {
    computerDiceSum = 0;

    computerDiceOne.classList.add('roll');
    computerDiceTwo.classList.add('roll');

    setTimeout(() => {
        const computerRoll1 = rollDiceValue();
        const computerRoll2 = rollDiceValue();
        computerDiceSum = computerRoll1 + computerRoll2;
        computerDiceOne.textContent = computerRoll1; 
        computerDiceTwo.textContent = computerRoll2; 

        checkGuess(playerChoice);
    }, 500); 
}
// Simuleert de dobbelsteenworp voor de computer. Na de dobbelsteenworp wordt de functie `checkGuess` aangeroepen om de uitkomst van de ronde te bepalen.

function checkGuess(playerGuess) {
    console.log("Speler Gok:", playerGuess, "Speler Totaal:", currentDiceSum, "Computer Totaal:", computerDiceSum);

    if (currentDiceSum === computerDiceSum) {
        resultDisplay.textContent = `Gelijkspel! Beide gooiden ${currentDiceSum}. Geen credits voor niemand.`;
    } else if (playerGuess === 'lower' && currentDiceSum < computerDiceSum) {
        playerCredits++;
        resultDisplay.textContent = `Je hebt gewonnen! Totaal: ${currentDiceSum} (lager dan ${computerDiceSum})`;
    } else if (playerGuess === 'higher' && currentDiceSum > computerDiceSum) {
        playerCredits++;
        resultDisplay.textContent = `Je hebt gewonnen! Totaal: ${currentDiceSum} (hoger dan ${computerDiceSum})`;
    } else {
        computerCredits++; 
        resultDisplay.textContent = `Je hebt verloren! Totaal: ${currentDiceSum} (was ${computerDiceSum})`;
    }

    playerCreditsDisplay.textContent = playerCredits;
    computerCreditsDisplay.textContent = computerCredits;

    resetGameForNextRound();
}
// Deze functie controleert of de gok van de speler correct was (hoger of lager dan de computer). Afhankelijk van de uitkomst wordt de score van de speler of de computer aangepast. De scores worden bijgewerkt op het scherm.

function resetGameForNextRound() {
    currentDiceSum = 0;
    computerDiceSum = 0;
    playerChoice = null; 
    lowerButton.disabled = false;
    higherButton.disabled = false;
    diceButton.disabled = true; 
}
// Reset de game voor de volgende ronde, zodat de speler opnieuw kan kiezen en dobbelen.

function startTimer() {
    timerDisplay.textContent = `Tijd over: ${timeLeft} seconden`;
    timer = setInterval(function() {
        timeLeft--;
        timerDisplay.textContent = `Tijd over: ${timeLeft} seconden`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            resultDisplay.textContent += ' Tijd is op!';
            endGame();  
        }
    }, 1000);
}
// Start de timer, die elke seconde afloopt en de tijd op het scherm bijwerkt. Als de tijd op is, wordt de game beëindigd.

function endGame() {
    lowerButton.disabled = true;
    higherButton.disabled = true;
    diceButton.disabled = true;

    resultDisplay.textContent = ''; 
    showWinner(); 

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Herstart het spel';
    restartButton.addEventListener('click', function() {
        location.reload(); 
    });
    document.body.appendChild(restartButton);
}
// Beëindigt het spel als de timer op is. Het toont de winnaar en biedt een knop aan om het spel opnieuw te starten.

function showWinner() {
    if (playerCredits > computerCredits) {
        resultDisplay.textContent = 'Je hebt gewonnen!';
    } else if (playerCredits < computerCredits) {
        resultDisplay.textContent = 'De computer heeft gewonnen!';
    } else {
        resultDisplay.textContent = 'Het is gelijkspel!';
    }
}
// Bepaalt wie de winnaar is op basis van de verzamelde credits en toont het resultaat.

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    playerCredits = 0;
    computerCredits = 0;
    currentDiceSum = 0;
    computerDiceSum = 0;
    timeLeft = 60;
    resultDisplay.textContent = '';
    playerCreditsDisplay.textContent = playerCredits;
    computerCreditsDisplay.textContent = computerCredits;
}
// Reset alle spelvariabelen en toont de begintoestand voor het nieuwe spel.

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered!', reg))
      .catch(err => console.error('Registration failed:', err));
  });
}

