export function PlaceholderSection({ title = "Bu bo'lim keyin to'ldiriladi", description = "" }) {
  return (
    <section className="table-wrap">
      <table>
        <tbody>
          <tr>
            <td>
              <strong>{title}</strong>
              {description ? <p style={{ marginTop: 8 }}>{description}</p> : null}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
