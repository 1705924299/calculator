// 计算器操作配置
export const operations = {
  reciprocal: {
    calculate: (n) => 1 / n,
    expression: (n) => `1/(${n})=`,
    errorCheck: (n) => n === 0,
    symbol: '1/x'
  },
  square: {
    calculate: (n) => n * n,
    expression: (n) => `(${n})²=`,
    errorCheck: () => false,
    symbol: 'x²'
  },
  sqrt: {
    calculate: (n) => Math.sqrt(n),
    expression: (n) => `√(${n})=`,
    errorCheck: (n) => n < 0,
    symbol: '√x'
  },
  percent: {
    calculate: (n) => n / 100,
    expression: (n) => `${n}%=`,
    errorCheck: () => false,
    symbol: '%'
  }
};

// 获取操作符符号
export const getOperatorSymbol = (action) => {
  if (action === 'add') return '+';
  if (action === 'subtract') return '-';
  if (action === 'multiply') return '×';
  if (action === 'divide') return '÷';
  
  // 从operations配置中获取单操作数函数的符号
  if (operations[action]) {
    return operations[action].symbol;
  }
  
  return '';
};

// 计算加减乘除
export const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  
  if (operator === 'add') return firstNum + secondNum;
  if (operator === 'subtract') return firstNum - secondNum;
  if (operator === 'multiply') return firstNum * secondNum;
  if (operator === 'divide') return secondNum === 0 ? 'Error' : firstNum / secondNum;
  
  return n2;
};

// 限制结果显示长度，最多8位
export const formatResult = (result) => {
  const resultString = result.toString();
  return resultString.length > 8 ? parseFloat(result).toPrecision(8) : resultString;
}; 