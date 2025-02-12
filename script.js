// script.js

// Game variables
let player = null;
let playerHealth = 100;
let playerDamage = 0;
let playerDefence = 0;
let playerLevel = 1;
let playerGold = 10;
let currentEnemyHealth = null;
let currentEnemyType = "";
let playerInventory = [];
let currentLoreIndex = 0; 

// Attacks for each character
const attacks = {
    Vin: ["Steel Swipe", "Iron Blast", "Copper Charm", "Atium Shadow", "Tin Enhancements", "Mistborn Assault"],
    Kaladin: ["Wind Slash", "Storm Slam", "Shield Bash", "Protective Shield", "Cleansing Storm", "Syl's Embrace", "Radiant Destruction"],
    Szeth: ["Honorblade Strike", "Windrunner's Fury", "Fury of the Honorblade", "Skybreaker's Visage", "Transcendent Blade", "Gift of the Stormfather"],
    Dalinar: ["Bondsmith's Wield", "Armored Charge", "Forging Strength", "Call of the Thrill", "Unyielding Resolve", "Blackthorn's Wrath"],
    Adonalsium: ["Reality Shatter"] 
};

// Unique Abilities
const specialAbilities = {
    Vin: [
        { name: "Pewter Flame", description: "Flare Pewter and run into a nearby building, waiting for a chance to strike.", healAmount: 30, bonusDamage: 10, unlockedAtLevel: 1 },
        { name: "Allomantic Burst", description: "Unleash a powerful Allomantic energy burst.", bonusDamage: 20, unlockedAtLevel: 3 },
        { name: "Atium Rush", description: "Burn the powerful metal, Atium, making yourself invincible for a time.", bonusDamage: 30, unlockedAtLevel: 5 },
        { name: "Supersonic Launch", description: "Burn Steel and Duralumin, then immediately flare Pewter, launching yourself at your opponent at incredible speeds.", bonusDamage: 50, unlockedAtLevel: 8 },
        { name: "God Metal Stab", description: "Stab your opponent with a dagger made of Raysium, the God Metal of Odium, dealing massive damage.", bonusDamage: 75, unlockedAtLevel: 10 }
    ],
    Kaladin: [
        { name: "Wave of Stormlight", description: "Generate a wave of Stormlight that damages and pushes back enemies.", healAmount: 30, bonusDamage: 10, unlockedAtLevel: 1 },
        { name: "Syl's Whirlwind", description: "Channel Syl to create a powerful whirlwind that deals extra damage.", bonusDamage: 25, unlockedAtLevel: 3 },
        { name: "Windrunner Flight", description: "Fly into the air, then come crashing back down, hitting your opponent at speeds near Mach 3.", bonusDamage: 30, unlockedAtLevel: 5 },
        { name: "Bridge Four", description: "Call for Bridge Four, bringing in an influx of troops, dealing tons of damage and leaving no opportunity to escape.", bonusDamage: 50, unlockedAtLevel: 8 },
        { name: "Sylspear Strike", description: "Call in Syl as a Shardspear, then drive it through your opponent, almost always instantly killing them.", bonusDamage: 75, unlockedAtLevel: 10 }
    ],
    Szeth: [
        { name: "Skybreaking", description: "Perform a small Skybreaking as you fly past your opponent, leaving a trail of flames behind you, and giving you time to recover.", healAmount: 30, bonusDamage: 10, unlockedAtLevel: 1 },
        { name: "Voidlight Convergence", description: "Converge the powers of the Voidlight to strike with devastating force.", bonusDamage: 25, unlockedAtLevel: 3 }
    ],
    Dalinar: [
        { name: "Bondsmith's Resolve", description: "Rally your strength to heal and bolster defenses.", healAmount: 20, unlockedAtLevel: 1 },
        { name: "Unyielding Charge", description: "Unleash a powerful charge that trampling foes with might.", bonusDamage: 25, unlockedAtLevel: 3 }
    ],
    Adonalsium: [ 
        { name: "Creation", description: "Unleash the power of creation to obliterate foes.", bonusDamage: 100, unlockedAtLevel: 1 } 
    ]
};

// Save/Load system
const saveGame = () => {
    const gameData = {
        player,
        playerHealth,
        playerDamage,
        playerDefence,
        playerLevel,
        playerGold,
        playerInventory,
        currentLoreIndex
    };
    localStorage.setItem('savedGame', JSON.stringify(gameData));
    updateGameOutput("Game saved successfully!");
};

const loadGame = () => {
    const savedData = JSON.parse(localStorage.getItem('savedGame'));
    if (savedData) {
        Object.assign(window, savedData);
        updateGameOutput("Game loaded successfully!");
        updateDisplay();
    } else {
        updateGameOutput("No saved game found.");
    }
};

// Helper function to update game output
const updateGameOutput = (message) => {
    document.getElementById("gameOutput").innerText = message;
};

// Update health bars
const updateHealthBars = () => {
    const playerHealthPercentage = (playerHealth / 100) * 100;
    document.getElementById('playerHealthSpan').style.width = `${playerHealthPercentage}%`;

    if (currentEnemyHealth) {
        const enemyHealthPercentage = (currentEnemyHealth / 100) * 100;
        document.getElementById('enemyHealthSpan').style.width = `${enemyHealthPercentage}%`;
    }
};

// Check if the special ability is unlocked based on the player's level
const isSpecialAbilityUnlocked = (ability) => {
    return playerLevel >= ability.unlockedAtLevel;
};

