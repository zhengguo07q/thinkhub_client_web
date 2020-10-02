import React, { useEffect, useState } from 'react';
import { SceneScreen } from '@/thinkmind/scene/SceneScreen';
import styles from './index.module.scss';
import { EventManager, EventType } from '@/thinkmind/util/Event';
import { Message } from '@alifd/next';

const SVGCancvs = () => {

    useEffect(() => {

        var svgCanvas: HTMLElement = document.getElementById('svgContainer')!;
        SceneScreen.global(svgCanvas);
    }, []);

    useEffect(() => {
        EventManager.addListener(EventType.Message, onMessage)
        return (() => { EventManager.removeListener(EventType.Message, onMessage) });
    }, []);

    const onMessage = (object:any)=>{
        Message.error(object.content);
    }

    return (
        <div id='svgContainer' className={styles.container}>
        </div>
    );
}

export default SVGCancvs;