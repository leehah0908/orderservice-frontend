import React, { useContext } from 'react';
import AuthContext from '../context/UserContext';
import { Navigate } from 'react-router-dom';

// 라우터쪽에서 로그인 여부나 역할을 검사하는 기능을 담당하는 PrivateRouter 생성
function PrivateRouter({ element, requiredRole }) {
    const { isLoggedIn, userRole, isInit } = useContext(AuthContext);

    if (!isInit) return <div>Loading...</div>;

    if (!isLoggedIn) {
        alert('로그인을 해주세요');
        // to: 보내고 싶은 페이지 렌더링 주소
        // replace: 사용자가 뒤로가기 버튼을 눌러도 이전 페이지로 돌아가지 않게 됨
        return <Navigate to='/login' replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        alert('접근 권한이 없습니다.');
        return <Navigate to='/' replace />;
    }

    return element;
}

export default PrivateRouter;
