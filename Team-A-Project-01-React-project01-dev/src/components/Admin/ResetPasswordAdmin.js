import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import '../styles/ResetPasswordAdmin.css';

const ResetPasswordAdmin = () => {
    const location = useLocation();
    const { username } = location.state || {};
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            const errorMessage = 'New password and confirm password do not match.';
            setMessage(errorMessage);
            toast.error(errorMessage, {
                autoClose: 5000,
            });
            return;
        }

        try {
            // Fetch user by username
            const userResponse = await axios.get('http://localhost:8080/api/users/by-username', {
                params: { username }
            });

            const user = userResponse.data;

            // Check if old password is correct
            if (user.password !== oldPassword) {
                const errorMessage = 'Old password is incorrect.';
                setMessage(errorMessage);
                toast.error(errorMessage, {
                    autoClose: 5000,
                });
                return;
            }

            // Reset the password
            const resetResponse = await axios.put(`http://localhost:8080/api/users/${user.userid}/password`, null, {
                params: { newPassword }
            });

            toast.success('Password has been successfully Reset!', {
                autoClose: 3000,
            });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');

            console.log('Response Data:', resetResponse.data);

        } catch (error) {
            const errorMessage = 'An error occurred while resetting the password.';
            setMessage(errorMessage);
            toast.error(errorMessage, {
                autoClose: 5000,
            });
            console.error(errorMessage, error);
        }
    };

    return (
        <div className="reset-password-wrapper">
            <h2 className="reset-password-header"><b>Reset Password</b></h2>
            <form onSubmit={handleResetPassword} className="reset-password-form-container">
                <label htmlFor="reset-old-password" className="reset-password-field-label">Old Password:</label>
                <input
                    type="password"
                    id="reset-old-password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="reset-password-field-input"
                    required
                />
                <label htmlFor="reset-new-password" className="reset-password-field-label">New Password:</label>
                <input
                    type="password"
                    id="reset-new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="reset-password-field-input"
                    required
                />
                <label htmlFor="reset-confirm-password" className="reset-password-field-label">Confirm Password:</label>
                <input
                    type="password"
                    id="reset-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="reset-password-field-input"
                    required
                />
                <button type="submit" className="reset-password-submit-button">Reset Password</button>
            </form>
            {message && <p className="reset-password-notification">{message}</p>}
        </div>
    );
};

export default ResetPasswordAdmin;