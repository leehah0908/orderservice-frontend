import { Button, Card, CardContent, CardHeader, Dialog, Grid, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const navigate = useNavigate();
    const { onLogin } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const doLogin = async (e) => {
        const loginData = {
            email,
            password,
        };

        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const data = await res.json();

        if (res.status === 200) {
            alert('로그인 성공');
            const token = data.result.token;
            const userId = data.result.user_id;
            const role = jwtDecode(token).role;

            onLogin(token, userId, role);
            navigate('/');
        } else {
            alert(data.statusMessage);
        }
    };

    return (
        <Grid container justifyContent='center'>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardHeader title='로그인' style={{ textAlign: 'center' }} />
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                doLogin();
                            }}
                        >
                            <TextField
                                label='Email'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                margin='normal'
                                required
                            />
                            <TextField
                                label='Password'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                margin='normal'
                                required
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button color='secondary' fullWidth>
                                        비밀번호 변경
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type='submit' color='primary' variant='contained' fullWidth>
                                        로그인
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>

            {/* 비밀번호 변경 모달 */}
            {/* <Dialog
                open={resetPassword}
                onClose={() => setResetPassword(false)}
            >
                <ResetPasswordModal
                    handleClose={() => setResetPassword(false)}
                />
            </Dialog> */}
        </Grid>
    );
};

export default Login;
