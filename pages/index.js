import { useState, useEffect } from 'react';

export default function Home() {
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Matrix animation effect
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.15';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#20c20e';
            ctx.font = `${fontSize}px monospace`;

            rainDrops.forEach((y, i) => {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, y * fontSize);

                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            });
        };

        const interval = setInterval(draw, 30);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
            document.body.removeChild(canvas);
        };
    }, []);

    // Styles
    const styles = {
        container: {
            maxWidth: '600px',
            margin: '2rem auto',
            padding: '2rem',
            backgroundColor: 'rgba(10, 10, 10, 0.85)',
            border: '1px solid #20c20e',
            borderRadius: '4px',
            boxShadow: '0 0 15px rgba(32, 194, 14, 0.4)',
            fontFamily: '"Courier New", monospace',
            position: 'relative',
            overflow: 'hidden',
            zIndex: '1'
        },
        scanline: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(to right, transparent, #20c20e, transparent)',
            animation: 'scanline 3s linear infinite'
        },
        title: {
            color: '#20c20e',
            textShadow: '0 0 8px #20c20e',
            borderBottom: '1px dashed #20c20e',
            paddingBottom: '0.5rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'normal',
            letterSpacing: '2px'
        },
        tabs: {
            display: 'flex',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #333'
        },
        tabButton: {
            background: 'transparent',
            color: '#20c20e',
            border: 'none',
            borderBottom: '2px solid transparent',
            padding: '0.5rem 1.5rem',
            cursor: 'pointer',
            fontFamily: '"Courier New", monospace',
            fontSize: '0.9rem',
            transition: 'all 0.3s',
            flex: '1',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },
        activeTab: {
            borderBottomColor: '#20c20e',
            fontWeight: 'bold',
            textShadow: '0 0 5px #20c20e',
            backgroundColor: 'rgba(32, 194, 14, 0.1)'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem'
        },
        input: {
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid #20c20e',
            color: '#20c20e',
            padding: '0.75rem',
            fontFamily: '"Courier New", monospace',
            fontSize: '0.9rem',
            outline: 'none',
            borderRadius: '2px',
            transition: 'all 0.3s'
        },
        button: {
            background: 'rgba(32, 194, 14, 0.1)',
            color: '#20c20e',
            border: '1px solid #20c20e',
            padding: '0.75rem',
            fontFamily: '"Courier New", monospace',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderRadius: '2px',
            marginTop: '0.5rem'
        },
        message: {
            padding: '0.75rem',
            borderLeft: '3px solid',
            fontFamily: '"Courier New", monospace',
            borderRadius: '2px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            margin: '1rem 0'
        },
        error: {
            color: '#ff4444',
            textShadow: '0 0 5px #ff4444',
            borderColor: '#ff4444'
        },
        success: {
            color: '#20c20e',
            textShadow: '0 0 5px #20c20e',
            borderColor: '#20c20e'
        },
        tokenSection: {
            marginTop: '1.5rem',
            border: '1px dashed #20c20e',
            padding: '1.5rem',
            position: 'relative',
            borderRadius: '2px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
        },
        tokenLabel: {
            position: 'absolute',
            top: '-10px',
            left: '15px',
            background: '#0a0a0a',
            padding: '0 10px',
            fontSize: '0.7rem',
            color: '#20c20e',
            letterSpacing: '1px'
        },
        tokenDisplay: {
            width: '100%',
            minHeight: '80px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid #20c20e',
            color: '#20c20e',
            padding: '1rem',
            fontFamily: '"Courier New", monospace',
            fontSize: '0.8rem',
            resize: 'none',
            marginBottom: '1rem',
            borderRadius: '2px',
            lineHeight: '1.5'
        },
        adminButton: {
            background: 'rgba(32, 194, 14, 0.2)',
            color: '#20c20e',
            border: '1px solid #20c20e',
            padding: '0.75rem',
            fontFamily: '"Courier New", monospace',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            width: '100%',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderRadius: '2px'
        }
    };

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
        <>
            <style jsx global>{`
                body {
                    background: #000;
                    color: #20c20e;
                    margin: 0;
                    padding: 0;
                    overflow-x: hidden;
                }
                @keyframes scanline {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100vh); }
                }
                ::selection {
                    background: #20c20e;
                    color: #000;
                }
            `}</style>

            <div style={styles.container}>
                <div style={styles.scanline}></div>
                <h1 style={styles.title}>Attack On Hash Function Web_Challenge</h1>

                <div style={styles.tabs}>
                    <button
                        onClick={() => setMode('login')}
                        style={mode === 'login' ? { ...styles.tabButton, ...styles.activeTab } : styles.tabButton}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = mode !== 'login' ? 'rgba(32, 194, 14, 0.1)' : '';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = mode === 'login' ? 'rgba(32, 194, 14, 0.1)' : 'transparent';
                        }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setMode('register')}
                        style={mode === 'register' ? { ...styles.tabButton, ...styles.activeTab } : styles.tabButton}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = mode !== 'register' ? 'rgba(32, 194, 14, 0.1)' : '';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = mode === 'register' ? 'rgba(32, 194, 14, 0.1)' : 'transparent';
                        }}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                        onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 10px rgba(32, 194, 14, 0.5)';
                            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                        }}
                        onBlur={(e) => {
                            e.target.style.boxShadow = 'none';
                            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                        onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 10px rgba(32, 194, 14, 0.5)';
                            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                        }}
                        onBlur={(e) => {
                            e.target.style.boxShadow = 'none';
                            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        }}
                    />
                    <button
                        type="submit"
                        style={styles.button}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(32, 194, 14, 0.3)';
                            e.target.style.textShadow = '0 0 8px #20c20e';
                            e.target.style.boxShadow = '0 0 10px rgba(32, 194, 14, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(32, 194, 14, 0.1)';
                            e.target.style.textShadow = 'none';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        {mode === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>

                {message && (
                    <p style={{ ...styles.message, ...(isError ? styles.error : styles.success) }}>
                        {message}
                    </p>
                )}

                {token && (
                    <div style={styles.tokenSection}>
                        <div style={styles.tokenLabel}>JWT TOKEN</div>
                        <textarea
                            value={token}
                            readOnly
                            style={styles.tokenDisplay}
                        />
                        <button
                            onClick={checkAdmin}
                            style={styles.adminButton}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(32, 194, 14, 0.4)';
                                e.target.style.textShadow = '0 0 8px #20c20e';
                                e.target.style.boxShadow = '0 0 10px rgba(32, 194, 14, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(32, 194, 14, 0.2)';
                                e.target.style.textShadow = 'none';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            Try Admin Access
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}