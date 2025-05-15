import { useState } from 'react';

export default function Home() {
    const [action, setAction] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [adminData, setAdminData] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = action === 'login' ? '/api/login' : '/api/register';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    const checkAdmin = async () => {
        try {
            const response = await fetch('/api/admin', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (response.ok) {
                setAdminData(data);
            } else {
                setError(data.error || 'Admin access denied');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>User Portal</h1>

            <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => setAction('login')}>Login</button>
                <button onClick={() => setAction('register')}>Register</button>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">{action === 'login' ? 'Login' : 'Register'}</button>
            </form>

            {token && (
                <div style={{ margin: '1rem 0' }}>
                    <h3>Your Token:</h3>
                    <textarea
                        readOnly
                        value={token}
                        style={{ width: '100%', minHeight: '100px' }}
                    />
                    <button onClick={checkAdmin}>Check Admin Access</button>
                </div>
            )}

            {adminData && (
                <div style={{ margin: '1rem 0', color: 'green' }}>
                    <h2>Admin Dashboard</h2>
                    <p>{adminData.message}</p>
                    <p><strong>Flag:</strong> {adminData.flag}</p>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}