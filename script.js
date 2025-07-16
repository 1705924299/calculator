const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = document.querySelector('.calculator__display');

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

  // 处理数字和小数点
  if (keyType === 'number' || keyType === 'decimal') {
    if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
      display.textContent = displayedNum;
    } else {
      display.textContent = appendToDisplay(display.textContent, displayedNum);
    }
  }

  // 处理操作符
  if (keyType === 'operator') {
    calculator.dataset.firstValue = display.textContent;
    calculator.dataset.operator = key.dataset.action;
    calculator.dataset.previousKeyType = 'operator';
    key.classList.add('is-depressed');
  }

  // 处理等号
  if (keyType === 'calculate') {
    const secondValue = display.textContent;
    if (firstValue && operator) {
      display.textContent = calculate(firstValue, operator, secondValue);
      calculator.dataset.firstValue = display.textContent;
      calculator.dataset.previousKeyType = 'calculate';
    }
  }

// 事件监听
keys.addEventListener('click', e => {
  if (e.target.matches('button')) {
    const key = e.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    const displayedNum = display.textContent;
    const previousKeyType = calculator.dataset.previousKeyType;
    const firstValue = calculator.dataset.firstValue;
    const operator = calculator.dataset.operator;

 // 数字键
  if (!action) {
    if (
      displayedNum === '0' ||
      previousKeyType === 'operator' ||
      previousKeyType === 'calculate'
    ) {
      display.textContent = keyContent;
    } else if (displayedNum.length < 12) {
      // 限制最大长度
      display.textContent = displayedNum === '0' ? keyContent : displayedNum + keyContent;
    }
    calculator.dataset.previousKeyType = 'number';
    return;
  }

  // 小数点
  if (action === 'decimal') {
    if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
      display.textContent = '0.';
    } else if (!displayedNum.includes('.')) {
      display.textContent = displayedNum + '.';
    }
    calculator.dataset.previousKeyType = 'decimal';
    return;
  }

    // 处理操作符
    if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
      calculator.dataset.firstValue = displayedNum;
      calculator.dataset.operator = action;
      calculator.dataset.previousKeyType = 'operator';
      key.classList.add('is-depressed');
    }

    // 计算结果
    if (action === 'calculate') {
      const secondValue = displayedNum;
      if (firstValue && operator) {
        const result = calculate(firstValue, operator, secondValue);
        display.textContent = result;
        calculator.dataset.firstValue = result; // 更新 firstValue 为计算结果
        calculator.dataset.previousKeyType = 'calculate';
      }
    }
  }
});
