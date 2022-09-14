import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const numberOfBoxes = await rl.question(
  "With how many boxes do you want to play? "
);

const challenge = {
  boxes: getBoxes(numberOfBoxes),
  maskedBoxes: getMaskedBoxes(numberOfBoxes),
  probability: 1 / numberOfBoxes,
};

showProbability();

console.log(challenge.maskedBoxes);
// console.log(challenge.boxes);

const firstGuess = await rl.question("\nin which box is the Apple Watch? ");

showAnEmptyBox(challenge, firstGuess);

const secondGuess = await rl.question(
  "\nsecond chance: in which box is the Apple Watch? "
);

if (firstGuess != secondGuess) {
  challenge.probability = 2 / numberOfBoxes;
}

showProbability();

endGame(challenge, secondGuess);

rl.close();

function getBoxes(numberOfBoxes) {
  let boxes = Array(numberOfBoxes - 1).fill("📦");
  boxes.push("⌚️");
  return shuffleBoxes(boxes);
}

function shuffleBoxes(boxes) {
  return boxes
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function getMaskedBoxes(numberOfBoxes) {
  let maskedBoxes = Array(Number(numberOfBoxes)).fill("📦");
  return maskedBoxes;
}

function showAnEmptyBox(challenge, guess) {
  let boxToShow = null;

  challenge.maskedBoxes[guess - 1] = "❔";

  while (
    boxToShow === null ||
    boxToShow === challenge.boxes.indexOf("⌚️") ||
    boxToShow === guess - 1
  ) {
    boxToShow = Math.floor(Math.random() * challenge.boxes.length);
  }

  challenge.boxes[boxToShow] = "❌";
  challenge.maskedBoxes[boxToShow] = "❌";

  console.log(
    "\nHey look, I'm sure that what you are looking for is not on this ❌.\n"
  );

  console.log(challenge.maskedBoxes);
  // console.log(challenge.boxes);
}

function endGame(challenge, secondGuess) {
  if (challenge.boxes.indexOf("⌚️") === secondGuess - 1) {
    console.log(
      "You found the Apple Watch! Congratulations!!!\n"
    );
  } else if (challenge.boxes.indexOf("❌") === secondGuess - 1) {
    console.log(
      "Well, that's not only bad luck my friend...\n"
    );
  } 
  else {
    console.log(
      "Bad luck, bye bye!\n"
    );
  }

  console.log(challenge.boxes);
}

function showProbability() {
  console.log(
    `\nProbability of finding the right box is ${challenge.probability * 100}%\n`
  );
}
