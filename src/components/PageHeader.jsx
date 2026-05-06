import './PageHeader.css';
function PageHeader({ title }) {
  const segments = title.split('>').map((segment) => segment.trim()).filter(Boolean)

  return (
    <div className="page-header">
      {segments.length > 1 ? (
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol className="breadcrumb__list">
            {segments.map((segment, index) => {
              const isCurrent = index === segments.length - 1

              return (
                <li
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`breadcrumb__item ${isCurrent ? 'breadcrumb__item--current' : ''}`}
                  key={`${segment}-${index}`}
                >
                  {segment}
                </li>
              )
            })}
          </ol>
        </nav>
      ) : null}
    </div>
  )
}

export default PageHeader
