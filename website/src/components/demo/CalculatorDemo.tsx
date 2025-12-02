import React, { useState } from 'react';
import styles from './CalculatorDemo.module.css';

export default function CalculatorDemo() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<Array<{expression: string, result: string}>>([]);

  const evaluateExpression = (expr: string): string => {
    try {
      const cleaned = expr.replace(/×/g, '*').replace(/÷/g, '/');
      const result = Function(`'use strict'; return (${cleaned})`)();
      return Number(result.toFixed(10)).toString();
    } catch {
      return 'Error';
    }
  };

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
      setExpression(num);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setDisplay(display + ' ' + op + ' ');
    setExpression(expression + op);
  };

  const handleDecimal = () => {
    if (display === 'Error') return;
    const parts = display.split(/[\+\-\×\÷]/);
    const lastPart = parts[parts.length - 1];
    if (!lastPart.includes('.')) {
      setDisplay(display + '.');
      setExpression(expression + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleBackspace = () => {
    if (display.length > 1 && display !== 'Error') {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else {
      handleClear();
    }
  };

  const handleEquals = () => {
    if (expression && display !== 'Error') {
      const result = evaluateExpression(expression);
      setHistory([{expression: display, result}, ...history.slice(0, 9)]);
      setDisplay(result);
      setExpression(result);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.calculator}>
        <div className={styles.display}>
          <div className={styles.expression}>{expression || '0'}</div>
          <div className={styles.result}>{display}</div>
        </div>

        <div className={styles.buttons}>
          <button onClick={handleClear} className={`${styles.btn} ${styles.btnFunction}`}>C</button>
          <button onClick={handleBackspace} className={`${styles.btn} ${styles.btnFunction}`}>←</button>
          <button onClick={() => handleOperator('÷')} className={`${styles.btn} ${styles.btnOperator}`}>÷</button>
          <button onClick={() => handleOperator('×')} className={`${styles.btn} ${styles.btnOperator}`}>×</button>

          <button onClick={() => handleNumber('7')} className={styles.btn}>7</button>
          <button onClick={() => handleNumber('8')} className={styles.btn}>8</button>
          <button onClick={() => handleNumber('9')} className={styles.btn}>9</button>
          <button onClick={() => handleOperator('-')} className={`${styles.btn} ${styles.btnOperator}`}>-</button>

          <button onClick={() => handleNumber('4')} className={styles.btn}>4</button>
          <button onClick={() => handleNumber('5')} className={styles.btn}>5</button>
          <button onClick={() => handleNumber('6')} className={styles.btn}>6</button>
          <button onClick={() => handleOperator('+')} className={`${styles.btn} ${styles.btnOperator}`}>+</button>

          <button onClick={() => handleNumber('1')} className={styles.btn}>1</button>
          <button onClick={() => handleNumber('2')} className={styles.btn}>2</button>
          <button onClick={() => handleNumber('3')} className={styles.btn}>3</button>
          <button onClick={handleEquals} className={`${styles.btn} ${styles.btnEquals} ${styles.rowSpan2}`}>=</button>

          <button onClick={() => handleNumber('0')} className={`${styles.btn} ${styles.colSpan2}`}>0</button>
          <button onClick={handleDecimal} className={styles.btn}>.</button>
        </div>
      </div>

      <div className={styles.history}>
        <div className={styles.historyHeader}>
          <h3>計算歷史</h3>
          {history.length > 0 && (
            <button onClick={handleClearHistory} className={styles.btnClear}>清除</button>
          )}
        </div>
        <div className={styles.historyList}>
          {history.length === 0 ? (
            <p className={styles.emptyMessage}>尚無計算記錄</p>
          ) : (
            history.map((item, index) => (
              <div key={index} className={styles.historyItem}>
                <span className={styles.historyExpression}>{item.expression}</span>
                <span className={styles.historyResult}>= {item.result}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
