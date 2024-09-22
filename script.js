let flippedCards = []; // Track flipped cards
let matchedPairs = 0; // Track matched pairs
const totalPairs = 8; // Total number of pairs (since you have 16 cards in total)
let score = 0; // Track score

function startGame() {
    // remove the start game menu
    document.getElementById("startMenu").style.display = "none";

    // display the header
    document.getElementById("header").style.display = "flex";

    // generate the card pairs
    const cardPairs = generateCardPairs();

    // Create an array of all card IDs
    let cardIDs = [];
    for (let cardID in cardPairs) {
        cardIDs.push(cardID);
    }

    // Shuffle the card IDs
    shuffle(cardIDs);

    // Display shuffled cards in the grid
    for (let i = 0; i < cardIDs.length; i++) {
        const cardID = cardIDs[i];

        // Create the card div
        let cardContainer = document.createElement("div"); // Container to hold the front and back
        let card = document.createElement("div");
        card.classList.add("card");
        card.id = cardID;

        // Create the front and back faces of the card
        let front = document.createElement("div");
        front.classList.add("front");
        let back = document.createElement("div");
        back.classList.add("back");
        back.textContent = "Back";  // Text for the back of the card

        // Get the card data
        const cardData = cardPairs[cardID];
        if (cardData) {
            front.style.backgroundColor = cardData.backgroundColor;
            front.style.color = cardData.textColor;
            front.textContent = cardData.displayedText;  // Set the text to display the color name
        }

        // Append front and back to the card
        card.appendChild(front);
        card.appendChild(back);

        // Add event listener for flipping the card
        card.addEventListener("click", function() {
            handleCardFlip(card, cardPairs);
        });

        // Append the card to the container and then to the grid
        cardContainer.appendChild(card);
        document.getElementById("grid").appendChild(cardContainer);
    }
}

function generateCardPairs() {
    // Extended list of possible colors
    const colors = [
        "red", "green", "blue", "yellow", "magenta", "black", "orange", "purple",
        "cyan", "lime", "pink", "brown", "gray", "violet", "indigo", "teal"
    ];

    const pairs = {};

    // Helper function to generate a random color
    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Copy the colors array to use as the pool of unique color names
    let availableColorNames = [...colors];

    for (let i = 0; i < 8; i++) {
        // Generate a random background color and text color for each pair
        let backgroundColor = getRandomColor();
        let textColor = getRandomColor();

        // Ensure background color and text color are different
        while (backgroundColor === textColor) {
            textColor = getRandomColor();
        }

        // Select a unique color name for this pair from the available pool
        let displayedTextIndex = Math.floor(Math.random() * availableColorNames.length);
        let displayedText = availableColorNames[displayedTextIndex];

        // Remove the used color name from the pool to ensure uniqueness
        availableColorNames.splice(displayedTextIndex, 1);

        // Create a unique ID for each card (for example, 'card1' and 'card1_match')
        let card1ID = "card" + (i + 1);
        let card2ID = "card" + (i + 1) + "_match";

        // Store the pair of cards in the dictionary
        pairs[card1ID] = { 
            backgroundColor: backgroundColor, 
            textColor: textColor, 
            displayedText: displayedText 
        };

        pairs[card2ID] = { 
            backgroundColor: textColor, 
            textColor: backgroundColor, 
            displayedText: displayedText 
        };
    }

    return pairs;
}

// Function to handle the card flip
function handleCardFlip(card, cardPairs) {
    // If the card is already flipped or more than 2 cards are flipped, don't allow more flips
    if (card.classList.contains("flipped") || flippedCards.length === 2) {
        return;
    }

    // Flip the card
    card.classList.add("flipped");
    flippedCards.push(card);

    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        setTimeout(() => {
            checkForMatch(cardPairs);
        }, 1000); // Delay to allow user to see the second card
    }
}

// Function to check if the two flipped cards match
// Function to check if the two flipped cards match
function checkForMatch(cardPairs) {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    const card1Data = cardPairs[card1.id];
    const card2Data = cardPairs[card2.id];

    // Check if the cards match
    if (card1Data.displayedText === card2Data.displayedText) {
        // Cards match, add matched class and increase the matched pairs count
        card1.classList.add("matched");
        card2.classList.add("matched");

        matchedPairs++;
        flippedCards = [];

        // Check if all pairs have been matched
        if (matchedPairs === totalPairs) {
            setTimeout(() => {
                handleWin();  // Call win handler after 1 second
            }, 1000);
        }
    } else {
        // Cards don't match, flip them back
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
    }
}

// Function to handle win condition
function handleWin() {
    // Clear the grid
    const grid = document.getElementById("grid");
    grid.innerHTML = "";  // Remove all the cards

    // Reset game variables
    matchedPairs = 0;

    // Wait 1 second and restart the game
    setTimeout(() => {
        startGame();  // Restart the game
    }, 1000);
}

// Fisher-Yates Shuffle Algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}