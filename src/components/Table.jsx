function Table({ columns, rows, renderRow, emptyText = 'No data found.' }) {
  const MIN_ROWS = 5;
  const emptyRows = Math.max(0, MIN_ROWS - rows.length);

  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.key === 'actions' ? 'data-table__actions' : ''}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            <>
              {rows.map(renderRow)}
              {Array.from({ length: emptyRows }).map((_, index) => (
                <tr key={`empty-${index}`} className="data-table__empty-row">
                  {columns.map((col) => (
                    <td key={col.key}>&nbsp;</td>
                  ))}
                </tr>
              ))}
            </>
          ) : (
            <>
              {Array.from({ length: MIN_ROWS }).map((_, index) => (
                <tr key={`empty-${index}`} className="data-table__empty-row">
                  {index === 2 ? (
                    <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                      {emptyText}
                    </td>
                  ) : (
                    columns.map((col) => (
                      <td key={col.key}>&nbsp;</td>
                    ))
                  )}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
