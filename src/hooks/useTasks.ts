import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Task, Status } from '../types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        await supabase.auth.signInAnonymously()
      }
      fetchTasks()
    }
    initAuth()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) setError(error.message)
    else setTasks(data || [])
    setLoading(false)
  }

  const createTask = async (task: {
    title: string
    description?: string
    priority: string
    due_date?: string
  }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, status: 'todo', user_id: user.id }])
      .select()
      .single()

    if (error) setError(error.message)
    else setTasks(prev => [...prev, data])
  }

  const updateTaskStatus = async (taskId: string, status: Status) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)

    if (error) setError(error.message)
    else setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, status } : t)
    )
  }

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) setError(error.message)
    else setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  return { tasks, loading, error, createTask, updateTaskStatus, deleteTask }
}