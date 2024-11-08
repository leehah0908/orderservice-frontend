import React, { useEffect, useState } from 'react';

// UserContext 생성 -> 새로운 전역 컨텍스트 생성
const AuthContext = React.createContext({
    isLoggedIn: false, // 로그인 여부
    onLogin: () => {},
    onLogout: () => {},
    userRole: '',
    isInit: false,
});

// 위에서 생성한 Context에서 제공하는 provider 선언
// 이 Provider를 통해 자식 컴포넌트(consumer)에게 인증 상태와 관련된 값, 함수를 전달할 수 있음
export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [isInit, setIsInit] = useState(false); // 초기화 완료 상태 추가

    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (token) {
            setIsLoggedIn(true);
            setUserRole(localStorage.getItem('USER_ROLE'));
        }
        setIsInit(true); // setIsLoggedIn와 setUserRole가 완전히 세팅 된 상태를 보내주기 위해
    }, []);

    // 로그인 핸들러
    const loginHandler = (token, userId, role) => {
        // 백엔드가 넘겨준 JSON 인증 정보를 클러이언트쪽에 보관
        localStorage.setItem('ACCESS_TOKEN', token);
        localStorage.setItem('USER_ID', userId);
        localStorage.setItem('USER_ROLE', role);

        setIsLoggedIn(true);
        setUserRole(role);
    };

    // 로그아웃 핸들러
    const logoutHandler = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserRole('');
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                userRole,
                onLogin: loginHandler,
                onLogout: logoutHandler,
                isInit,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
