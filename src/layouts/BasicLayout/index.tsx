import React, { useDebugValue, useEffect, useRef, useState } from 'react';
import { Shell, ConfigProvider } from '@alifd/next';
import { store } from 'ice';
import Header from './components/Header';
import Footer from './components/Footer';
import Notice from './components/Notice';
import HeaderAvatar from './components/HeaderAvatar';
import RegisterAvatar from './components/RegisterAvatar';
import styles from './index.module.scss';

export let SizeContext = React.createContext({ width: 100, height: 100 });//这里定义大小上下文

(function () {
    const throttle = function (type: string, name: string, obj: Window = window) {
        let running = false;

        const func = () => {
            if (running) {
                return;
            }

            running = true;
            requestAnimationFrame(() => {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };

        obj.addEventListener(type, func);
    };

    if (typeof window !== 'undefined') {
        throttle('resize', 'optimizedResize');
    }
})();


interface IGetDevice {
    (width: number): 'phone' | 'tablet' | 'desktop';
}
export default function BasicLayout({ children, }: { children: React.ReactNode; }) {
    const getDevice: IGetDevice = width => {
        const isPhone =
            typeof navigator !== 'undefined' &&
            navigator &&
            navigator.userAgent.match(/phone/gi);

        if (width < 680 || isPhone) {
            return 'phone';
        } else if (width < 1280 && width > 680) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    };

    const [device, setDevice] = useState(getDevice(NaN));
    const [size, setSize] = useState({ width: 0, height: 0, contextWidth: 0, contextHeight: 0 });
    const [userState] = store.useModel('user');

    const footerEl = useRef(null);
    const headerEl = useRef(null);

    if (typeof window !== 'undefined') {
        window.addEventListener('optimizedResize', e => {
            const deviceWidth =
                (e && e.target && (e.target as Window).innerWidth) || NaN;
            setDevice(getDevice(deviceWidth));
        });
    }

    useEffect(() => {
        let deviceWidth = window.innerWidth;
        let deviceHeight = window.innerHeight;
        let contextWidth = deviceWidth;
        let contextHeight = deviceHeight;

        if (headerEl.current != null && headerEl.current != null) {
            let footerRef =  (footerEl.current as any).refs.footerRef as HTMLElement;
            let marginTop = parseInt(window.getComputedStyle(footerRef, null).getPropertyValue('margin-top'));
            let marginBottom = parseInt(window.getComputedStyle(footerRef, null).getPropertyValue('margin-bottom'));
            if(isNaN(marginTop)){
                marginTop = 0;
            }
            if(isNaN(marginBottom)){
                marginBottom = 0;
            }
            contextHeight = deviceHeight - (headerEl.current as any).refs.headerRef.clientHeight - footerRef.clientHeight - marginBottom - marginTop;
        }
        
        setSize({ width: deviceWidth, height: deviceHeight, contextWidth: contextWidth, contextHeight: contextHeight });
    }, []);

    return (
        <ConfigProvider device={device}>
            <SizeContext.Provider value={{ width: size.contextWidth, height: size.contextHeight }}>
                <Shell type="brand" style={{ backgroundColor: '#f5f5f5' }}>
                    <Shell.Branding>
                        <Header ref={headerEl}></Header>

                    </Shell.Branding>

                    {userState.isLogin ?
                        <Shell.Action >
                            <Notice />
                            <HeaderAvatar />
                        </Shell.Action> :
                        <Shell.Action >
                            <RegisterAvatar />
                        </Shell.Action>}
                    <Shell.Content className={styles.shellContext}>{children}</Shell.Content>
                    <Shell.Footer className={styles.shellFooter}> 
                        <Footer ref={footerEl} />
                    </Shell.Footer>

                </Shell>
            </SizeContext.Provider>
        </ConfigProvider>
    );
}
