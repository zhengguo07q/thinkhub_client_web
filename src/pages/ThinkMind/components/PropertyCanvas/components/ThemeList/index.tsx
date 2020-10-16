import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import Img from '@icedesign/img';
import { Box, Button,  List } from '@alifd/next';
import { ThemeManagerInstance } from '@/thinkmind/config/ThemeManager';
import { TypeUtil } from '@/thinkmind/util/TypeUtil';
import { ThemeDesc } from '@/thinkmind/config/Theme';
import { LayoutManager } from '@/thinkmind/layout/LayoutManager';
import { EditorNode } from '@/thinkmind/interaction';


const ThemeList = () => {
    const [themeListState, setThemeListState] = useState([ThemeManagerInstance.getThemeDesc()]);
    const [activeKey, setActiveKey] = useState("");
    const [blurKey, setBlurKey] = useState("");

    const onThemeListShowClick = () => {
        if (themeListState.length == 1) {
            setThemeListState(TypeUtil.JsonCopy(ThemeManagerInstance.themeList)); //显示所有的主题
        } else {
            setThemeListState([ThemeManagerInstance.getThemeDesc()]); //显示一个主题
        }
    }

    const onImgMouseEnter = (key:string)=>{
        if(key == activeKey){return;}
        setBlurKey(key);
    }

    const onMouseLeave = (key:string)=>{
        if(key == activeKey){return;}
        setBlurKey("");
    }

    const onMouseClick = (key:string) =>{
        setActiveKey(key);
        ThemeManagerInstance.setCacheTheme(key);
        EditorNode.getInstance<EditorNode>().updateTheme();
        //更换主题
    }

    const onMouseDbClick = (key:string) =>{
        onMouseClick(key);
        onThemeListShowClick();
    }

    /**
     * 获得样式列表
     */
    const getStyleList = () => {
        return themeListState.map((item:ThemeDesc) => {
            return <List.Item key={item.id} style={{ padding: '5px' }}>
                <Box padding={0} onMouseEnter={onImgMouseEnter.bind(this, item.id)} onMouseLeave={onMouseLeave.bind(this, item.id)} onClick={onMouseClick.bind(this, item.id)} onDoubleClick={onMouseDbClick.bind(this, item.id)}>
                    <Img
                        className={activeKey == item.id? styles.imageActive:blurKey == item.id? styles.imageBlur: styles.image} 
                        width={200}
                        height={100}
                        src={item.img}
                        type="cover"
                    />
                    <span className={styles.themeName}>{item.name}</span>
                </Box>
            </List.Item>
        });
    }


    return (
        <Box direction='column' align='center' margin={0} padding={0}>
            <List divider={false}>
                {getStyleList()}
            </List>
            <Button onClick={onThemeListShowClick}>所有风格</Button>
        </Box>
    );;
}

export default ThemeList;  