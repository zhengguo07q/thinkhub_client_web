import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Box, Button, Balloon, Divider, Icon, MenuButton, List ,VirtualList, Collapse} from '@alifd/next';
import { LayoutManager, LayoutType } from '@/thinkmind/layout/LayoutManager';
import { ChromePicker } from 'react-color'
import ThemeList from './components/ThemeList';

const Item = MenuButton.Item;

const PropertyCanvas = () => {
    const [layoutState, setLayoutState] = useState({ key: "Standard", label: "Standard" });
    const [colorState, setColorState] = useState({value:"#ffffff"});


    const onLayoutItemSelectClick = (key: string, item: any) => {
        setLayoutState({ key: key, label: item.props.title });
        LayoutManager.getInstance().setLayoutType(LayoutType[key]);
        LayoutManager.getInstance().layout();
    }

    const selectItemList = [
        { key: 'Standard', label: 'Standard' },
        { key: 'Right', label: 'Right' },
        { key: 'Left', label: 'Left' },
        { key: 'Upward', label: 'Upward' },
        { key: 'Downward', label: 'Downward' },
    ];

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
        LayoutManager.getInstance().backgroundAttr.background = colorState.value;
        LayoutManager.getInstance().layout(true);
    }

    return (<div className={styles.container}>
        <Box direction='column'>
            <ThemeList/>
            <Divider /> 
            <Box direction='row' justify='space-between' margin={[3, 18]} align='baseline'>
                <div>背景</div>
                    <Balloon closable={false}  popupClassName={styles.colorBalloon} trigger={<Button style={{backgroundColor: colorState.value}}></Button>} align="lt" alignEdge triggerType="click">
                    <ChromePicker onChangeComplete={changeBackgroundColor}/>
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