import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Matrix Rain Effect
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.className = styles.matrixCanvas;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();

        const chars = "01";
        const fontSize = 18;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0afc72';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        window.addEventListener('resize', resizeCanvas);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
            document.body.removeChild(canvas);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

            const endpoint = `/api/${mode}`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                setMessage('Authentication successful');
            } else {
                throw new Error(data.error || 'Request failed');
            }
        } catch (err) {
            setIsError(true);
            setMessage(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const checkAdmin = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (response.ok) {
                setIsError(false);
                setMessage(`Admin access granted! Flag: ${data.flag}`);
            } else {
                throw new Error(data.error || 'Admin check failed');
            }
        } catch (err) {
            setIsError(true);
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>SECURE ACCESS TERMINAL</h1>
            </div>

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
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Username:</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Password:</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isLoading}
                >
                    {mode === 'login' ? 'Login' : 'Register'}
                </button>
            </form>

            {isLoading && (
                <div className={styles.loading}>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                    <span>Processing...</span>
                </div>
            )}

            {message && (
                <div className={`${styles.message} ${isError ? styles.error : ''}`}>
                    {message}
                </div>
            )}

            {token && (
                <div className={styles.tokenContainer}>
                    <div className={styles.tokenHeader}>
                        <h3>Your Token:</h3>
                    </div>
                    <textarea
                        value={token}
                        readOnly
                        className={styles.tokenDisplay}
                    />
                    <button
                        onClick={checkAdmin}
                        className={styles.adminBtn}
                        disabled={isLoading}
                    >
                        Request Admin Access
                    </button>
                </div>
            )}
        </div>
    );
}