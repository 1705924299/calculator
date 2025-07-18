const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = document.querySelector('.calculator__display');
const expressionDisplay = document.querySelector('.calculator__expression');

// 用于检查操作符类型
const isOperator = (action) => {
  return ['add', 'subtract', 'multiply', 'divide'].includes(action);
};

// 用于拼接数值的纯函数
const appendToDisplay = (displayedNum, keyContent) => {
  if (displayedNum === '0' || displayedNum === '') {
    return keyContent;
  } else {
    return displayedNum + keyContent;
  }
};

// 用于添加小数点的纯函数
const addDecimal = (displayedNum) => {
  return displayedNum + '.';
};

// 获取操作符符号
const getOperatorSymbol = (action) => {
  if (action === 'add') return '+';
  if (action === 'subtract') return '-';
  if (action === 'multiply') return '×';
  if (action === 'divide') return '÷';
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

// 更新计算器状态
const updateCalculatorState = (key, calculator, displayedNum) => {
  const keyType = getKeyType(key);
  const previousKeyType = calculator.dataset.previousKeyType;
  const firstValue = calculator.dataset.firstValue;
  const operator = calculator.dataset.operator;

  // 更新 previousKeyType
  calculator.dataset.previousKeyType = keyType;

  // 重置所有按钮的 depressed 状态
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));
  

  // 清除
  if (action === 'clear') {
    display.textContent = '0';
    calculator.dataset.firstValue = '';
    calculator.dataset.operator = '';
    calculator.dataset.modValue = '';
    calculator.dataset.previousKeyType = '';
    Array.from(keys.children).forEach(k => k.classList.remove('is-depressed'));
    key.textContent = 'AC';
    return;
  }
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
      if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
        const result = calculate(firstValue, operator, displayedNum);
        // 限制结果显示长度，最多8位
        const resultString = result.toString();
        const limitedResult = resultString.length > 8 ? parseFloat(result).toPrecision(8) : resultString;
        display.textContent = limitedResult;
        calculator.dataset.firstValue = limitedResult; // 更新为计算结果
      } else {
        calculator.dataset.firstValue = displayedNum;
      }
      let opSymbol = '';
      if (action === 'add') opSymbol = '+';
      if (action === 'subtract') opSymbol = '-';
      if (action === 'multiply') opSymbol = '×';
      if (action === 'divide') opSymbol = '÷';
      // 只在不是连续操作符时拼接
      if (previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
        expression += opSymbol;
      } else {
        // 连续操作符时替换最后一个操作符
        expression = expression.replace(/[+\-×÷]$/, opSymbol);
      }
      expressionDisplay.textContent = expression;
      calculator.dataset.expression = expression;
      calculator.dataset.operator = action;
      calculator.dataset.previousKeyType = 'operator';
      // 按钮高亮
      Array.from(keys.children).forEach(k => k.classList.remove('is-depressed'));
      key.classList.add('is-depressed');
      return;
    }

    // 清除键
    if (action === 'clear') {
      if (key.textContent === 'AC') {
        // 重置所有计算状态
        calculator.dataset.firstValue = '';
        calculator.dataset.operator = '';
        calculator.dataset.previousKeyType = 'clear';
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

    // 计算结果
    if (action === 'calculate') {
      let first = firstValue;
      let second = displayedNum;
      let op = operator;

      if (first && op) {
        if (previousKeyType === 'calculate') {
          // 连续按等号的情况：使用上一次的计算结果作为第一个数，modValue作为第二个数
          first = calculator.dataset.firstValue; // 使用上一次的计算结果
          second = calculator.dataset.modValue;
        } else {
          // 第一次按等号：正常显示完整表达式
          calculator.dataset.modValue = displayedNum;
          if (expression && !expression.endsWith('=')) {
            expression += '=';
          }
        }
        
        const result = calculate(first, op, second);
        // 限制结果显示长度，最多8位
        const resultString = result.toString();
        const limitedResult = resultString.length > 8 ? parseFloat(result).toPrecision(8) : resultString;
        display.textContent = limitedResult;
        calculator.dataset.firstValue = limitedResult;
        
        // 如果是连续按等号，更新表达式为新的计算
        if (previousKeyType === 'calculate') {
          expression = first + getOperatorSymbol(op) + second + '=';
        }
        
        expressionDisplay.textContent = expression;
        calculator.dataset.expression = expression;
        calculator.dataset.previousKeyType = 'calculate';
      }
      return;
    }
  }
});
