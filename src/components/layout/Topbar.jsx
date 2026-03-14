import { Icon } from "../Icon";

export function Topbar({
  activeSection,
  openCategoryModal,
  openCreateCustomerModal,
  openCreateSupplierModal,
  openCreateProductModal,
  openCreateExpenseModal,
  openCreateUserModal,
  theme,
  onToggleTheme,
  sidebarOpen,
  onToggleSidebar
}) {
  return (
    <header className="topbar">
      <div className="topbar-main">
        <button type="button" className="icon-btn sidebar-toggle-btn" onClick={onToggleSidebar} aria-label={sidebarOpen ? "Sidebarni yopish" : "Sidebarni ochish"}>
          <Icon name="menu" />
        </button>
        <h1>{activeSection}</h1>
      </div>
      <div className="toolbar-actions">
        {activeSection === "Mahsulotlar" ? (
          <>
            <button type="button" onClick={openCategoryModal}><Icon name="plus" />Kategoriya</button>
            <button type="button" onClick={openCreateSupplierModal}><Icon name="plus" />Yetkazib beruvchi</button>
            <button type="button" onClick={openCreateProductModal}><Icon name="plus" />Mahsulot qo'shish</button>
          </>
        ) : activeSection === "Kategoriyalar" ? (
          <button type="button" onClick={openCategoryModal}><Icon name="plus" />Kategoriya qo'shish</button>
        ) : activeSection === "Xarajatlar" ? (
          <button type="button" onClick={openCreateExpenseModal}><Icon name="plus" />Xarajat qo'shish</button>
        ) : activeSection === "Xodimlar" ? (
          <button type="button" onClick={openCreateUserModal}><Icon name="plus" />Xodim qo'shish</button>
        ) : activeSection === "Yetkazib beruvchilar" ? (
          <button type="button" onClick={openCreateSupplierModal}><Icon name="plus" />Yetkazib beruvchi</button>
        ) : activeSection === "Clientlar" ? (
          <button type="button" onClick={openCreateCustomerModal}><Icon name="plus" />Mijoz qo'shish</button>
        ) : (
          <div />
        )}
        <button type="button" className="theme-toggle-btn" onClick={onToggleTheme}>
          {theme === "dark" ? "Kunduz" : "Kechki"}
        </button>
      </div>
    </header>
  );
}
