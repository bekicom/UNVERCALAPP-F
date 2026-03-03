import { Icon } from "../Icon";

export function UsersSection({ users, onEdit }) {
  return (
    <section className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Login</th>
            <th>Rol</th>
            <th>Yaratilgan sana</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.role === "admin" ? "Admin" : "Kassir"}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
              <td className="actions-cell">
                <button type="button" className="action-btn edit" onClick={() => onEdit(u)}>
                  <Icon name="edit" />Tahrirlash
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 ? <tr><td colSpan="4">Xodim topilmadi</td></tr> : null}
        </tbody>
      </table>
    </section>
  );
}
