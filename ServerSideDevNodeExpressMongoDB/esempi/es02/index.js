var rect = {
	perimeter: (x, y) => (2 * (x + y)),
	area: (x, y) => (x * y)
};

function solveRect(base, alt) {
	console.log("Rettangolo: base = " + base + ";   altezza= " + alt);
	console.log("Perimetro = " + rect.perimeter(base, alt));
	console.log("Area = " + rect.area(base, alt));
}


//MAIN
solveRect(2, 4);
solveRect(3, 5);
solveRect(0, 4);
