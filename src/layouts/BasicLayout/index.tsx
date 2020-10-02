import React, { useState } from 'react';
import { Shell, ConfigProvider, Avatar } from '@alifd/next';
import { store } from 'ice';
import Header from './components/Header';
import Footer from './components/Footer';
import Notice from './components/Notice';
import HeaderAvatar from './components/HeaderAvatar';
import RegisterAvatar from './components/RegisterAvatar';

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
    const [userState] = store.useModel('user');

    if (typeof window !== 'undefined') {
        window.addEventListener('optimizedResize', e => {
            const deviceWidth =
                (e && e.target && (e.target as Window).innerWidth) || NaN;
            setDevice(getDevice(deviceWidth));
        });
    }

    return (
        <ConfigProvider device={device}>
            <Shell
                type="brand"
                style={{
                    minHeight: '100vh',
                }}
            >
                <Shell.Branding>
                    <Header></Header>

                </Shell.Branding>
                <Shell.Navigation
                    direction="hoz"
                    style={{
                        marginRight: 10,
                    }}
                />
                {userState.isLogin ? 
                <Shell.Action >
                    <Notice />
                    <HeaderAvatar />
                </Shell.Action> :
                <Shell.Action >
                    <RegisterAvatar/>
                </Shell.Action>}


                <Shell.Content style={{ padding: '0px' }}>{children}</Shell.Content>

                <Shell.Footer>
                    <Footer />
                </Shell.Footer>
            </Shell>
        </ConfigProvider>
    );
}
