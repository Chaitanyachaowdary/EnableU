import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for global keyboard shortcuts
 */
export const useKeyboardShortcuts = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyPress = (e) => {
            // Only trigger if no input/textarea is focused
            const activeElement = document.activeElement;
            const isInputActive = activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.isContentEditable;

            if (isInputActive) return;

            // Ctrl/Cmd + specific keys for navigation
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'h':
                        e.preventDefault();
                        navigate('/');
                        break;
                    case 'q':
                        e.preventDefault();
                        navigate('/quizzes');
                        break;
                    case 'p':
                        e.preventDefault();
                        navigate('/profile');
                        break;
                    case 'd':
                        e.preventDefault();
                        navigate('/');
                        break;
                    default:
                        break;
                }
            }

            // Escape key to close modals (can be extended)
            if (e.key === 'Escape') {
                // This can be used by components to close modals
                const event = new CustomEvent('closeModal');
                window.dispatchEvent(event);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [navigate]);
};

export default useKeyboardShortcuts;
