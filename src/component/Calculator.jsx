import { useState, useEffect } from "react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [operator, setOperator] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [resetNext, setResetNext] = useState(false);
  const [history, setHistory] = useState([]);

  const inputNumber = (num) => {
    if (resetNext) {
      setDisplay(num);
      setResetNext(false);
      return;
    }
    setDisplay(display === "0" ? num : display + num);
  };

  const inputDot = () => {
    if (resetNext) {
      setDisplay("0.");
      setResetNext(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const clearAll = () => {
    setDisplay("0");
    setOperator(null);
    setPrevious(null);
    setResetNext(false);
  };

  // Backspace logic
  const backspace = () => {
    if (resetNext) return; // prevent deleting result immediately
    if (display.length === 1 || display === "0") {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const toggleSign = () => setDisplay(String(parseFloat(display) * -1));
  const percent = () => setDisplay(String(parseFloat(display) / 100));

  const scientific = (type) => {
    const value = parseFloat(display);
    let result = value;
    switch (type) {
      case "√": result = Math.sqrt(value); break;
      case "x²": result = Math.pow(value, 2); break;
      case "sin": result = Math.sin(value); break;
      case "cos": result = Math.cos(value); break;
      case "tan": result = Math.tan(value); break;
      default: break;
    }
    setDisplay(String(result));
    setHistory((h) => [`${type}(${value}) = ${result}`, ...h]);
  };

  const compute = (a, b, op) => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? 0 : a / b;
      default: return b;
    }
  };

  const chooseOperator = (op) => {
    if (operator && !resetNext) {
      const result = compute(previous, parseFloat(display), operator);
      setPrevious(result);
      setDisplay(String(result));
    } else {
      setPrevious(parseFloat(display));
    }
    setOperator(op);
    setResetNext(true);
  };

  const equals = () => {
    if (!operator || previous === null) return;
    const result = compute(previous, parseFloat(display), operator);
    setHistory((h) => [`${previous} ${operator} ${display} = ${result}`, ...h]);
    setDisplay(String(result));
    setPrevious(null);
    setOperator(null);
    setResetNext(true);
  };

  // Keyboard support
useEffect(() => {
  const handleKey = (e) => {
    if (!isNaN(e.key)) inputNumber(e.key);
    if (e.key === ".") inputDot();
    if (["+", "-"].includes(e.key)) chooseOperator(e.key);
    if (e.key === "*") chooseOperator("×");
    if (e.key === "/") chooseOperator("÷");
    if (e.key === "Enter") equals();
    if (e.key === "Escape") clearAll();
    if (e.key === "Backspace") backspace();
  };

  window.addEventListener("keydown", handleKey);

  return () => {
    window.removeEventListener("keydown", handleKey);
  };
}, [display, operator, previous]);

  const Btn = ({ children, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`rounded-2xl text-lg font-semibold active:scale-95 transition bg-blue-200 hover:bg-zinc-700 py-3 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen  p-4 grid gap-4 md:grid-cols-[1fr_300px]">
      <div className="max-w-md mx-auto w-full">
        <div className="rounded-3xl p-4 bg-pink-300 shadow-2xl">
          <div className="mb-4 h-20 flex items-end justify-end rounded-2xl bg-black px-4 text-right text-3xl font-mono text-white overflow-hidden">
            {display}
          </div>

          <div className="grid grid-cols-4 gap-3 ">
            <Btn onClick={clearAll} className="bg-zinc-600">AC</Btn>
            <Btn onClick={backspace} className="bg-zinc-600">⬅</Btn>
            <Btn onClick={toggleSign} className="bg-zinc-600">±</Btn>
            <Btn onClick={percent} className="bg-zinc-600">%</Btn>
            <Btn onClick={() => chooseOperator("÷")} className="bg-orange-500">÷</Btn>

            <Btn onClick={() => inputNumber("7")}>7</Btn>
            <Btn onClick={() => inputNumber("8")}>8</Btn>
            <Btn onClick={() => inputNumber("9")}>9</Btn>
            <Btn onClick={() => chooseOperator("×")} className="bg-orange-500">×</Btn>

            <Btn onClick={() => inputNumber("4")}>4</Btn>
            <Btn onClick={() => inputNumber("5")}>5</Btn>
            <Btn onClick={() => inputNumber("6")}>6</Btn>
            <Btn onClick={() => chooseOperator("-")} className="bg-orange-500">−</Btn>

            <Btn onClick={() => inputNumber("1")}>1</Btn>
            <Btn onClick={() => inputNumber("2")}>2</Btn>
            <Btn onClick={() => inputNumber("3")}>3</Btn>
            <Btn onClick={() => chooseOperator("+")} className="bg-orange-500">+</Btn>

            <Btn onClick={() => inputNumber("0")} className="col-span-2">0</Btn>
            <Btn onClick={inputDot}>.</Btn>
            <Btn onClick={equals} className="bg-orange-500">=</Btn>
          </div>

          <div className="grid grid-cols-5 gap-2 mt-4 text-sm">
            <Btn onClick={() => scientific("√")}>√</Btn>
            <Btn onClick={() => scientific("x²")}>x²</Btn>
            <Btn onClick={() => scientific("sin")}>sin</Btn>
            <Btn onClick={() => scientific("cos")}>cos</Btn>
            <Btn onClick={() => scientific("tan")}>tan</Btn>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-4 text-white overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">History</h2>
        {history.length === 0 && (
          <p className="text-white text-sm">No calculations yet</p>
        )}
        <ul className="space-y-1 text-sm">
          {history.map((item, i) => (
            <li key={i} className="text-zinc-300">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
