import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (err) {
            setMessage('If that email exists, a reset link has been sent.');
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
                    Reset your password
                </h1>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email and we'll send you a link to reset your password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {message && (
                            <div
                                role="status"
                                aria-live="polite"
                                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative"
                            >
                                {message}
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
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus-visible-custom 
                                    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500 focus-visible-custom rounded p-1"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;
