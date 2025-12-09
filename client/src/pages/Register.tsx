import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name })
      });
      localStorage.setItem('token', res.token);
      nav('/tasks');
    } catch (err: any) {
      setErr(err?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name (optional)" className="w-full p-2 border rounded" />
        <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded" />
        {err && <div className="text-red-600">{err}</div>}
        <button className="w-full py-2 bg-green-600 text-white rounded">Create account</button>
      </form>
      <div className="mt-3 text-sm">
        Already have an account? <a className="text-blue-600" href="/login">Login</a>
      </div>
    </div>
  );
}
