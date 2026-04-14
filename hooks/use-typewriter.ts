import { useState, useEffect, useRef } from "react";

export function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const textRef = useRef(text);

  useEffect(() => {
    // Novo texto — reinicia
    textRef.current = text;
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);

    const interval = setInterval(() => {
      const next = indexRef.current + 1;
      setDisplayed(textRef.current.slice(0, next));
      indexRef.current = next;

      if (next >= textRef.current.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}
