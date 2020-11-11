import { LinkPositionType, BackgroundModelType} from './Theme'

export default {
    name: 'defaultTheme',               //名字
    background: '#ffffff',              //背景色
    highlightColor: '#6482ff',          //高亮颜色
    hoverColor: '#e3edfa',              //随机颜色
    marginH: 0,                         //边距水平
    marginV: 0,                         //边距垂直
    borderWidthSelect:'2',              //选择边框宽度
    borderRadiusSelect:'3',
  
    themeDesc:{
        id:"simple",
        name:"简单",
        img: "http://49.235.127.72/images/simple.png",
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

            paddingX:24, 
            paddingY:15,

            background: '#435fbc',            //背景色

            width: 60,                         //宽
            height: 50,                        //高

            color: '#ffffff',                  //颜色
            fontFamily: 'verdana',             //字体类型
            fontSize: '19px',                  //字体大小
            lineHeight: '19px',                //行高
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
            lineColor: '#b4b4b4',               //行颜色
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

            paddingX:14, 
            paddingY:8,

            background: '#ebecf3',            //背景色

            width: 42,                         //宽
            height: 42,                        //高

            color: '#303030',                  //颜色
            fontFamily: 'verdana',             //字体类型
            fontSize: '15px',                  //字体大小
            lineHeight: '15px',                //行高
            fontWeight:'',                      //粗体

            content:'分支主题',

            linkPos:LinkPositionType.axisCenter,
            backgroundType:BackgroundModelType.backgroundBorder,
            showCollapsed:true,
        },   
        linkStyle: {
            linkType: 'Line',                   //行类型
            hasUnderline: false,                //是否有下划线
            lineWidth: 1,                       //行宽
            lineColor: '#b4b4b4',               //行颜色
            lineRadius: 0,                     //行角半径
            collapsedOffset: 6,
        },              
    },          
    //正常主题样式
    normalTopic: {
        contentStyle: {
            nodeType: 'Rectangle',           //节点渲染

            marginH: 10,                    //边距水平
            marginV: 4,                    //边距垂直

            border: '0',                    //边框
            borderRadius: '1',              //边角
            borderWidth: '1',               //边宽
            borderStyle: 'none',              //边框样式
            borderColor: '#b4b4b4',           //边框颜色

            paddingX:2, 
            paddingY:2,

            background: '#ffffff',            //背景色

            width: 32,                         //宽
            height: 20,                        //高

            color: '#454545',                  //颜色
            fontFamily: 'verdana',             //字体类型
            fontSize: '12px',                  //字体大小
            lineHeight: '12px',                //行高
            fontWeight:'',                      //粗体
            content:'子主题',

            linkPos:LinkPositionType.baseLine,
            backgroundType:BackgroundModelType.baseLine,
            showCollapsed:true,
        },   
        linkStyle: {
            linkType: 'Line',                   //行类型
            hasUnderline: false,                //是否有下划线
            lineWidth: 1,                       //行宽
            lineColor: '#b4b4b4',               //行颜色
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
            lineColor: '#b4b4b4',               //行颜色
            lineRadius: 0,                     //行角半径
            collapsedOffset: 6,
        },              
    },     
}
