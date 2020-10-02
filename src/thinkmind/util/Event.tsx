import { EventEmitter } from 'events';

export enum EventType{
    MindDataLoadComplete,
    MindDataChangeNode,
    CreateJsonComplete,
    MindDataSetRootNode,
    Message,
}

var eventEmitter:EventEmitter = new EventEmitter();

export const EventManager = {
    dispatcher:function(type:EventType, object?:any){
        eventEmitter.emit(EventType[type], object);
    },

    addListener:function(type:EventType, func:any){
        eventEmitter.addListener(EventType[type], func);
    },

    removeListener:function(type:EventType, func:any){
        eventEmitter.removeListener(EventType[type], func);
    }
}

