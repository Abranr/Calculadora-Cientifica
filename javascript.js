class CalculadoraBasica {
    constructor() {
        this.basicOperationShape = new RegExp("(([1-9][0-9]*|[0.])(.[0-9]*[1-9])?[\-\+\*\/])(([1-9][0-9]*|[0.])(.[0-9]*[1-9])?)");
        this.memoryRegister = 0;
    }

    printMemoryContents() {
        this.clearDisplay();
        this.writeToDisplay(this.memoryRegister);
    }

    subtractFromMemory() {
        this.memoryRegister -= this.solveOperation();
    }

    addToMemory() {
        this.memoryRegister += this.solveOperation();
    }

    writeToDisplay(data) {
        let legacy = document.getElementById("displayBox").value;
        if (data == ".") {
            legacy += data;
        } else {
            legacy = legacy == "0" ? data : legacy += data;
        }
        document.getElementById("displayBox").value = legacy;
    }

    writeOperatorToDisplay(operator) {
        let legacy = document.getElementById("displayBox").value;
        if (this.basicOperationShape.test(legacy)) {
            this.solveOperation();
        }
        this.writeToDisplay(operator);
    }

    clearDisplay() {
        document.getElementById("displayBox").value = "0";
    }

    solveOperation() {
        let operation = document.getElementById("displayBox").value;
        let result = 0;
        try {
            result = eval(operation === "" ? 0 : operation);
        } catch (err) {
            alert("Syntax error");
            this.clearDisplay();
        }
        document.getElementById("displayBox").value = result;
        return result;
    }
}

class CalculadoraCientifica extends CalculadoraBasica {
    constructor() {
        super();
        this.inputList = [];
        this.operationString = "";
        this.justSolved = false;
        this.operationMap = {
            "sin(": "Math.sin(",
            "cos(": "Math.cos(",
            "tan(": "Math.tan(",
            "log(": "Math.log10(",
            "ln(": "Math.log(",
            "sqrt(": "Math.sqrt(",
            "PI": "Math.PI",
            "e": "Math.E"
        };
    }

    writeToDisplay(data) {
        if (document.getElementById("displayBox").value === "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += data;
        this.inputList.push(data);
    }

    writeOperatorToDisplay(operator) {
        if (document.getElementById("displayBox").value === "Syntax Error") {
            super.clearDisplay();
        }
        this.operationString += operator;
        super.writeToDisplay(operator);
        this.inputList.push(operator);
    }

    solveOperation() {
        let result = 0;
        try {
            result = eval(this.operationString === "" || this.operationString === "Syntax Error" ? 0 : this.operationString);
        } catch (err) {
            result = "Syntax Error";
        }
        document.getElementById("displayBox").value = result;
        this.operationString = result.toString();
        this.justSolved = true;
        return result;
    }

    clearDisplay() {
        super.clearDisplay();
        this.operationString = "";
    }

    toggleSign() {
        let displayBox = document.getElementById("displayBox");
        let displayContents = displayBox.value;
        if (displayContents === "Syntax Error") {
            super.clearDisplay();
        }
        if (displayContents === "0") {
            displayBox.value = "-";
            this.operationString += "-";
        } else {
            displayBox.value = "-" + displayBox.value;
            this.operationString = "-" + this.operationString;
        }
    }

    clearMemory() {
        this.memoryRegister = 0;
    }

    readMemory() {
        this.clearDisplay();
        this.writeToDisplay(this.memoryRegister);
    }

    saveToMemory() {
        this.memoryRegister = this.solveOperation();
    }

    eraseLastInput() {
        this.inputList.pop();
        this.operationString = this.inputList.join('');
        document.getElementById("displayBox").value = this.operationString;
    }

    writeMathFunction(data) {
        if (document.getElementById("displayBox").value === "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += this.operationMap[data];
        this.inputList.push(data);
    }

    calculateFactorial() {
        let number = parseInt(this.operationString.split(/[^0-9]/).filter(Boolean).pop());
        let result = 0;
        try {
            result = this.calculateRecursiveFactorial(number);
        } catch (err) {
            document.getElementById("displayBox").value = "That number is too big";
            return;
        }
        this.clearDisplay();
        document.getElementById("displayBox").value = result;
    }

    calculateRecursiveFactorial(number) {
        if (number === 1 || number === 0) {
            return 1;
        }
        return number * this.calculateRecursiveFactorial(number - 1);
    }

    nthTenPower() {
        let number = parseInt(this.operationString.split(/[^0-9]/).filter(Boolean).pop());
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(10, number);
    }

    square() {
        let number = parseInt(this.operationString.split(/[^0-9]/).filter(Boolean).pop());
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(number, 2);
    }

    cube() {
        let number = parseInt(this.operationString.split(/[^0-9]/).filter(Boolean).pop());
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(number, 3);
    }

    inverseNumber() {
        let number = parseInt(this.operationString.split(/[^0-9]/).filter(Boolean).pop());
        this.clearDisplay();
        document.getElementById("displayBox").value = 1 / number;
    }
}

const calculadora = new CalculadoraCientifica();

function parseTerm(term) {
    const parts = term.match(/([+-]?\d*\.?\d*)(x(?:\^(\d+))?)?/);
    const coefficient = parts[1] ? parseFloat(parts[1]) : (parts[0].charAt(0) === '-' ? -1 : 1);
    const exponent = parts[3] ? parseInt(parts[3]) : (parts[2] ? 1 : 0);
    return { coefficient, exponent };
}

function deriveTerm(term) {
    if (term.exponent === 0) return null;
    const newCoefficient = term.coefficient * term.exponent;
    const newExponent = term.exponent - 1;
    return { coefficient: newCoefficient, exponent: newExponent };
}

function termToString(term) {
    if (!term) return '';
    let coeff = term.coefficient.toString();
    if (term.exponent === 0) return coeff;
    if (term.exponent === 1) return coeff + 'x';
    return coeff + 'x^' + term.exponent;
}

function calculateDerivative() {
    const input = document.getElementById('inputFunction').value;
    const terms = input.split(/(?=[+-])/).map(term => term.trim());
    const parsedTerms = terms.map(parseTerm);
    const derivedTerms = parsedTerms.map(deriveTerm).filter(term => term !== null);
    const result = derivedTerms.map(termToString).join(' + ').replace(/\+\s+-/g, '- ');
    document.getElementById('result').innerText = 'Derivada: ' + result;
}
