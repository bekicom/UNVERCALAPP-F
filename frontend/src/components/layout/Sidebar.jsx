import { sidebarGroups, MENU_ICONS } from "../../constants/ui";
import { Icon } from "../Icon";

export function Sidebar({ user, activeSection, setActiveSection, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <p className="badge">Admin Panel</p>
        <h2 className="sidebar-title">DOKON</h2>
        {sidebarGroups.map((group) => (
          <div key={group.title} className="menu-block">
            <nav className="menu">
              {group.items.map((item) => (
                <button key={item} type="button" className={`menu-btn ${activeSection === item ? "active" : ""}`} onClick={() => setActiveSection(item)}>
                  <Icon name={MENU_ICONS[item] || "box"} />
                  {item}
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>
      <button className="ghost logout-btn" onClick={onLogout}>Chiqish</button>
    </aside>
  );
}
