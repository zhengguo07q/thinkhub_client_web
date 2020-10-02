import { Message } from '@alifd/next';

export default class Debug{
    static showContext(object:any){
        if(object == null)
        {
            Message.show('null')
        }else if(object == undefined){
            Message.show('undefined')
        }
        else{
            Message.show(JSON.stringify(object));
        }
        
    }
}

