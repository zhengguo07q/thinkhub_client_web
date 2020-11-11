import React, { useRef, useState } from 'react';
import { Menu, Range, Box, Grid, NumberPicker, Message } from '@alifd/next';
import { store as pageStore } from 'ice/ThinkMind';
import { SetRootNode } from '@/thinkmind/interaction/SetRootNode';
import styles from './index.module.scss';
import DataCache from '@/thinkmind/dataSource/DataCache';
import { StorageBackupInstance } from '@/thinkmind/dataSource/BackupStorage';
import MarkdownInstance from '@/thinkmind/importAndExport/Markdown';
import { SelectNode } from '@/thinkmind/interaction';


const Row = Grid.Row;
const Col = Grid.Col;

const MenuBar = () => {
    const [_, panelStatusDispatchers] = pageStore.useModel('panelStatus');
    const inputEl = useRef(null);

    const showAndHidePanel = (key: string, item: any, event: React.MouseEvent) => {
        panelStatusDispatchers.setPanelStatus(key);
    };

    const [depth, setDepth] = useState(DataCache.getDepth());

    const setRootNode = () => {
        SetRootNode.getInstance<SetRootNode>().setSelect();
    };

    const onRangeChage = (val: any) => {
        DataCache.setRoot(DataCache.rootId, val);
        setDepth(val);
    }

    const onBackup = (val) => {
        StorageBackupInstance.backup();
    }

    const onRecover = (val) => {
        StorageBackupInstance.recover();
    }

    const onFileRead = () => {
        let input:HTMLInputElement = inputEl.current! as HTMLInputElement;
        input.click();
    }

    const onFileImport = () =>{
        let input:HTMLInputElement = document.getElementById('files')! as HTMLInputElement;
        if(input.files == null || input.files.length == 0){
            return;
        }
        let selectedFile = input.files[0];  //暂时只支持第一个文件
        var name = selectedFile.name;       
        var size = selectedFile.size;       
        console.log("文件名:" + name + "大小:" + size);
        var reader = new FileReader();      
        reader.readAsText(selectedFile);    
        reader.onload = function() {
            let content = this.result as string;
            let selectNode = SelectNode.getInstance<SelectNode>();
            if(selectNode.isSelected() == false){
                Message.warning("需要选择一个节点挂载导入内容");
            }
            let mindData = selectNode.firstSelect();
            if(mindData){
                MarkdownInstance.import(content, mindData);
            }
        }
    } 

    return (
        <div className={styles.mennContainer}>
            <Box direction="row" spacing={20}>
                <Menu direction="hoz" embeddable mode="popup"  className={styles.menu}  onItemClick={showAndHidePanel}>
                    <Menu.Item key="leftPanel">左边</Menu.Item>
                    <Menu.Item key="topPanel">上边</Menu.Item>
                    <Menu.Item key="rightPanel">右边</Menu.Item>
                    <Menu.Item key="setRootNode" onClick={setRootNode}>设置根</Menu.Item>
                </Menu>
                <Row>
                    <Col span="12" style={{ width:'80px', marginTop: '10px' }}>
                        <Range value={depth} min={1} max={6} step={1} hasTip={false}
                            onChange={onRangeChage} />
                    </Col>
                    <Col span="12">
                        <NumberPicker style={{width:'42px'}} value={depth} min={1} max={6} step={1} size='medium' editable={false}
                            onChange={onRangeChage} />
                    </Col>
                </Row>
                <Menu direction="hoz" embeddable mode="popup" className={styles.menu} onItemClick={showAndHidePanel}>
                    <Menu.Item key="inport" onClick={onFileRead}>导入</Menu.Item>
                    <Menu.Item key="export">导出</Menu.Item>
                    <Menu.Item key="back" onClick={onBackup}>备份</Menu.Item>
                    <Menu.Item key="recover" onClick={onRecover}>恢复</Menu.Item>
                </Menu>
                <div>
                    <input ref={inputEl} accept=".md" style={{visibility:"hidden"}} type="file" id="files" onChange={onFileImport}/>
                </div>
            </Box>
        </div>);
}

export default MenuBar;  