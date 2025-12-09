import React from 'react';

type Task = { id: number, title: string, description?: string, completed: boolean };

export default function TaskList({ tasks, onToggle, onEdit, onDelete }:
  { tasks: Task[], onToggle: (t:Task) => void, onEdit: (id:number, data:Partial<Task>)=>void, onDelete: (id:number)=>void }) {
  if (!tasks.length) return <div className="mt-4 text-center text-gray-500">No tasks found</div>;
  return (
    <div className="mt-4 space-y-3">
      {tasks.map(t => (
        <div key={t.id} className="bg-white p-3 rounded shadow flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={t.completed} onChange={()=>onToggle(t)} />
              <div>
                <div className={`${t.completed ? 'line-through text-gray-500' : 'font-medium'}`}>{t.title}</div>
                {t.description && <div className="text-sm text-gray-600">{t.description}</div>}
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={()=>{ const newTitle = prompt('Edit title', t.title); if (newTitle !== null) onEdit(t.id, { title: newTitle }) }} className="px-2 py-1 border rounded">Edit</button>
            <button onClick={()=>onDelete(t.id)} className="px-2 py-1 border rounded text-red-600">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
