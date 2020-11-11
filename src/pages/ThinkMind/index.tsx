import React from 'react';
import { ResponsiveGrid,  Tab } from '@alifd/next';
import SVGCancvs from './components/SVGCancvs';
import NodeSelectNav from './components/NodeSelectNav';
import MenuBar from './components/MenuBar';
import PropertyCanvas from './components/PropertyCanvas';
import PropertyStyle from './components/PropertyStyle';
import { store as pageStore } from 'ice/ThinkMind';
import styles from './index.module.scss';
import NodeSelectCrumb from './components/NodeSelectCrumb';
import { SizeContext } from '../../layouts/BasicLayout/index'

const { Cell } = ResponsiveGrid;

const ThinkMind = () => {
    const panelStatus = pageStore.useModelState('panelStatus');

    const showLeftPanel = () => {
        if (panelStatus.leftPanel) {
            return (
                <Cell colSpan={2}>
                    <NodeSelectNav />
                </Cell>
            );
        } else {
            return <React.Fragment />;
        }
    }

    const showTopPanel = () => {
        if (panelStatus.topPanel) {
            return (
                <Cell colSpan={12}>
                    <NodeSelectCrumb />
                </Cell>
            );
        } else {
            return <React.Fragment />;
        }
    }

    const showRightPanel = () => {
        if (panelStatus.rightPanel) {
            return (
                <Cell colSpan={2}>
                    <div className={styles.rightPanel}>
                        <Tab shape="text" defaultActiveKey="propertyCanvas">
                            <Tab.Item title="样式" key="propertyStyle" >
                                <PropertyStyle />
                            </Tab.Item>
                            <Tab.Item title="画布" key="propertyCanvas">
                                <PropertyCanvas />
                            </Tab.Item>
                        </Tab>
                    </div>
                </Cell>
            );
        } else {
            return <React.Fragment />;
        }
    }

    const getContextSpan = () => {
        if (panelStatus.leftPanel && panelStatus.rightPanel) {
            return 8;
        } else if (panelStatus.leftPanel || panelStatus.rightPanel) {
            return 10;
        } else {
            return 12;
        }
    }

    return (
        <SizeContext.Consumer>
            {size => (<div >
                <ResponsiveGrid gap={[0, 5]} className={styles.propertyContainer} style={{ height: size.height }}>
                    <Cell colSpan={12}>
                        <MenuBar />
                    </Cell>
                    {showTopPanel()}
                    {showLeftPanel()}
                    <Cell colSpan={getContextSpan()}>
                        <SVGCancvs />
                    </Cell>
                    {showRightPanel()}
                </ResponsiveGrid>
            </div>)}
        </SizeContext.Consumer>

    );
};

ThinkMind.pageConfig = {
    title: 'Thinkhub',
};

export default ThinkMind;