import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');

        try {
            const endpoint = `/api/${mode}`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                setMessage(mode === 'login' ? 'Login successful!' : 'Registration successful!');
            } else {
                throw new Error(data.error || 'Request failed');
            }
        } catch (err) {
            setIsError(true);
            setMessage(err.message);
        }
    };

    const checkAdmin = async () => {
        try {
            const response = await fetch('/api/admin', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (response.ok) {
                setIsError(false);
                setMessage(`ADMIN ACCESS GRANTED! Flag: ${data.flag}`);
            } else {
                throw new Error(data.error || 'Admin check failed');
            }
        } catch (err) {
            setIsError(true);
            setMessage(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1>JWT CTF Challenge</h1>

            <div className={styles.tabs}>
                <button
                    onClick={() => setMode('login')}
                    className={mode === 'login' ? styles.active : ''}
                >
                    Login
                </button>
                <button
                    onClick={() => setMode('register')}
                    className={mode === 'register' ? styles.active : ''}
                >
                    Register
                </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">
                    {mode === 'login' ? 'Login' : 'Register'}
                </button>
            </form>

            {message && (
                <p className={isError ? styles.error : styles.success}>
                    {message}
                </p>
            )}

            {token && (
                <div className={styles.tokenSection}>
                    <h3>Your JWT Token:</h3>
                    <textarea
                        value={token}
                        readOnly
                        className={styles.tokenDisplay}
                    />
                    <button onClick={checkAdmin} className={styles.adminButton}>
                        Try Admin Access
                    </button>
                </div>
            )}
        </div>
    );
}