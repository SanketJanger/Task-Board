import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '../types'

interface Props {
  task: Task
  onDelete: (id: string) => void
}

const priorityColors: Record<string, string> = {
  low: '#10b981',
  normal: '#3b82f6',
  high: '#ef4444',
}

function getDueDateStatus(due_date?: string) {
  if (!due_date) return null
  const today = new Date()
  const due = new Date(due_date)
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'overdue'
  if (diffDays <= 2) return 'soon'
  return 'ok'
}

export default function TaskCard({ task, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const dueDateStatus = getDueDateStatus(task.due_date)

  return (
    <div ref={setNodeRef} style={style} className="task-card" {...attributes} {...listeners}>
      <div className="task-card-header">
        <span
          className="priority-badge"
          style={{ backgroundColor: priorityColors[task.priority] }}
        >
          {task.priority}
        </span>
        <button
          className="delete-btn"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
        >
          ×
        </button>
      </div>

      <p className="task-title">{task.title}</p>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.due_date && (
        <div className={`due-date due-date-${dueDateStatus}`}>
          📅 {new Date(task.due_date).toLocaleDateString()}
          {dueDateStatus === 'overdue' && <span> · Overdue</span>}
          {dueDateStatus === 'soon' && <span> · Due soon</span>}
        </div>
      )}
    </div>
  )
}