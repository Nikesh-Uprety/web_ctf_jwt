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

    // Matrix rain effect
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.className = styles.matrix;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        const interval = setInterval(draw, 30);

        return () => {
            clearInterval(interval);
            document.body.removeChild(canvas);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');
        setIsLoading(true);

        try {
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

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
                setMessage(`ADMIN ACCESS GRANTED! Flag: ${data.flag}`);
            } else {
                throw new Error(data.error || 'Admin check failed');
            }
        } catch (err) {
            setIsError(true);
            setMessage(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Attack On Hash Function Web_Challenge</h1>

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
                <button type="submit" disabled={isLoading}>
                    {mode === 'login' ? 'Login' : 'Register'}
                </button>
            </form>

            <div className={`${styles.buffer} ${isLoading ? styles.active : ''}`}>
                Processing
            </div>

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
                    <button
                        onClick={checkAdmin}
                        className={styles.adminButton}
                        disabled={isLoading}
                    >
                        Try Admin Access
                    </button>
                </div>
            )}
        </div>
    );
}