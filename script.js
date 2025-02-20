const board = document.getElementsByClassName("board")[0];

function secretCode() {
  const colors = ["red", "white", "yellow", "green", "blue", "black"];

  const picks = [];
  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * 6);
    picks.push(colors[index]);
  }
  return picks;
}

function randomizeArray(keys) {
  const parent = keys[0].child.parentElement; // Get the parent element of the keys
  const shuffledKeys = [...keys]; // Clone the keys array
  for (let i = shuffledKeys.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1)); // Random index within range
    [shuffledKeys[i], shuffledKeys[randomIndex]] = [
      shuffledKeys[randomIndex],
      shuffledKeys[i],
    ]; // Swap elements
  }

  // Clear the parent and append shuffled keys back
  shuffledKeys.forEach((key) => {
    parent.appendChild(key.child); // Reorder DOM elements
  });
}

function updateKeys(secretColors, selectedColors, keys) {
  const secretMatched = Array(4).fill(false); // Tracks matched colors in the secret code
  const selectedMatched = Array(4).fill(false); // Tracks matched colors in the selected code

  // Handle exact matches (red keys)
  for (let i = 0; i < 4; i++) {
    if (secretColors[i] === selectedColors[i]) {
      secretMatched[i] = true;
      selectedMatched[i] = true;
      keys[i].selected = true;
      keys[i].child.style.background = "red"; // Assign red key
    }
  }

  // Handle partial matches (white keys)
  for (let i = 0; i < 4; i++) {
    if (!selectedMatched[i]) {
      for (let j = 0; j < 4; j++) {
        if (
          !secretMatched[j] && // Not already matched
          selectedColors[i] === secretColors[j]
        ) {
          secretMatched[j] = true;
          keys[i].child.style.background = "white"; // Assign white key
          keys[i].selected = true;
          break;
        }
      }
    }
  }
  // Randomize keypegs
  randomizeArray(keys);
}

// Game Play
let pickedCode; // Current Picked color
let currentpegs = 0; // Current column of choice
let currentEntry = 0; // Current row
let SecretColors = secretCode(); // Target Colors

for (let i = 0; i < 10; i++) {
  const col = document.createElement("div");
  col.className = "column";
  const pegBoard = document.createElement("div");
  pegBoard.className = "peg-board";
  const keyPegs = document.createElement("div");
  keyPegs.className = "key-pegs";
  for (let j = 0; j < 4; j++) {
    const peg = document.createElement("div");
    peg.className = "hole";
    const key = document.createElement("div");
    key.className = "key";

    keyPegs.appendChild(key);
    pegBoard.appendChild(peg);
  }
  col.appendChild(pegBoard);
  col.appendChild(keyPegs);
  board.appendChild(col);
}

const gameBoard = Array.from(document.querySelectorAll(".peg-board")).map(
  (peg) =>
    Array.from(peg.children).map((child) => {
      return { selected: false, child: child };
    })
);

const gameKeys = Array.from(document.querySelectorAll(".key-pegs")).map((key) =>
  Array.from(key.children).map((child) => {
    return { selected: false, child: child };
  })
);

for (let i = 0; i < 10; i++) {
  let selectedColors = Array(4);
  for (let j = 0; j < 4; j++) {
    const hole = gameBoard[i][j];
    hole.child.addEventListener("click", (event) => {
      if (!hole.selected && pickedCode != undefined && currentpegs == i) {
        hole.selected = true;
        event.target.style.background = pickedCode;
        currentEntry += 1;
        selectedColors[j] = pickedCode;
      } else if (hole.selected && pickedCode != undefined && currentpegs == i) {
        hole.selected = true;
        event.target.style.background = pickedCode;
        selectedColors[j] = pickedCode;
      }
      if (currentEntry == 4 && currentpegs < 10) {
        updateKeys(SecretColors, selectedColors, gameKeys[i]);
        currentEntry = 0;
        if (
          !SecretColors.every((value, index) => value === selectedColors[index])
        ) {
          currentpegs += 1;
          selectedColors = Array(4);
        }
      }
      pickedCode = undefined;
    });
  }
}

const colors = document.querySelectorAll(".code-colors");

// Add event listener to each color
for (let i = 0; i < colors.length; i++) {
  colors[i].addEventListener("click", (event) => {
    pickedCode = event.target.id;
  });
}
//TODO: write a program that plays mastermind
