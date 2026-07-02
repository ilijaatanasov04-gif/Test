import { getCategoryColor } from './helpers'

type CategoryPillProps = {
  name: string
}

export function CategoryPill({ name }: CategoryPillProps) {
  const color = getCategoryColor(name)
  return (
    <span className="cat-pill" title={name}>
      <span className="cat-dot" style={{ background: color }} />
      {name}
    </span>
  )
}
