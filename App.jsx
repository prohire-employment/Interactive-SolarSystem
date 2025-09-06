

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import c from "clsx";
import PhotoViz from "./PhotoViz";
import useStore from "./store";
import Sidebar from "./Sidebar";
import { clearSelection, toggleSidebar } from "./actions";

export default function App() {
  const caption = useStore.use.caption();
  const isSidebarOpen = useStore.use.isSidebarOpen();
  const targetBody = useStore.use.targetBody();

  return (
    <main>
      <PhotoViz />
      <Sidebar />
      <div className="scale-legend">
        <h4>Scale Legend</h4>
        <ul>
            <li><b>Planet Sizes:</b> Logarithmically scaled for visibility.</li>
            <li><b>Orbital Distances:</b> Scaled down to fit the view.</li>
        </ul>
      </div>
      <footer>
        <div className="caption">
          {caption}
        </div>
      </footer>
      <button
        onClick={toggleSidebar}
        className={c("sidebarButton iconButton", { active: isSidebarOpen })}
        aria-label="Toggle celestial body list"
        title="Toggle celestial body list"
      >
        <span className="icon">list</span>
      </button>
      {targetBody && (
         <button
            onClick={clearSelection}
            className="sidebarButton iconButton"
            style={{ right: '55px' }}
            aria-label="Reset view"
            title="Reset view"
          >
            <span className="icon">zoom_out_map</span>
          </button>
      )}
    </main>
  );
}