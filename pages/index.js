import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [captchaCode, setCaptchaCode] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [token, setToken] = useState('');
    const [editedToken, setEditedToken] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTokenEditable, setIsTokenEditable] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadResult, setUploadResult] = useState('');

    // Generate CAPTCHA
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(result);
        setCaptchaInput('');
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');
        setIsLoading(true);

        try {
            // Validation
            if (mode === 'register') {
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                if (captchaInput.toUpperCase() !== captchaCode) {
                    throw new Error('Invalid CAPTCHA');
                }
                if (!avatar) {
                    throw new Error('Avatar image is required');
                }
            }

            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            if (mode === 'register' && avatar) {
                formData.append('avatar', avatar);
            }

            const endpoint = `/api/${mode}`;
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                if (mode === 'register') {
                    setToken(data.token);
                    setEditedToken(data.token);
                    setMessage('Registration successful! Token granted.');
                } else {
                    setMessage('Login successful! Please register to receive a token.');
                }
            } else {
                throw new Error(data.error || 'Request failed');
            }
        } catch (err) {
            setIsError(true);
            setMessage(err.message);
            if (mode === 'register') {
                generateCaptcha();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const checkAdmin = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin', {
                headers: { Authorization: `Bearer ${isTokenEditable ? editedToken : token}` },
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

    const handleTokenEdit = () => {
        setIsTokenEditable(!isTokenEditable);
        if (!isTokenEditable) {
            setEditedToken(token);
        }
    };

    const handleFileUpload = async () => {
        if (!uploadFile) {
            setUploadResult('Please select a file first');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', uploadFile);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setUploadResult(data.message || 'File processed successfully');
        } catch (err) {
            setUploadResult(`Upload failed: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1>Secure Portal</h1>
                    <p>Access your secure workspace</p>
                </div>

                <div className={styles.tabs}>
                    <button
                        onClick={() => setMode('login')}
                        className={mode === 'login' ? styles.active : ''}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setMode('register')}
                        className={mode === 'register' ? styles.active : ''}
                    >
                        Create Account
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Username</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {mode === 'register' && (
                        <>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Confirm Password</label>
                                <input
                                    type="password"
                                    className={styles.input}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Avatar Image</label>
                                <div className={styles.fileUpload}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setAvatar(e.target.files[0])}
                                        required
                                    />
                                    <svg className={styles.fileUploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <div className={styles.fileUploadText}>
                                        <strong>Choose an image</strong> or drag it here
                                        <br />
                                        <small>PNG, JPG up to 10MB</small>
                                    </div>
                                </div>
                                {avatar && (
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#48bb78' }}>
                                        Selected: {avatar.name}
                                    </p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Security Verification</label>
                                <div className={styles.captcha}>
                                    <div className={styles.captchaCode}>{captchaCode}</div>
                                    <input
                                        type="text"
                                        className={styles.captchaInput}
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                        placeholder="Enter code"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.refreshCaptcha}
                                        onClick={generateCaptcha}
                                        title="Refresh CAPTCHA"
                                    >
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {isLoading && (
                    <div className={styles.loading}>
                        <div className={styles.loadingSpinner}></div>
                        <span>Processing...</span>
                    </div>
                )}

                {message && (
                    <div className={`${styles.message} ${isError ? styles.error : styles.success}`}>
                        {message}
                    </div>
                )}

                {token && (
                    <div className={styles.tokenContainer}>
                        <div className={styles.tokenHeader}>
                            <h3>Access Token</h3>
                            <button
                                onClick={handleTokenEdit}
                                className={styles.editBtn}
                            >
                                {isTokenEditable ? 'Lock' : 'Edit'}
                            </button>
                        </div>
                        <textarea
                            value={isTokenEditable ? editedToken : token}
                            onChange={(e) => setEditedToken(e.target.value)}
                            readOnly={!isTokenEditable}
                            className={`${styles.tokenDisplay} ${isTokenEditable ? styles.editable : ''}`}
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

                <div className={styles.uploadSection}>
                    <div className={styles.uploadHeader}>
                        <h3>File Analysis Tool</h3>
                        <span className={styles.badge}>BETA</span>
                    </div>
                    <p className={styles.uploadDescription}>
                        Upload any file for advanced security analysis. Our system supports all file types 
                        and provides detailed metadata extraction and threat assessment.
                    </p>
                    <div className={styles.fileUpload}>
                        <input
                            type="file"
                            onChange={(e) => setUploadFile(e.target.files[0])}
                        />
                        <svg className={styles.fileUploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className={styles.fileUploadText}>
                            <strong>Select file for analysis</strong>
                            <br />
                            <small>All formats supported • Advanced scanning</small>
                        </div>
                    </div>
                    {uploadFile && (
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#667eea' }}>
                            Ready to analyze: {uploadFile.name}
                        </p>
                    )}
                    <button
                        onClick={handleFileUpload}
                        className={styles.uploadBtn}
                        disabled={isLoading || !uploadFile}
                    >
                        Analyze File
                    </button>
                    {uploadResult && (
                        <div className={styles.uploadResult}>
                            {uploadResult}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}