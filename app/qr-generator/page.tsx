'use client'; 

import { useEffect } from 'react';

export default function RedirectToQRPage() {

    useEffect(() => {
        window.location.replace("/qr");
    }, []); 

    return <div>正在跳转，请稍候...</div>;
};