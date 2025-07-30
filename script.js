const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = document.querySelector('.calculator__display');
const expressionDisplay = document.querySelector('.calculator__expression');

// 获取操作符符号
const getOperatorSymbol = (action) => {
  if (action === 'add') return '+';
  if (action === 'subtract') return '-';
  if (action === 'multiply') return '×';
  if (action === 'divide') return '÷';
  if (action === 'reciprocal') return '1/x';
  if (action === 'square') return 'x²';
  if (action === 'sqrt') return '√x';
  if (action === 'percent') return '%';
  return '';
};


// 计算加减乘除
const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  if (operator === 'add') return firstNum + secondNum;
  if (operator === 'subtract') return firstNum - secondNum;
  if (operator === 'multiply') return firstNum * secondNum;
  if (operator === 'divide') return secondNum === 0 ? 'Error' : firstNum / secondNum;
  return n2;
};

// 获取按键类型
const getKeyType = (key) => {
  const { action } = key.dataset;
  if (!action) return 'number';
  if (['add', 'subtract', 'multiply', 'divide'].includes(action)) return 'operator';
  if (action === 'decimal') return 'decimal';
  if (action === 'clear') return 'clear';
  if (action === 'calculate') return 'calculate';
  return action;
};
// 事件监听
keys.addEventListener('click', e => {
  if (e.target.matches('button')) {
    const key = e.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    let displayedNum = display.textContent;
    const previousKeyType = calculator.dataset.previousKeyType;
    const firstValue = calculator.dataset.firstValue;
    const operator = calculator.dataset.operator;
    let expression = calculator.dataset.expression || '';

    // 其他操作符和按钮逻辑...
    
    console.log("action:", action);
    console.log("displayedNum:", displayedNum);

    // 数字键
    if (!action) {
      console.log("进入数字键处理逻辑");
      if (
        displayedNum === '0' ||
        previousKeyType === 'operator' ||
        previousKeyType === 'calculate'
      ) {
        console.log("条件1匹配");
        display.textContent = keyContent;
        displayedNum = keyContent;
        // 如果是从计算结果开始输入新数字，清除lastFunction
        if (previousKeyType === 'calculate') {
          calculator.dataset.lastFunction = '';
        }
      } else {
        // 检查添加新数字后是否会超过8位
        const newDisplayedNum = displayedNum + keyContent;
        if (newDisplayedNum.length <= 8) {
          console.log("条件2匹配");
          displayedNum = newDisplayedNum;
          display.textContent = displayedNum;
        }
      }
      // 表达式处理
      if (
        displayedNum === '0' ||
        previousKeyType === 'operator' ||
        previousKeyType === 'calculate'
      ) {
        expression += keyContent;
      } else {
        // 只在长度允许时拼接
        const newDisplayedNum = displayedNum + keyContent;
        if (newDisplayedNum.length <= 8) {
          expression += keyContent;
        }
      }
      expressionDisplay.textContent = expression;
      calculator.dataset.expression = expression;
      calculator.dataset.previousKeyType = 'number';
      return;
    }

    // 小数点
    if (action === 'decimal') {
      if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
        display.textContent = '0.';
        // 如果是从计算结果开始输入小数点，清除lastFunction
        if (previousKeyType === 'calculate') {
          calculator.dataset.lastFunction = '';
        }
      } else if (!displayedNum.includes('.') && displayedNum.length < 8) {
        display.textContent = displayedNum + '.';
      }
      // 表达式处理
      if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
        expression += '0.';
      } else if (!displayedNum.includes('.') && displayedNum.length < 8) {
        expression += '.';
      }
      expressionDisplay.textContent = expression;
      calculator.dataset.expression = expression;
      calculator.dataset.previousKeyType = 'decimal';
      return;
    }

    // 操作符
    if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
  let opSymbol = '';
  if (action === 'add') opSymbol = '+';
  if (action === 'subtract') opSymbol = '-';
  if (action === 'multiply') opSymbol = '×';
  if (action === 'divide') opSymbol = '÷';
  
  if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
    // 需要先计算前面的表达式
    const result = calculate(firstValue, operator, displayedNum);
    // 使用formatResult函数来限制显示长度
    const limitedResult = formatResult(result);
    display.textContent = limitedResult;
    calculator.dataset.firstValue = limitedResult; // 更新为计算结果
    // 更新表达式为计算结果 + 新操作符
    expression = limitedResult + opSymbol;
  } else {
    calculator.dataset.firstValue = displayedNum;
    // 只在不是连续操作符时拼接
    if (previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
      expression += opSymbol;
    } else {
      // 连续操作符时替换最后一个操作符
      expression = expression.replace(/[+\-×÷]$/, opSymbol);
    }
  }
  expressionDisplay.textContent = expression;
  calculator.dataset.expression = expression;
  calculator.dataset.operator = action;
  calculator.dataset.previousKeyType = 'operator';
  // 清除lastFunction，因为这是双操作数运算
  calculator.dataset.lastFunction = '';
  return;
}


    // 清除键
    if (action === 'clear') {
      if (key.textContent === 'AC') {
        // 重置所有计算状态
        calculator.dataset.firstValue = '';
        calculator.dataset.operator = '';
        calculator.dataset.previousKeyType = 'clear';
        calculator.dataset.lastFunction = '';
        key.textContent = 'CE';  // 切换为 CE
        display.textContent = '0';  // 重置显示为 0
      } else {
        // 处理 CE 情况，只清除显示
        key.textContent = 'AC';  // 切换为 AC
        display.textContent = '0'; // 清空显示
      }
      expression = '';
      expressionDisplay.textContent = '';
      calculator.dataset.expression = '';
      return;
    }
