import { Button, Card, CardActions, CardContent, CardHeader, Grid, TextField } from '@mui/material';
// import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zipcode, setZipcode] = useState('');

    const navigate = useNavigate();

    const memberCreate = async (e) => {
        e.preventDefault();

        const signupData = {
            nickname,
            email,
            password,
            address: {
                city,
                street,
                zipCode: zipcode,
            },
        };

        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(signupData),
        });

        if (res.status === 201) {
            alert('회원가입 성공');
            navigate('/');
        } else {
            const data = await res.json();
            alert(data.statusMessage);
        }
    };

    return (
        <Grid container justifyContent='center'>
            <Grid item xs={12} sm={8} md={6}>
                <Card>
                    <CardHeader title='회원가입' style={{ textAlign: 'center' }} />
                    <CardContent>
                        <form onSubmit={memberCreate}>
                            <TextField
                                label='이름'
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                fullWidth
                                margin='normal'
                                required
                            />
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
                            <TextField
                                label='도시'
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                fullWidth
                                margin='normal'
                            />
                            <TextField
                                label='상세주소'
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                fullWidth
                                margin='normal'
                            />
                            <TextField
                                label='우편번호'
                                value={zipcode}
                                onChange={(e) => setZipcode(e.target.value)}
                                fullWidth
                                margin='normal'
                            />
                            <CardActions>
                                <Button type='submit' color='primary' variant='contained' fullWidth>
                                    등록
                                </Button>
                            </CardActions>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Signup;
