function dice_roll(): Dice {
    let roll_1 = Math.floor(Math.random() * 6) + 1;
    let roll_2 = Math.floor(Math.random() * 6) + 1;

    if (roll_1 === roll_2) {
        console.log("Double:", roll_1, roll_1, roll_1, roll_1);
        return { values: [roll_1, roll_1, roll_1, roll_1] };
    } 
    console.log(roll_1, roll_2);
    return { values: [roll_1, roll_2] }; 
}


