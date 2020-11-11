import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Box, Button, Balloon, Divider, MenuButton} from '@alifd/next';
import { LayoutManagerInstance, LayoutType } from '@/thinkmind/layout/LayoutManager';
import { ChromePicker } from 'react-color'
import ThemeList from './components/ThemeList';
import LocalStorageUtil from '@/thinkmind/util/LocalStorageUtil';
import { ThemeCurrentInstance } from '@/thinkmind/config/ThemeCurrent';
import { ThemeManagerInstance } from '@/thinkmind/config/ThemeManager';

const Item = MenuButton.Item;

const PropertyCanvas = () => {
    const KEY_LAYOUT:string = "key_layout";

    const selectItemList = [
        { key: 'Standard', label: 'Standard' },
        { key: 'Right', label: 'Right' },
        { key: 'Left', label: 'Left' },
        { key: 'Upward', label: 'Upward' },
        { key: 'Downward', label: 'Downward' },
    ];
    
    const getLayout = ()=>{
        let layout:LayoutType;
        let layoutStorage = LocalStorageUtil.getItem(KEY_LAYOUT);
        if(layoutStorage != undefined){
            layout = LayoutType[layoutStorage];
        }else{
            layout = LayoutType.Standard;
        }
        let ret;
        selectItemList.forEach((item)=>{
            if(item.key == LayoutType[layout]){
                ret = item;
            }
        })
        return ret;
    }
    
    const [layoutState, setLayoutState] = useState(getLayout());
    const [colorState, setColorState] = useState({value:ThemeManagerInstance.getTheme().background});

    const onLayoutItemSelectClick = (key: string, item: any) => {
        setLayoutState({ key: key, label: item.props.title });
        LayoutManagerInstance.setLayoutType(LayoutType[key]);
        LayoutManagerInstance.layout();
        LocalStorageUtil.setItem(KEY_LAYOUT, key);
    }

    /**
     * 得到选择的项
     */
    const getSelectItem = () => {
        return selectItemList.map((item) => {
            return <Item key={item.key}>{item.label}</Item>
        });
    }

    /**
     * 改变背景颜色
     * @param color 
     */
    const changeBackgroundColor = (color)=>{
        setColorState({value:color.hex});
        ThemeCurrentInstance.setBackgroundColor(color.hex);
        LayoutManagerInstance.backgroundAttr.background = color.hex;
        LayoutManagerInstance.layout(true);
    }

    return (<div className={styles.container}>
        <Box direction='column'>
            <ThemeList/>
            <Divider /> 
            <Box direction='row' justify='space-between' margin={[3, 18]} align='baseline'>
                <div>背景</div>
                    <Balloon closable={false}  popupClassName={styles.colorBalloon} trigger={<Button style={{backgroundColor: colorState.value}}></Button>} align="lt" alignEdge triggerType="click">
                    <ChromePicker onChangeComplete={changeBackgroundColor} color={colorState.value}/>
                </Balloon>
            </Box>

            <Box direction='row' justify='space-between' margin={[3, 18]} align='baseline'>
                <div >布局</div>
                <MenuButton type="primary" label={layoutState.label} defaultSelectedKeys={[layoutState.key]} selectMode='single' onItemClick={onLayoutItemSelectClick}>
                    {getSelectItem()}
                </MenuButton>
            </Box>
            <Divider />
            
        </Box>
    </div>);;
}

export default PropertyCanvas;  