// 限制结果显示长度，最多8位
function formatResult(result) {
  const resultString = result.toString();
  return resultString.length > 8 ? parseFloat(result).toPrecision(8) : resultString;
}

// 公共处理函数
function handleCalculation(actionType) {
  if (previousKeyType === 'calculate' && calculator.dataset.lastFunction && calculator.dataset.lastFunction !== actionType) {
    calculator.dataset.lastFunction = '';
  }

  let numToOperate = displayedNum;
  if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
    const tempResult = calculate(firstValue, operator, displayedNum);
    numToOperate = formatResult(tempResult);
    display.textContent = numToOperate;
    expression = numToOperate;
  }

  const num = parseFloat(numToOperate);
  let result;
  
  // 根据不同操作类型处理
  if (actionType === 'reciprocal') {
    if (num === 0) {
      display.textContent = 'Error';
      expression = 'Error';
    } else {
      result = 1 / num;
      expression = `1/(${numToOperate})=`;
    }
  } else if (actionType === 'square') {
    result = num * num;
    expression = `(${numToOperate})²=`;
  } else if (actionType === 'sqrt') {
    if (num < 0) {
      display.textContent = 'Error';
      expression = 'Error';
    } else {
      result = Math.sqrt(num);
      expression = `√(${numToOperate})=`;
    }
  } else if (actionType === 'percent') {
    result = num / 100;
    expression = `${numToOperate}%=`;
  }

  // 显示结果
  display.textContent = formatResult(result);
  expressionDisplay.textContent = expression;
  
  // 更新状态
  calculator.dataset.expression = expression;
  calculator.dataset.firstValue = formatResult(result);
  calculator.dataset.previousKeyType = actionType;
  calculator.dataset.lastFunction = actionType;
  calculator.dataset.operator = '';
}

// 执行各个功能的调用
if (action === 'reciprocal') {
  handleCalculation('reciprocal');
  return;
}

if (action === 'square') {
  handleCalculation('square');
  return;
}

if (action === 'sqrt') {
  handleCalculation('sqrt');
  return;
}

if (action === 'percent') {
  handleCalculation('percent');
  return;
}


// 计算结果
if (action === 'calculate') {
  let first = firstValue;
  let second = displayedNum;
  let op = operator;
  const lastFunction = calculator.dataset.lastFunction;

  // 处理单操作数函数的连续按等号
  if ((previousKeyType === 'calculate' || ['reciprocal','square','sqrt','percent'].includes(previousKeyType)) && lastFunction && !op) {
    const currentNum = parseFloat(display.textContent); // 关键修正
    let result;
    let newExpression;
    
    if (lastFunction === 'reciprocal') {
      if (currentNum === 0) {
        display.textContent = 'Error';
        expression = 'Error';
      } else {
        result = 1 / currentNum;
        display.textContent = formatResult(result);
        newExpression = `1/(${display.textContent})=`;
      }
    } else if (lastFunction === 'square') {
      result = currentNum * currentNum;
      display.textContent = formatResult(result);
      newExpression = `(${display.textContent})²=`;
    } else if (lastFunction === 'sqrt') {
      if (currentNum < 0) {
        display.textContent = 'Error';
        expression = 'Error';
      } else {
        result = Math.sqrt(currentNum);
        display.textContent = formatResult(result);
        newExpression = `√(${display.textContent})=`;
      }
    } else if (lastFunction === 'percent') {
      result = currentNum / 100;
      display.textContent = formatResult(result);
      newExpression = `${display.textContent}%=`;
    }
    
    if (newExpression) {
      expression = newExpression;
      expressionDisplay.textContent = expression;
      calculator.dataset.expression = expression;
    }
    calculator.dataset.firstValue = display.textContent;
    calculator.dataset.previousKeyType = lastFunction;
    return;
  }

  // 处理双操作数运算
  if (first && op) {
    if (previousKeyType === 'calculate') {
      first = calculator.dataset.firstValue; 
      second = calculator.dataset.modValue;
    } else {
      calculator.dataset.modValue = displayedNum;
      if (expression && !expression.endsWith('=')) {
        expression += '=';
      }
    }
    
    const result = calculate(first, op, second);
    display.textContent = formatResult(result);
    calculator.dataset.firstValue = formatResult(result);
    
    if (previousKeyType === 'calculate') {
      expression = first + getOperatorSymbol(op) + second + '=';
    }
    
    expressionDisplay.textContent = expression;
    calculator.dataset.expression = expression;
    calculator.dataset.previousKeyType = 'calculate';
    calculator.dataset.lastFunction = '';
  }
  return;
}
  }})