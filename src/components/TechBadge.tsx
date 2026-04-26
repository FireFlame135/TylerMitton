// src/components/TechBadge.tsx
/**
 * TechBadge component displays technology badges with text only.
 * Renders a pill-shaped badge with centered text and no icons or tooltips.
 */

interface TechBadgeProps {
  name: string
}

const TechBadge = ({ name }: TechBadgeProps) => {
  return (
    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors duration-200 cursor-default">
      {name}
    </div>
  )
}

export default TechBadge
