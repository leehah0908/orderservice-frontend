import { Card, CardContent, CardHeader, Container, Grid, Table, TableBody, TableCell, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/UserContext';
import axiosInstance from '../config/axios-config';

const Mypage = () => {
    const { userRole } = useContext(AuthContext);
    const [memberInfoList, setMemberInfoList] = useState([]);

    const isAdmin = userRole === 'ADMIN';

    useEffect(() => {
        // 회원정보 불러오기
        const fetchMemberInfo = async () => {
            try {
                // if (!isAdmin) {
                //     const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/list`);
                //     setMemberInfoList(res.data.result);
                // } else {

                // const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/myinfo`, {
                //     headers: {
                //         Authorization: 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
                //     },
                // });

                const res = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/user/myinfo`);

                setMemberInfoList([
                    { key: '이름', value: res.data.result.nickname },
                    { key: '이메일', value: res.data.result.email },
                    { key: '도시', value: res.data.result.address?.city || '등록 전' },
                    { key: '상세 주소', value: res.data.result.address?.street || '등록 전' },
                    { key: '우편 번호', value: res.data.result.address?.zipCode || '등록 전' },
                ]);

                // }
            } catch (e) {}
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
                                <TableBody>
                                    {memberInfoList.map((element, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{element.key}</TableCell>
                                            <TableCell>{element.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
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
