import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ColumnType, Task } from '../types'
import TaskCard from './TaskCard'

interface Props {
  column: ColumnType
  tasks: Task[]
  onDelete: (id: string) => void
}

const columnColors: Record<string, string> = {
  todo: '#6366f1',
  in_progress: '#f59e0b',
  in_review: '#3b82f6',
  done: '#10b981',
}

export default function Column({ column, tasks, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div
      className={`column ${isOver ? 'column-over' : ''}`}
      style={{ '--col-color': columnColors[column.id] } as React.CSSProperties}
    >
      <div className="column-header">
        <div className="column-title">
          <span className="column-dot" />
          <h2>{column.title}</h2>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-body" ref={setNodeRef}>
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet</p>
              <span>Drag a task here or create one</span>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard key={task.id} task={task} onDelete={onDelete} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}