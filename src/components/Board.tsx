import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core'
import { COLUMNS } from '../types'
import { useTasks } from '../hooks/useTasks'
import Column from './Column'
import CreateTaskModal from './CreateTaskModal'
import { useState } from 'react'

export default function Board() {
  const { tasks, loading, error, createTask, updateTaskStatus, deleteTask } = useTasks()
  const [showModal, setShowModal] = useState(false)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as any

    const task = tasks.find(t => t.id === taskId)
    if (task && task.status !== newStatus) {
      updateTaskStatus(taskId, newStatus)
    }
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date) return false
    return new Date(t.due_date) < new Date() && t.status !== 'done'
  }).length

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>Loading your board...</p>
    </div>
  )

  if (error) return (
    <div className="error-screen">
      <p>⚠️ Something went wrong: {error}</p>
    </div>
  )

  return (
    <div className="board-wrapper">
      <header className="board-header">
        <div className="board-title">
          <h1>Task-Board</h1>
          <div className="board-stats">
            <span className="stat">{totalTasks} total</span>
            <span className="stat stat-done">{completedTasks} completed</span>
            {overdueTasks > 0 && (
              <span className="stat stat-overdue">{overdueTasks} overdue</span>
            )}
          </div>
        </div>
        <div className="board-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + New Task
          </button>
        </div>
      </header>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="board-columns">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              column={col}
              tasks={tasks.filter(t => t.status === col.id)}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </DndContext>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreate={createTask}
        />
      )}
    </div>
  )
}