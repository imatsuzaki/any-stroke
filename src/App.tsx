import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";

interface PointEvent {
  x: number,
  y: number
}

const useDrawVariables = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | undefined | null>(null);
  const snapShot = useRef<ImageData>();

  return {
    canvas, ctx, snapShot
  }
}

const useDrawShapes = (ctx: any, color: any, range: any) => {
  let ctxInstance: CanvasRenderingContext2D = ctx.current;
  const drawLine = (e: PointEvent) => {
    if (!ctxInstance) {
      return;
    }

    console.log("draw line.");
    ctxInstance.lineTo(e.x, e.y);
    ctxInstance.lineWidth = range;
    ctxInstance.strokeStyle = color;
    ctxInstance.stroke();
  }
  return {drawLine}
}



function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");
  // @ts-ignore
  const [color, setColor] = useState<string>("#000");
  // @ts-ignore
  const [range, setRange] = useState<string>("5")
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const {canvas, ctx, snapShot} = useDrawVariables();
  const { drawLine } = useDrawShapes(ctx, color, range);
  // @ts-ignore
  const [startPoint, setStartPoint] = useState<PointEvent>();

  useEffect(() => {
    if (!canvas) return;
    ctx.current = canvas.current?.getContext("2d");
  }, [canvas, ctx]);
  useLayoutEffect(() => {
    if (canvas.current) {
      canvas.current.width = canvas.current.clientWidth
      canvas.current.height = canvas.current.clientHeight
    }
  }, [canvas])

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsDrawing(true);
    if (!ctx.current) return;
    if (!canvas.current) return;
    ctx.current.beginPath();
    snapShot.current = ctx.current.getImageData(0, 0, canvas.current.width, canvas.current.height)
    const x = e.clientX - canvas.current?.getBoundingClientRect().left;
    const y = e.clientY - canvas.current?.getBoundingClientRect().top;
    const event = { x, y };
    setStartPoint(event);

  }
  const onMouseMove = (e: any) => {
    if (!isDrawing) return;
    if (!canvas.current) return;
    if (!ctx.current) return;
    if (!snapShot.current) return;
    ctx.current.putImageData(snapShot.current, 0, 0)
    const x = e.clientX - canvas.current?.getBoundingClientRect().left;
    const y = e.clientY - canvas.current?.getBoundingClientRect().top;
    const event = { x, y };
    drawLine(event);
  }
  const onMouseUp = () => {
    setIsDrawing(false)
  }

  return (
    <>
        <h1>枠内に線が引ける</h1>
        <canvas
          className="main-canvas"
          ref={canvas}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        ></canvas>
    </>
  )
}

export default App;
