import React, { useState } from 'react';
import styles from './index.module.scss';
import Img from '@icedesign/img';
import { Box, Button, Checkbox, Divider, Icon } from '@alifd/next';

const PropertyCanvas = ()=>{
    const [imageUrl, setStateImageUrl] = useState("https://img.alicdn.com/tfs/TB1vyxuwHrpK1RjSZTEXXcWAVXa-1350-900.jpg");


    return (<div className={styles.container}>
        <Box direction='column'>
            <Box direction='column' align='center' >  
                <Img
            enableAliCDNSuffix={true}
            width={200}
            height={100}
            src={imageUrl}
            type="cover"
            style={{border: '1px solid #ccc', margin: '10px', borderRadius: '5px'}}
            />
            <Button>所有风格</Button>
            </Box>
            <Divider/>
            <Box direction='row'>
                <Checkbox checked>背景颜色</Checkbox>
                <Button></Button>
            </Box>
            <Divider/>
            <Box direction='row'>
                <Checkbox checked>结构</Checkbox>
                <Button><Icon type="siweidaotu2"></Icon></Button>
            </Box>
        </Box>
    </div>);;
}

export default PropertyCanvas;  