// 여기에서 axios 인스턴스를 생성하고,
// interceptor 기능을 활용하여, access token이 만료되었을 때 refresh token을 사용하여
// 새로운 access token을 발급받는 비동기 방식의 요청을 모듈화. (fetch는 interceptor 기능 x)
// axios 인스턴스는 token이 필요한 모든 요청에 활용 될 것입니다.

import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

/*
Axios Interceptoe는 요청 또는 응답이 처리되기 전에 실행되는 코드
요청을 수정하거나, 응답에 대한 결과 처리를 수행할 수 있음
*/

// Request용 인터셉터 설정
// 인터셉터의 use 함수는 콜백 함수 형태의 매개값을 2개 받음
// 첫번쨰 콜백은 정상동작 로직을 작성, 두번째 콜백은 과정 중에 에러가 발생할 경우 실행할 로직을 작성
axiosInstance.interceptors.request.use(
    (config) => {
        // 요청보내기 전에 일괄 처리해야 할 내용
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log(error);
        Promise.reject(error);
    },
);

// Response용 인터셉터 설정
axiosInstance.interceptors.response.use(
    // 문제가 없으면 응답 그대로 받아오기
    (response) => response,
    async (error) => {
        console.log('response interceptor 동작: ', error);

        // // 응답 실패 -> 로그인을 안한 사람
        // if (error.response.data.message === 'INVALID_AUTH') {
        //     console.log('로그인 안되어있음.');
        //     return Promise.reject(error);
        // }

        // 응답 실패 -> 로그인을 안한 사람
        if (!localStorage.getItem('ACCESS_TOKEN')) {
            console.log('로그인 안되어있음.');
            return Promise.reject(error);
        }

        // 응답 실패 -> /refresh로 요청
        // 원본 요청의 정보를 기억 -> 새 토큰 발급 후 재요청을 위해
        const originalRequest = error.config;

        // 토큰 재발급 로직 작성
        // _retry의 값이 true라면 if문 실행X -> 한번으로 제한
        if (error.response.status === 401 && !originalRequest._retry) {
            console.log('토큰 재발급 필요');

            // _retry 속성은 사용자 정의 속성입니다. 최초 요청에서는 존재하지 않습니다.
            // 만약 재요청 시에도 문제가 발생했다면 (refresh 만료 등), 더 이상 똑같은 요청을 반복해서 무한 루프에 빠지지 않도록 막아주는 역할을 합니다.
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/user/refresh`,
                    localStorage.getItem('USER_ID'), // JSON 형식으로 userId 전달
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );

                const token = res.data.result.token;
                localStorage.setItem('ACCESS_TOKEN', token); // 동일한 이름으로 데이터 덮어쓰기

                // 실패한 원본 요청에서 Authorization의 값을 새 토큰으로 바꿔놓기
                originalRequest.headers.Authorization = `Bearer ${token}`;

                // // axios 인스턴스의 기본 header Authorization을 새 토큰으로 바꿔놓기
                // axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;

                // axiosInstance를 사용해서 다시 한번 원본 요청을 보내고, 응답값은 원래 호출한 곳으로 리턴

                return axiosInstance(originalRequest);
            } catch (e) {
                console.log('refresh도 만료가 됨');
                localStorage.clear();
            }
        }

        // 재발급 요청도 거절 -> 인스턴스를 호출한 곳으로 에러 정보 리턴
        return Promise.reject(error);
    },
);

export default axiosInstance;
