/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import c from "clsx";
import useStore from "./store";
import { setSidebarOpen, setTargetBody } from "./actions";

const Sidebar = () => {
  const celestialBodies = useStore.use.celestialBodies();
  const isSidebarOpen = useStore.use.isSidebarOpen();

  return (
    <aside className={c("sidebar", { open: isSidebarOpen })}>
      <button
        className="closeButton"
        onClick={() => setSidebarOpen(false)}
        aria-label="Close sidebar"
      >
        <span className="icon">close</span>
      </button>

      <h2>Solar System</h2>
      <ul>
        {celestialBodies?.map((body) => (
          <li key={body.id} onClick={() => setTargetBody(body.id)}>
            <p>{body.name}</p>
          </li>
        ))}
        {(!celestialBodies || celestialBodies.length === 0) && <li>Loading celestial bodies...</li>}
      </ul>
    </aside>
  );
};

export default Sidebar;
