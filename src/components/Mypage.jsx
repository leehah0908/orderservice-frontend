import { Card, CardContent, CardHeader, Container, Grid, Table, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/UserContext';
import axiosInstance from '../config/axios-config';
import { useNavigate } from 'react-router-dom';

const Mypage = () => {
    const { userRole, onLogout } = useContext(AuthContext);
    const [memberInfoList, setMemberInfoList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // 회원정보 불러오기
        const fetchMemberInfo = async () => {
            try {
                const url =
                    userRole === 'ADMIN'
                        ? `${process.env.REACT_APP_API_BASE_URL}/user/list`
                        : `${process.env.REACT_APP_API_BASE_URL}/user/myinfo`;

                // const res = await axios.get(url, {
                //     headers: {
                //         Authorization: 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
                //     },
                // });

                const res = await axiosInstance.get(url);
                const data = userRole === 'ADMIN' ? res.data.result : [res.data.result]; // 일반 회원은 리스트로 오지 않기 때문에 직접 리스트로 만들기

                setMemberInfoList(
                    data.map((user) => [
                        { key: '이름', value: user.nickname },
                        { key: '이메일', value: user.email },
                        { key: '도시', value: user.address?.city || '등록 전' },
                        { key: '상세 주소', value: user.address?.street || '등록 전' },
                        { key: '우편 번호', value: user.address?.zipCode || '등록 전' },
                    ]),
                );
            } catch (e) {
                if (e.response.data?.statusMessage === 'EXPIRED_RT') {
                    alert('시간이 경과되어 재로그인이 필요합니다.');
                    onLogout();
                    navigate('/');
                } else if (e.response.data.message === 'NO_LOGIN') {
                    alert('아예 로그인 X');
                    navigate('/');
                }
            }
        };

        fetchMemberInfo();
    }, []);

    return (
        <Container>
            <Grid container justifyContent='center'>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardHeader title='회원정보' style={{ textAlign: 'center' }} />
                        <CardContent>
                            <Table>
                                {memberInfoList.map((element, index) => (
                                    <TableBody>
                                        {element.map((info, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{info.key}</TableCell>
                                                <TableCell>{info.value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                ))}
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* OrderListComponent */}
            {/* <OrderListComponent isAdmin={userRole === 'ADMIN'} /> */}
        </Container>
    );
};

export default Mypage;
