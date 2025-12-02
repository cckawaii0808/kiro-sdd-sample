/**
 * 安全地評估數學表達式
 * 只支援基本運算：+、-、*、/
 */
export function evaluateExpression(expression: string): number {
  // 移除空白
  const cleaned = expression.replace(/\s/g, '');
  
  // 驗證表達式只包含數字和運算符號
  if (!/^[\d+\-*/.()]+$/.test(cleaned)) {
    throw new Error('Invalid expression');
  }

  // 防止除以零
  if (/\/0(?!\d)/.test(cleaned)) {
    throw new Error('Division by zero');
  }

  try {
    // 使用 Function 構造器安全評估
    const result = Function(`'use strict'; return (${cleaned})`)();
    
    if (!isFinite(result)) {
      throw new Error('Result is not finite');
    }

    return Number(result.toFixed(10));
  } catch (error) {
    throw new Error('Invalid expression');
  }
}
