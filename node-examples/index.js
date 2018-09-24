var rect = require('./rectangle');

function solveRect(l,b) 
{
    console.log("Solving for rect with l = " + l + " and b = " + b);

    rect(l,b,(error, rectangle) => {
        if (error) {
            console.log("Error: ", error.message);
        }
        else {
            console.log("Rectangle l:" + l + " and b: " + b + " has an area of " + rectangle.area());
            console.log("The perimeter is " + rectangle.perimeter());
            console.log("");
        }
    });

    console.log("This statement is after the call to rect()...")
    console.log("");
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-3,5);