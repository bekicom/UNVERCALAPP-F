import { Icon } from "../Icon";

export function Topbar({
  activeSection,
  openCategoryModal,
  openCreateSupplierModal,
  openCreateProductModal,
  openCreateExpenseModal,
  openCreateUserModal
}) {
  return (
    <header className="topbar">
      <h1>{activeSection}</h1>
      <div className="toolbar-actions">
        {activeSection === "Mahsulotlar" ? (
          <>
            <button type="button" onClick={openCategoryModal}><Icon name="plus" />Kategoriya</button>
            <button type="button" onClick={openCreateSupplierModal}><Icon name="plus" />Yetkazib beruvchi</button>
            <button type="button" onClick={openCreateProductModal}><Icon name="plus" />Mahsulot qo'shish</button>
          </>
        ) : activeSection === "Xarajatlar" ? (
          <button type="button" onClick={openCreateExpenseModal}><Icon name="plus" />Xarajat qo'shish</button>
        ) : activeSection === "Xodimlar" ? (
          <button type="button" onClick={openCreateUserModal}><Icon name="plus" />Xodim qo'shish</button>
        ) : activeSection === "Yetkazib beruvchilar" ? (
          <button type="button" onClick={openCreateSupplierModal}><Icon name="plus" />Yetkazib beruvchi</button>
        ) : (
          <div />
        )}
      </div>
    </header>
  );
}