// Update display after loading game
const updateDisplay = () => {
    updateGameOutput(`Welcome back, ${player}! Your health: ${playerHealth}, Level: ${playerLevel}`);
    exploreButton.disabled = false;
    locationSelection.style.display = "none";
    postBattleChoices.style.display = "none"; 
    inventoryButton.disabled = false;
    updateHealthBars();
};

// Update the location buttons based on the selected character
const updateLocationButtons = () => {
    const isRosharan = ["Dalinar", "Kaladin", "Szeth"].includes(player);
    const isVin = player === "Vin";

    document.getElementById("luthadelButton").style.display = isRosharan ? "none" : "block";
    document.getElementById("elendelButton").style.display = isRosharan ? "none" : "block";
    document.getElementById("scadrialButton").style.display = isRosharan ? "none" : "block";
    document.getElementById("rithmatistButton").style.display = isRosharan ? "none" : "block";         
    document.getElementById("urithiruButton").style.display = isVin ? "none" : "block";
    document.getElementById("kholinarButton").style.display = isVin ? "none" : "block";
    document.getElementById("stormlandsButton").style.display = isVin ? "none" : "block";
    document.getElementById("thaylenCityButton").style.display = isVin ? "none" : "block";
    document.getElementById("alethkarButton").style.display = isVin ? "none" : "block";
};

// Character Selection
const selectCharacter = () => {
    const character = prompt("Choose your character: Vin (Mistborn), Kaladin (Windrunner), Szeth (Assassin in White), Dalinar (Bondsmith).\nType 'cheats' for special character.").trim();
    if (character.toLowerCase() === "cheats") {
        cheatsButton.style.display = "block"; // Show Cheats button
        updateGameOutput("Cheats option available! Select 'Cheats' to play as Adonalsium.");
    } else if (["Vin", "Kaladin", "Szeth", "Dalinar"].includes(character)) {
        initializePlayer(character);
    } else {
        updateGameOutput("Invalid character selection.");
    }
};

// Initialize player
const initializePlayer = (character) => {
    player = character;
    playerDamage = character === "Vin" ? 15 : character === "Kaladin" ? 18 : character === "Szeth" ? 15 : 18;
    playerDefence = character === "Vin" ? 5 : character === "Kaladin" ? 6 : character === "Szeth" ? 4 : 5;

    // Enable other buttons after character selection
    exploreButton.disabled = false;
    loadGameButton.disabled = false;
    saveGameButton.disabled = false;
    inventoryButton.disabled = false;

    updateGameOutput(`You have chosen ${player}. Ready for adventure!`);
    cheatsButton.style.display = "none"; // Hide Cheats button

    updateLocationButtons();
};

// Cheats functionality
const cheatsSelect = () => {
    updateGameOutput("You have chosen Adonalsium! Ready for adventure!");
    player = "Adonalsium";
    playerDamage = 50; 
    playerDefence = 10; 
    playerHealth = 200; // Higher health for the cheat character
    playerLevel = 10; // Max level for the cheat character

    exploreButton.disabled = false;
    loadGameButton.disabled = false;
    saveGameButton.disabled = false;
    inventoryButton.disabled = false;

    updateLocationButtons();
};

// Explore button functionality
const exploreLocation = () => {
    updateGameOutput("Select a location to explore.");
    locationSelection.style.display = "block";
};

// Start battle
const startBattle = (location) => {
    const enemyNames = Object.keys(enemies[location]);
    const enemyName = enemyNames[Math.floor(Math.random() * enemyNames.length)];
    currentEnemyHealth = enemies[location][enemyName].health;
    currentEnemyType = enemyName;

    updateGameOutput(`You have entered ${location}. Prepare for battle against ${currentEnemyType}!`);

    document.getElementById('healthBars').style.display = 'flex';
    updateHealthBars();

    // 50% chance to encounter an NPC if the player is not Adonalsium
    if (Math.random() < 0.5 && player !== "Adonalsium") {
        encounterNPC();
    } else {
        postBattleChoices.style.display = "block"; 
    }
};

// Encounter an NPC
const encounterNPC = () => {
    npcInteraction.style.display = "block";
    const npcNamesVin = ["Breeze", "Ham", "Dockson", "Clubs"];
    const npcNamesRoshar = ["Navani", "Lift", "Renarin", "The Sibling"];
    const npcList = player === "Vin" ? npcNamesVin : npcNamesRoshar;
    const npcName = npcList[Math.floor(Math.random() * npcList.length)];
    updateGameOutput(`You encounter ${npcName}!`);
};

// Enemy turn logic
const enemyTurn = () => {
    const enemyDamage = Math.floor(Math.random() * (15 - 10 + 1)) + 10; 
    playerHealth -= enemyDamage;
    updateGameOutput(`${currentEnemyType} counterattacked you for ${enemyDamage} damage. Your health is now ${playerHealth}.`);
    updateHealthBars(); 
    if (playerHealth <= 0) {
        endGame("You have been defeated by " + currentEnemyType + "... Game over.");
    }
};

// Main Event listeners
characterSelectionButton.addEventListener("click", selectCharacter);
cheatsButton.addEventListener("click", cheatsSelect);
exploreButton.addEventListener("click", exploreLocation);
loadGameButton.addEventListener("click", loadGame);
saveGameButton.addEventListener("click", saveGame);

// Initialize the game
const initGame = () => {
    updateGameOutput("Welcome to your adventure! Select a character to begin.");
};
initGame();
