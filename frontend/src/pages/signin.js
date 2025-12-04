import React from 'react';
import AuthForm from '../components/AuthForm';

function Signin() {
    return <AuthForm type="signin" isAdmin={false} />;
}

export default Signin;
