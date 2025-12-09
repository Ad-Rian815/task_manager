import React, { useState } from 'react';

export default function TaskForm({ onCreate }: { onCreate: (t:{title:string, description?:string}) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onCreate({ title: title.trim(), description: description.trim() });
    setTitle(''); setDescription('');
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      <div className="flex gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" className="flex-1 p-2 border rounded" />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
      </div>
      <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description (optional)" className="mt-2 w-full p-2 border rounded" />
    </form>
  );
}
