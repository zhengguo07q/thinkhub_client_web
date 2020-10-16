import React, { useEffect, useState } from 'react';
import { ResponsiveGrid, Box ,Breadcrumb, Menu, Animate, Tab} from '@alifd/next';
import SVGCancvs from './components/SVGCancvs';
import NodeSelectNav from './components/NodeSelectNav';
import MenuBar from './components/MenuBar';
import PropertyCanvas from './components/PropertyCanvas';
import PropertyStyle from './components/PropertyStyle';
import { store as pageStore } from 'ice/ThinkMind';
import styles from './index.module.scss';
import NodeSelectCrumb from './components/NodeSelectCrumb';

const { Cell } = ResponsiveGrid;


const Dashboard = () => {
  const panelStatus = pageStore.useModelState('panelStatus');
/*
    useEffect(() => {
        EventManager.addListener(EventType.MindDataSetRootNode, mindDataSetRootNode)
        return (() => { EventManager.removeListener(EventType.MindDataSetRootNode, mindDataSetRootNode) });
    }, []);

    //载完启动刷新
    const [refresh, setRefresh] = useState(false);
    const mindDataSetRootNode = () => {
    //    setRefresh(!refresh);
    }
    */

  const showLeftPanel = () => {
    if(panelStatus.leftPanel){
      return (
      <Cell colSpan={2}>
        <NodeSelectNav/>
      </Cell>
      );
    }else{
      return <React.Fragment/>;
    }
  }

  const showTopPanel = () => {
    if(panelStatus.topPanel){
      return (
        <Cell colSpan={12}>
            <NodeSelectCrumb/>
      </Cell>
      );
    }else{
      return <React.Fragment/>;
    }
  }

  const showRightPanel = () => {
    if(panelStatus.rightPanel){
      return (
      <Cell colSpan={2}>
          <div className={styles.propertyContainer}>
        <Tab shape="text" defaultActiveKey="propertyCanvas">
            <Tab.Item title="样式" key="propertyStyle" >
                <PropertyStyle/>
            </Tab.Item>
            <Tab.Item title="画布" key="propertyCanvas">
                <PropertyCanvas/>
            </Tab.Item>
        </Tab>
        </div>
      </Cell>
      );
    }else{
      return <React.Fragment/>;
    }
  }

  const getContextSpan = ()=>{
    if(panelStatus.leftPanel && panelStatus.rightPanel){
      return 8;
    }else if(panelStatus.leftPanel || panelStatus.rightPanel){
      return 10;
    }else{
      return 12;
    }
  }

  return (
    <ResponsiveGrid gap={[0, 5]} className={styles.propertyContainer}>
    <Cell colSpan={12}>
      <MenuBar/>
    </Cell> 
      {showTopPanel()}
      {showLeftPanel()}
      <Cell colSpan={getContextSpan()}>
        <SVGCancvs />
      </Cell>
      {showRightPanel()} 
    </ResponsiveGrid>
  );
};

export default Dashboard;