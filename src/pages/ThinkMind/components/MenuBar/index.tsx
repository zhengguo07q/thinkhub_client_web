import React from 'react';
import { Menu, Range ,Box} from '@alifd/next';
import { store as pageStore } from 'ice/ThinkMind';
import { SetRootNode } from '@/thinkmind/interaction/SetRootNode';
import styles from './index.module.scss';
import DataCache from '@/thinkmind/dataSource/DataCache';


const MenuBar = ()=>{
    const [_, panelStatusDispatchers] = pageStore.useModel('panelStatus');

    const showAndHidePanel = (key: string, item: any, event: React.MouseEvent)=>{
        panelStatusDispatchers.setPanelStatus(key);
    };

    const setRootNode = ()=>{
        SetRootNode.getInstance<SetRootNode>().setSelect();
    };
 
    const onRangeChage = (val:any) =>{
        DataCache.setRoot(DataCache.rootId, val);
    }


    return (
        <div>
            <Box direction="row" spacing={20}>

            <Menu direction="hoz" mode="popup" className={styles.menu}  popupAutoWidth onItemClick={showAndHidePanel}>
                <Menu.Item key="leftPanel">左边</Menu.Item>
                <Menu.Item key="topPanel">上边</Menu.Item>
                <Menu.Item key="rightPanel">右边</Menu.Item>
                <Menu.Item key="setRootNode" onClick={setRootNode}>设置根</Menu.Item>
            </Menu>
            <Range className={styles.nodeLevelRange} min={1} max={5} defaultValue={DataCache.depth} onChange={onRangeChage} hasTip={false} marks={[1,5]} ></Range>
            </Box>
        </div>);
}

export default MenuBar;  