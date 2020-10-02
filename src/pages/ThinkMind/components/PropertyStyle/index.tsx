import React, { useState } from 'react';
import { Box, Button, Checkbox, Divider, Grid, Input, Select, Balloon } from '@alifd/next';
import { FontUtil, FontDesc } from './fontutil'
import { TwitterPicker } from 'react-color'
import styles from './index.module.scss';


const Option = Select.Option;
const PropertyStyle = () => {

    const [isFillCheck, setStateIsFillCheck] = useState(false);   //填充开关

    const [refresh, setRefresh] = useState(false);

    const getLine = (width: number, color: string = '#000000') => {
        return <svg xmlns="https://www.w3.org/2000/svg" version="1.1" width='100' height='30'>
            <line x1="0" y1="20" x2="100" y2="20" style={{ stroke: color, strokeWidth: width }} />
        </svg>
    }
    const getSelectFontSize = () => {
        let fontSizes: number[] = [8, 10, 12, 14, 18, 24, 36, 48, 60];
        return fontSizes.map((val: number, idx: number) => {
            return <Option value={val}>{val}</Option>;
        });
    }

    const getSelectSystemFont = () => {
        var fonts: FontDesc[] = FontUtil.getSupportFont();
        return fonts.map((val: FontDesc, idx: number) => {
            return <Option value={val.en}><span style={{ fontFamily: val.en }}>{val.ch}</span></Option>;
        })
    }

    const clickSelectSystemFont = (event: React.FocusEvent<HTMLInputElement>)=>{
        setRefresh(refresh=>!refresh);
    }

    const getColorPicker = () => {
        return <div>
            <TwitterPicker
                triangle='hide' />
        </div>
    }

    const getNodeTypePanel = () => {
        return <div>
            <TwitterPicker
                triangle='hide'
            />
        </div>
    }

    const fillColorButton = <Button style={{ margin: '5px' }} />
    const nodeTypeButton = <Button>结</Button>

    return (
        <div id='svgContainer' className={styles.container}>
            <Box align='center' justify='space-around' className={styles.areaCenter}>
                <Box direction="row" justify='space-around' align='center' spacing={35}>
                    <div className={styles.nodeContainer}>
                        <div className={styles.nodeRect}>
                            <span className={styles.nodeText}>极其重要</span>
                        </div>
                    </div>
                    <Button style={{ float: 'right' }}>选</Button>
                </Box>
                <Divider />
                <Box direction="row" justify='space-around' align='center' spacing={120}>
                    <span className={styles.fontTitle}>结构</span>

                    <Balloon trigger={nodeTypeButton} align="br" alignEdge triggerType="click" offset={[-70, 0]} closable={false} popupStyle={{}}>
                        {getNodeTypePanel()}
                    </Balloon>
                </Box>
                <Divider />
                <Box direction="row" justify='space-around' align='center' spacing={120}>
                    <span className={styles.fontTitle}>节点</span>
                    <Button>节</Button>
                </Box>
                <Box>
                    <Divider />
                    <Box direction="row" justify='space-around' align='center' spacing={80}>
                        <Checkbox checked={isFillCheck} onChange={(checked) => {
                            setStateIsFillCheck(checked);
                        }}>填充</Checkbox>
                        {isFillCheck ? <Balloon trigger={fillColorButton} triggerType="hover" align="l" alignEdge>
                            {getColorPicker()}
                        </Balloon> : <React.Fragment />}

                    </Box>
                    <Box direction="row" spacing={80}>
                        <Checkbox>边框</Checkbox>
                    </Box>
                    <Box direction="row" justify='space-around' align='center' spacing={65}>
                        <Checkbox>固定宽度</Checkbox><Input style={{ width: '50px' }}>300</Input>
                    </Box>
                </Box>
                <Divider />
                {/*** 
                <Box>
                    <span className={styles.fontTitle}>文本</span>
                    <Box>
                        <Select onFocus={clickSelectSystemFont}>
                            {getSelectSystemFont()}
                        </Select>
                        <Button>颜</Button>
                    </Box>
                    <Box>
                        <Button.Group size='small'>
                            <Button style={{ width: '33px' }}><span style={{ fontWeight: 'bold' }}>B</span></Button>
                            <Button style={{ width: '33px' }}><span style={{ fontStyle: 'italic' }}>I</span></Button>
                            <Button style={{ width: '33px' }}><span style={{ textDecoration: 'line-through' }}>S</span></Button>
                            <Button style={{ width: '33px' }}><span style={{}}>Tt</span></Button>
                        </Button.Group>
                        <Select.AutoComplete style={{ width: '60px' }} >
                            {getSelectFontSize()}
                        </Select.AutoComplete>
                    </Box>
                    <Box>
                        <Button.Group size='small'>
                            <Button style={{ width: '33px' }}><span style={{ fontWeight: 'bold' }}>B</span></Button>
                            <Button style={{ width: '33px' }}><span style={{ fontStyle: 'italic' }}>I</span></Button>
                            <Button style={{ width: '33px' }}>S</Button>
                        </Button.Group>
                    </Box>
                </Box>
                
                <Divider />
                <Box>
                    <span className={styles.fontTitle}>文本</span>
                    <Box>
                        <Select defaultValue={getLine(1)}>
                            <Option value="1">{getLine(1)}</Option>
                            <Option value="2">{getLine(2)}</Option>
                            <Option value="3">{getLine(3)}</Option>
                            <Option value="4">{getLine(4)}</Option>
                            <Option value="5">{getLine(5)}</Option>
                        </Select>
                    </Box>
                </Box>
                */}
            </Box>
        </div>
    );
}

export default PropertyStyle;  