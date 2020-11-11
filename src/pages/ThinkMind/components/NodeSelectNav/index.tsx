import React, { useEffect, useState, MouseEvent } from 'react';
import { Tab, List, Button } from '@alifd/next';

import { MindTabType, MindData } from '@/thinkmind/dataSource/MindData';
import { TypeUtil } from '@/thinkmind/util/TypeUtil';
import { EventManager, EventType } from '@/thinkmind/util/Event'

import styles from './index.module.scss';
import DataCache from '@/thinkmind/dataSource/DataCache';

const NodeSelectNav = () => {
    //添加监听器
    useEffect(() => {
        EventManager.addListener(EventType.MindDataSetRootNode, mindDataSetRootNode)
        return (() => { EventManager.removeListener(EventType.MindDataSetRootNode, mindDataSetRootNode) });
    }, []);

    //载完启动刷新
    const [refresh, setRefresh] = useState(false);

    
    const mindDataSetRootNode = () => {
        setRefresh(refresh=>!refresh);
    }

    //点击节点，打开新的导图
    const clickMindNode = (event: MouseEvent) => {
        DataCache.setRoot((event.currentTarget as Element).id);
    }

    //刷新数据
    const getCurrentMindDatas = () => {
        return DataCache.cacheSiblings.map(data => { return <List.Item key={data.id}><Button className={styles.button} text type="primary" id={data.id} onClick={clickMindNode}>{TypeUtil.getShortTxt(data.content)}</Button></List.Item> })
    };

    const getTabMindDatas = (tabType:MindTabType)=>{
        let refList:MindData[] = DataCache.getReference(tabType);
        return refList.map(data => { return <List.Item key={data.id}><Button className={styles.button} text type="primary" id={data.id} onClick={clickMindNode}>{TypeUtil.getShortTxt(data.content)}</Button></List.Item> });
    }

    const ChangeTab = (tabType:MindTabType) =>{
        setRefresh(refresh=>!refresh);
    }

    return (<div className={styles.container}> 
        <Tab shape="text" onChange={ChangeTab}>
            <Tab.Item title="当前" key="CURRENT">
                <div >
                    <List size="small">
                        {getCurrentMindDatas()}
                    </List>
                </div>
            </Tab.Item>
            <Tab.Item title="收藏" key="COLLECT">
                <List size="small">
                    {getTabMindDatas(MindTabType.COLLECT)}
                </List>
            </Tab.Item>
            <Tab.Item title="最近" key="RECENT">
                <List size="small">
                    {getTabMindDatas(MindTabType.RECENT)}
                </List>
            </Tab.Item>
        </Tab>
    </div>);
}

export default NodeSelectNav;
