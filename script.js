let MATH_OPERATORS = '+-*/';
let PRECISION = 2;
let PRECISION_FACTOR = Math.pow(10, PRECISION);

let currentNumber = '0';
let currentOperator = '';
let oldOperator = '';
let equation = '';
let isAfterCalculation = false;

let currentNumberElement = document.getElementById('current-number');
let currentOperatorElement = document.getElementById('operator');
let equationElement = document.getElementById('equation');

let updateCurrentNumber = function () {
  currentNumberElement.textContent = currentNumber;
};

let updateEquation = function () {
  equationElement.textContent = equation;
};

let updateOperator = function() {
  currentOperatorElement.textContent = currentOperator;
};

let isValidFirstNumber = function (number) {
  if (number == '0' || number == '0.' || number == '0.0')
    return false;
  else 
    return true;
};

let clearDigit = function () {
  if (currentNumber.length > 1)
    currentNumber = currentNumber.slice(0, currentNumber.length - 1);
  else if (currentNumber.length == 1)
    currentNumber = '0';

  if (isAfterCalculation) {
    isAfterCalculation = false;
    updateEquation();
  }  
  updateCurrentNumber();
};

let clearEntry = function () {
  if (currentNumber != '0') {
    currentNumber = '0';
    updateCurrentNumber();
  }
  else {
    equation = equation.replace(/(?: [+\-*/] )?(?:(?:\d+?)$|(?:\d+?\.\d+?)$)/, '');
    updateEquation();
  }
  
  if (isAfterCalculation) {
    isAfterCalculation = false;
    updateEquation();
  }
};

let clearAll = function () {
  currentNumber = '0';
  equation = '';
  isAfterCalculation = false;
  updateCurrentNumber();
  updateEquation();
};

let processCalcInput = function (input) {
  
  // input is an operator
  if (MATH_OPERATORS.indexOf(input) >= 0) { 
    currentOperator = input;
    if (equation.length > 0) {
      // If there is a number in the buffer, we add it to the equation and reset the buffer
      if (currentNumber != '0') { 
        currentNumber = currentNumber.replace(/\.0$|\.$/, '');
        equation = equation.concat(` ${oldOperator} ${currentNumber}`);
        currentNumber = '0';
        updateEquation();
      }
      // If there is no number in the buffer, we can change the operator
      else {
        equation = equation.replace(/[+\-*/]$/, input);
      }
    }
    // There is no number saved yet in the equation
    else {
      if (currentNumber.length > 0) {
        if (isValidFirstNumber(input)) {
          currentNumber = currentNumber.replace(/\.0$|\.$/, '');
          equation = equation.concat(`${currentNumber}`);
          currentNumber = '0';
          updateEquation();
        }
      }
    }
    isAfterCalculation = false;
    oldOperator = currentOperator;
    updateOperator();
  }

  // input is a dot (.) 
  else if (input == '.' && !isAfterCalculation) {
    if (currentNumber.indexOf('.') < 0)
      currentNumber = currentNumber.concat(input);
  }

  // input is a number
  else if (!isAfterCalculation) {
    if (currentNumber == '0')
      currentNumber = input;
    else 
      currentNumber = currentNumber.concat(input);
  } 

  updateCurrentNumber();
};

let processEquation = function () {
  if (equation.length > 0) {
    // Add current buffer to the equation
    currentNumber = currentNumber.replace(/\.0$|\.$/, '');
    equation = equation.concat(` ${currentOperator} ${currentNumber}`);
    updateEquation();
    // Split and process equation from left to right
    let queue = equation.split(' ');
    let a, op, b, result;
    while (queue.length > 1) {
      a = Number(queue.shift());
      op = queue.shift();
      b = Number(queue.shift());
      switch (op) {
        case '+':
          result = a + b;
          break;
        case '-':
          result = a - b;
          break;
        case '/':
          result = a / b;
          break;
        case '*':
          result = a * b;
          break;
      }
      result = Math.round(result * PRECISION_FACTOR) / PRECISION_FACTOR;
      queue.unshift(result);
    }
    currentNumber = queue.shift().toString();
    equation = '';
    isAfterCalculation = true;
    
    updateCurrentNumber();
  }
};

[].forEach.call(document.getElementsByClassName('calc-input'), element => {
  element.addEventListener('click', () => processCalcInput(element.textContent));
});

document.addEventListener('keydown', (e) => {
  let processedKeys = '0123456789+-*/';
  console.log(e.key);
  if (processedKeys.indexOf(e.key) > -1) {
    processCalcInput(e.key);
  }
  else if (e.key == '=' || e.key == 'Enter') {
    processEquation();
  }
  else if (e.key == 'Backspace') {
    clearDigit();
  }
  else if (e.key == 'Delete') {
    clearEntry();
  }
});

document.getElementById('clear-entry').addEventListener('click', () => clearEntry());
document.getElementById('clear-all').addEventListener('click', () => clearAll());
document.getElementById('clear-digit').addEventListener('click', () => clearDigit());
document.getElementById('calculate').addEventListener('click', () => processEquation());