import React from 'react';
import AuthForm from '../components/AuthForm';

function AdminSignup() {
    return <AuthForm type="signup" isAdmin={true} />;
}

export default AdminSignup;
