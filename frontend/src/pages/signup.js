import React from 'react';
import AuthForm from '../components/AuthForm';

function Signup() {
    return <AuthForm type="signup" isAdmin={false} />;
}

export default Signup;
