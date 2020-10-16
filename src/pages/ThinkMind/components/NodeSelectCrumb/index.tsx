import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '@alifd/next';
import { EventManager, EventType } from '@/thinkmind/util/Event'
import styles from './index.module.scss';
import DataCache from '@/thinkmind/dataSource/DataCache';
import { MindData } from '@/thinkmind/dataSource/MindData';
import { TypeUtil } from '@/thinkmind/util/TypeUtil';


const NodeSelectCrumb = (props, context) => {
    useEffect(() => {
        EventManager.addListener(EventType.MindDataSetRootNode, mindDataSetRootNode)
        return (() => { EventManager.removeListener(EventType.MindDataSetRootNode, mindDataSetRootNode) });
    }, []);

    const [refresh, setRefresh] = useState(false);

    const mindDataSetRootNode = ()=>{
        setRefresh(refresh=>!refresh);
    }

    const clickItemLink = (event: React.MouseEvent<HTMLElement, MouseEvent>)=>{
        DataCache.setRoot((event.target as HTMLElement).id);
    }

    const getBreadcrumbItem = () => {
        return DataCache.cacheCrumbs.map((node:MindData)=>{
        return <Breadcrumb.Item style={{lineHeight:'22px', height:'22px', cursor:"pointer"}}  key={node.id} id={node.id} onClick={clickItemLink}>{TypeUtil.getShortTxt(node.content)}</Breadcrumb.Item>
        });
    }

    return (
        <div className={styles.container}>
            <Breadcrumb maxNode={5} >
                {getBreadcrumbItem()}
            </Breadcrumb>
        </div>
    );
};

export default NodeSelectCrumb;
