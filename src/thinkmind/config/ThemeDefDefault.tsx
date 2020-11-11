import { LinkPositionType, BackgroundModelType } from './Theme'

export default {
    name: 'defaultTheme',               //名字
    background: '#f6fafe',              //背景色
    highlightColor: 'pink',             //高亮颜色
    hoverColor: 'f7dca3',               //浮动颜色
    marginH: 0,                         //边距水平
    marginV: 0,                         //边距垂直
    borderWidthSelect:'3',              //选择边框宽度
    borderRadiusSelect:'5',
  
    themeDesc:{
        id:"default",
        name:"默认",
        img: "http://49.235.127.72/images/default.png",
    },
    //主主题样式
    rootTopic: {
        contentStyle: {
            nodeType: 'Rectangle',           //节点渲染

            marginH: 40,                    //边距水平
            marginV: 40,                    //边距垂直

            border: '0',                    //边框
            borderRadius: '5',              //边角
            borderWidth: '1',               //边宽
            borderStyle: 'none',              //边框样式
            borderColor: '#ffffff',           //边框颜色

            paddingX:30, 
            paddingY:20,

            background: '#5e7297',            //背景色

            width: 64,                         //宽
            height: 64,                        //高

            color: '#ffffff',                  //颜色
            fontFamily: 'verdana',             //字体类型
            fontSize: '28px',                  //字体大小
            lineHeight: '28px',                //行高
            fontWeight:'bold',                 //粗体

            content:'中心主题',

            linkPos:LinkPositionType.center,
            backgroundType:BackgroundModelType.backgroundBorder,
            showCollapsed:false,
        },   
        linkStyle: {
            
            linkType: 'Line',                   //行类型
            hasUnderline: false,                //是否有下划线
            lineWidth: 2,                       //行宽
            lineColor: '#a4adbb',               //行颜色
            lineRadius: 1,                     //行角半径
            collapsedOffset: 6,
        },                         
    },             
    //次主题样式
    primaryTopic: {
        contentStyle: {
            nodeType: 'Rectangle',           //节点渲染

            marginH: 5,                    //边距水平
            marginV: 5,                    //边距垂直

            border: '0',                    //边框
            borderRadius: '5',              //边角
            borderWidth: '1',               //边宽
            borderStyle: 'none',              //边框样式
            borderColor: '#ffffff',           //边框颜色

            paddingX:20, 
            paddingY:12,

            background: '#a2d1e4',            //背景色

            width: 42,                         //宽
            height: 42,                        //高

            color: '#54616b',                  //颜色
            fontFamily: 'verdana',             //字体类型
            fontSize: '18px',                  //字体大小
            lineHeight: '18px',                //行高
            fontWeight:'',                      //粗体

            content:'分支主题',

            linkPos:LinkPositionType.axisCenter,
            backgroundType:BackgroundModelType.backgroundBorder,
            showCollapsed:false,
        },   
        linkStyle: {
            linkType: 'Line',                   //行类型
            hasUnderline: false,                //是否有下划线
            lineWidth: 1,                       //行宽
            lineColor: '#a4adbb',               //行颜色
            lineRadius: 0,                     //行角半径
            collapsedOffset: 6,
        },              
    },          
    //正常主题样式
    normalTopic: {
        contentStyle: {
            nodeType: 'Rectangle',           //节点渲染

            marginH: 10,                    //边距水平
            marginV: 10,                    //边距垂直

            border: '0',                    //边框
            borderRadius: '5',              //边角
            borderWidth: '1',               //边宽
            borderStyle: 'none',              //边框样式
            borderColor: '#ffffff',           //边框颜色

            paddingX:8, 
            paddingY:6,

            background: '#a2d1e4',            //背景色

            width: 30,                         //宽
            height: 30,                        //高

            color: '#444b53',                  //颜色
            fontFamily: 'verdana',             //字体类型
            fontSize: '14px',                  //字体大小
            lineHeight: '14px',                //行高
            fontWeight:'',                      //粗体
            content:'子主题',

            linkPos:LinkPositionType.axisCenter,
            backgroundType:BackgroundModelType.backgroundBorder,
            showCollapsed:false,
        },   
        linkStyle: {
            linkType: 'Line',                   //行类型
            hasUnderline: false,                //是否有下划线
            lineWidth: 1,                       //行宽
            lineColor: '#a4adbb',               //行颜色
            lineRadius: 0,                     //行角半径
            collapsedOffset: 6,
        }           
    },   
    //独立的主题，一般情况下与次级的一样
    //次主题样式
    aloneTopic: {
        contentStyle: {
            nodeType: 'Rectangle',           //节点渲染

            marginH: 5,                    //边距水平
            marginV: 5,                    //边距垂直

            border: '0',                    //边框
            borderRadius: '0',              //边角
            borderWidth: '1',               //边宽
            borderStyle: 'none',              //边框样式
            borderColor: '#ffffff',           //边框颜色

            paddingX:8, 
            paddingY:6,
            
            background: '#a5ddfb',            //背景色

            width: 42,                         //宽
            height: 42,                        //高

            color: '#54616b',                  //颜色
            fontFamily: 'verdana',             //字体类型
            fontSize: '18px',                  //字体大小
            lineHeight: '18px',                //行高
            fontWeight:'',                      //粗体
            
            content:'   ',

            linkPos:LinkPositionType.axisCenter,
            backgroundType:BackgroundModelType.backgroundBorder,
            showCollapsed:false,
        },   
        linkStyle: {
            linkType: 'Line',                   //行类型
            hasUnderline: false,                //是否有下划线
            lineWidth: 1,                       //行宽
            lineColor: '#a5ddfb',               //行颜色
            lineRadius: 0,                     //行角半径
            collapsedOffset: 6,
        },              
    },     
}
