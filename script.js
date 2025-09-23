let btn = document.getElementById("btn");

btn.style.backgroundImage='url("images/blue.png")';

btn.addEventListener("click", function() {
    alert("Button clicked!");
    console.log("The button was clicked.");
});

// Game state
const S = {
    stage: 1, gold: 0,
    tap: 1
};

// Scaling
const names = ["Nacho Cheese Ooze", "Tide Pod cousin", "Gooey Grape", "Booger", "King Goop"];
// const stage = ;
// const stageHp = ;
// const stageGold = ;



