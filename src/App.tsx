import Scene from "./components/Scene";
import OverlayUI from "./components/OverlayUI";
import "./index.css";

export default function App() {
  return (
    <main className="page">
      <Scene />
      <OverlayUI />
      <div className="scroll-spacer" aria-hidden="true" />
    </main>
  );
}
