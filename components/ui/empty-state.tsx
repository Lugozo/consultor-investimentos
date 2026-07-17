import { Card } from '@/components/ui/card'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <Card className="text-center py-12">
      {icon && (
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
      {action}
    </Card>
  )
}
