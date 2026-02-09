import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await axios.post('/api/auth/register', { email, password });
            // Redirect to login on success (or improved onboarding)
            navigate('/login', { state: { message: 'Registration successful. Please log in.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" role="main">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center text-indigo-600 font-bold text-3xl" aria-label="Enable U Logo">
                    Enable U
                </div>
                <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create new account
                </h1>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        {/* Error Message Region - Screen Reader Live Region */}
                        {error && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                            >
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm focus-visible-custom"
                                    aria-invalid={error ? "true" : "false"}
                                    aria-required="true"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm focus-visible-custom"
                                    aria-invalid={error ? "true" : "false"}
                                    aria-required="true"
                                    aria-describedby="password-hint"
                                />
                            </div>
                            <p id="password-hint" className="mt-2 text-xs text-gray-500">
                                Must be at least 8 characters.
                            </p>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus-visible-custom 
                                    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500 focus-visible-custom rounded p-1"
                            >
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Signup;
