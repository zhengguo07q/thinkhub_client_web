import React, { useEffect, useState } from 'react';
import { SceneScreen } from '@/thinkmind/scene/SceneScreen';
import styles from './index.module.scss';
import { EventManager, EventType } from '@/thinkmind/util/Event';
import { Dialog, Message } from '@alifd/next';

const SVGCancvs = () => {

    useEffect(() => {
        var svgCanvas: HTMLElement = document.getElementById('svgContainer')!;
        SceneScreen.global(svgCanvas);
    }, []);

    useEffect(() => {
        EventManager.addListener(EventType.Message, onMessage);
        EventManager.addListener(EventType.Dialog, onDialogOpen);
        return (() => {
            EventManager.removeListener(EventType.Message, onMessage);
            EventManager.removeListener(EventType.Dialog, onDialogOpen);
        });
    }, []);

    const [visible, setVisible] = useState({ value: false });

    const onMessage = (object: any) => {
        setVisible({ value: true });
        Message.error(object.content);
    }

    const onDialogOpen = (object: any) => {

    }

    return (<div>
        <div id='svgContainer' className={styles.container}>
        </div>
    </div>


    );
}

export default SVGCancvs;