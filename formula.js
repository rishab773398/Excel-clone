for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid ="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [cellA, cellProp] = activecell(address);
            let enteredData = cellA.innerText;
            if (enteredData === cellProp.value) return;
            cellProp.value = enteredData;
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);


        })
    }
}
let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", (e) => {
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {
        let address = addressBar.value;
        let [cell, cellProp] = activecell(address);
        if (inputFormula !== cellProp.formula) {
            removeChildFromParent(cellProp.formula);
            addChildToGraphComponent(inputFormula, address);
            let isCyclic = isGraphCyclic(graphComponentMatrix);
            console.log(isCyclic);
            if (isCyclic) {
                alert("Your formula is cyclic");
                removeChildFromGraphComponenet(inputFormula, address);
                formulaBar.value = "";
                return;
            }
            let evaluatedValue = evaluateFormula(inputFormula);
            setCellUIAndCellProp(evaluatedValue, inputFormula, address);
            addChildToParent(inputFormula);
            updateChildrenCells(address);

        }
    }
})
function removeChildFromGraphComponenet(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDfromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDfromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();

        }
    }
}







function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDfromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDfromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].push([crid, ccid]);

        }
    }
}



















function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = activecell(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }
    }
}
function updateChildrenCells(parentAddress) {
    console.log(parentAddress);
    let [parentCell, parentCellProp] = activecell(parentAddress);
    let children = parentCellProp.children;
    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = activecell(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}
function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = activecell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}





function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = activecell(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}
function setCellUIAndCellProp(evaluatedValue, formula, address) {

    let [cell, cellProp] = activecell(address);
    cell.innerText = evaluatedValue;
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}