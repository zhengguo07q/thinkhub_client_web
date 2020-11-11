import { UUID } from '../util/MathUtil'; 

export enum MindTabType {
    CURRENT,        //当前同一级节点
    PRIVATE,        //私有
    TEMP,           //临时

    SHARE,          //分享，引用  自己分享给别人的
    RECENT,         //最近，引用  自动添加，最近使用的
    COLLECT,        //收藏, 引用, 别人的，不是拷贝的
    MEETING,        //邀请, 引用, 被别人编辑，会议节应该是独立的，不涉及到版本。会议可以被任何人修改，每次都需要重新获取和同步，被发起到会议后应拷贝所有相关节点到公共上去。会议节点可以被拷贝。
}

export enum MindTagType{
    REF,           //引用
    NODE,          //节点
}

export type MindData = {
    id:string;
    pid:string;
    content:string;
    type?:MindTagType;  //这个类型决定了text里面的内容和格式
    format?:string;
    
    //所有对象都含有的节点
    childs:string[];
    frees?: string[];
    connects?: string[];
    auth?:string;                //''代表自己
    //以下内容在次级目录上有
    isSubVisible?:boolean;         //当前子是否可见状态
    sortId?:number;             //这个会在第一次写入数据库的时候写入
    isWrite?:boolean;           //需要写入
    isLock?:boolean;            //锁定状态
    isLoad?:boolean;            //子节点载入情况
};

const ROOTId = UUID();
const CURRENT = UUID();
const PRIVATE = UUID();
const TEMP = UUID();
const SHARE = UUID();
const RECENT = UUID();
const COLLECT = UUID();
const MEETING = UUID();

export const MindDataInitialize = 
[
    {
        id: ROOTId,
        pid:'',
        content:'Root',
        isWrite:false,
        isLock:true,
        childs:[CURRENT,PRIVATE,TEMP,SHARE,RECENT,COLLECT,MEETING]
    },
    {
        id: CURRENT,
        pid: ROOTId,
        content:'CURRENT',
        childs:[],
        isWrite:false,
        isLock:true,
    },
    {
        id: PRIVATE,
        pid: ROOTId,
        content:'PRIVATE',
        childs:[],
        isWrite:false,
        isLock:true,
    },
    {
        id: TEMP,
        pid: ROOTId,
        content:'TEMP',
        childs:[],
        isWrite:false,
        isLock:true,
    },
    {
        id: SHARE,
        pid: ROOTId,
        content:'SHARE',
        childs:[],
        isWrite:false,
        isLock:true,
    },
    {
        id: RECENT,
        pid: ROOTId,
        content:'RECENT',
        childs:[],
        isWrite:false,
        isLock:true,
    },
    {
        id: COLLECT,
        pid: ROOTId,
        content:'COLLECT',
        childs:[],
        isWrite:false,
        isLock:true,
    },
    {
        id: MEETING,
        pid: ROOTId,
        content:'MEETING',
        childs:[],
        isWrite:false,
        isLock:true,
    },
];

export const MindDataDefault = {
    id: 'DEFAULT',
    content:'DEFAULT',
    childs:[],
    isWrite:false,
    isLock:true,
}


export function createNewNode(content:string){
    let data = {
        id: UUID(),
        pid:'',
        content: content,
        type: MindTagType.NODE,
        childs:[],
        isWrite:false,
        isLock:false,
    }
    return data;
}

/**
 * 创建一个引用节点
 * @param node 
 */
export function createRefNode(node:MindData){
    let data = {
        id: UUID(),
        pid:'',
        content: node.content,
        type: MindTagType.REF,
        childs:[],
        isWrite:false,
        isLock:false,
    };
    
    (data as MindData).childs.push(node.id);
    return data;
}