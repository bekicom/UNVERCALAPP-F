import { Icon } from "../Icon";

export function Topbar({
  activeSection,
  openCategoryModal,
  openCreateSupplierModal,
  openCreateProductModal,
  openCreateExpenseModal
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
        ) : activeSection === "Yetkazib beruvchilar" ? (
          <button type="button" onClick={openCreateSupplierModal}><Icon name="plus" />Yetkazib beruvchi</button>
        ) : (
          <button type="button"><Icon name="plus" />Qo'shish</button>
        )}
      </div>
    </header>
  );
}
