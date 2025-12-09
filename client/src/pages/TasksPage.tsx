import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useNavigate } from 'react-router-dom';

type Task = { id: number, title: string, description?: string, completed: boolean };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all'|'completed'|'pending'>('all');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/tasks?filter=${filter}`);
      setTasks(data);
    } catch (err: any) {
      console.error(err);
      if (err?.message === 'Invalid token' || err?.message === 'Missing Authorization header') {
        // redirect to login
        localStorage.removeItem('token');
        nav('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, [filter]);

  const onCreate = async ({ title, description }: {title:string, description?:string}) => {
    const newTask = await apiFetch('/tasks', { method: 'POST', body: JSON.stringify({ title, description }) });
    setTasks(prev => [newTask, ...prev]);
  };

  const onUpdate = async (id: number, patch: Partial<Task>) => {
    const updated = await apiFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };

  const onDelete = async (id: number) => {
    await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const logout = () => {
    localStorage.removeItem('token');
    nav('/login');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <div>
            <button onClick={logout} className="px-3 py-1 border rounded">Log out</button>
          </div>
        </div>

        <TaskForm onCreate={onCreate} />

        <div className="mt-4 flex gap-2">
          <button onClick={()=>setFilter('all')} className={`px-3 py-1 rounded ${filter==='all' ? 'bg-green-600 text-white' : 'bg-white border'}`}>All</button>
          <button onClick={()=>setFilter('pending')} className={`px-3 py-1 rounded ${filter==='pending' ? 'bg-green-600 text-white' : 'bg-white border'}`}>Pending</button>
          <button onClick={()=>setFilter('completed')} className={`px-3 py-1 rounded ${filter==='completed' ? 'bg-green-600 text-white' : 'bg-white border'}`}>Completed</button>
        </div>

        {loading ? <p className="mt-4">Loading...</p> : (
          <TaskList tasks={tasks} onToggle={(t)=>onUpdate(t.id,{completed:!t.completed})} onEdit={(id, data)=>onUpdate(id,data)} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
}
