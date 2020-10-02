import DataCache from '../dataSource/DataCache';
import { ContextHolder } from '../util/ContextHolder';


export class SetRootNode extends ContextHolder{
    initialize(){}

    /**
     * 从选择中设置
     */
    setSelect(){
        let selIdSet = this.sceneContext.nodeLayer.selIdSet;
        if(selIdSet.size == 0){
            return ;
        }
        let firstId:string;
        selIdSet.forEach((id)=>{
            firstId = id;
        })
        DataCache.setRoot(firstId!);
        
    }

    destory(){}
}