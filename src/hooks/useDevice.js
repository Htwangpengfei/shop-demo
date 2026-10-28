import { useEffect, useState } from 'react';

/**
 * 判断当前设备是手机还是 PC
 * 同时监听窗口宽度变化，实现响应式
 */
export default function useDevice() {
  const [isMobile, setIsMobile] = useState(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const ua = navigator.userAgent;
    const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);
    return width < 768 || isMobileUA;
  });

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { isMobile, isPC: !isMobile };
}
