import $ from 'jquery'
import mousewheel from 'jquery-mousewheel'

mousewheel;

export type GestureOptions = {
    tolerance?: number;              //容差
    bX?: number;                     //起始x
    bY?: number;                     //起始y
    timeLock?: boolean;              //时间锁
    captureTime?: number;            //手势捕获时长       
    xPoints?: number[];              //手势点集合x
    yPoints?: number[];              //手势点集合y
    xcPoints?: number[];             //手势点集合差x
    ycPoints?: number[];             //手势点集合差y

    onPath: (x: number, y: number) => void;
    onGesture: (gesture: GestureType)=> void;
}

export enum GestureType{
    unknow,
    zoom,
    mini,
    right,
    left,
    down,
    up,
}

let GestureDefaultOptions:GestureOptions = {
    tolerance : 5,
    bX: 0,
    bY: 0,
    timeLock: false,
    captureTime: 1200,

    xPoints: [],
    yPoints: [],
    xcPoints: [],
    ycPoints: [],

    onPath: (x: number, y: number) => {},
    onGesture: (gesture: GestureType)=> {},
}

export class Gesture {
    options: GestureOptions;
    $elem;

    constructor(public element:HTMLElement, options?: GestureOptions) {
        this.options = $.extend({}, GestureDefaultOptions, options);
        this.$elem = $(element);
        this.initialize();
    }

    initialize(){
        let that = this;
        this.$elem.off("mousewheel").on("mousewheel", function (event) {
            that.eventHalder(event || window.event);
            event.stopPropagation();
            event.preventDefault();
        });
    }

    destory(){
        this.$elem.off("mousewheel");
    }

    eventHalder(event) {
        event = ($.event as any).fix(event);
        var wl = event.originalEvent,
            deltaX = wl.wheelDeltaX,
            deltaY = wl.wheelDeltaY;
        
        var finalX:number,
            finalY:number;

        if (Math.abs(deltaX) < this.options.tolerance!) {
            //避免低值差的算法（一般双指缓慢滑动行为）
            finalX = deltaX;
        } else {
            //高值差的算法（一般双指快速滑动行为）
            var xSpace = this.options.bX! - deltaX;
            finalX = this.getFinalSpace(deltaX, xSpace);
        }

        if (Math.abs(deltaY) < this.options.tolerance!) {
            finalY = deltaY;
        } else {
            var ySpace = this.options.bY! - deltaY;
            finalY = this.getFinalSpace(deltaY, ySpace);
        }
        
        if (deltaX != 0 || deltaY != 0) {
            this.options.onPath(deltaX, deltaY);
            this.options.bX = deltaX;
            this.options.bY = deltaY;
        }
        this.storePoints(finalX, finalY, deltaX, deltaY);
        this.anlaseGesture();
    }

    /**
     * 得到最终的大小
     * @param delta
     * @param space 
     */
    getFinalSpace(delta: number, space: number): number {
        //当差值不跟滑动方向正负相同时，需舍弃
        return delta > 0 && space > 0 || delta < 0 && space < 0 ? space : 0;
    }

    /**
     * 存储点位置
     * @param finalX 
     * @param finalY 
     * @param deltaX 
     * @param deltaY 
     */
    storePoints(finalX: number, finalY: number, deltaX: number, deltaY: number) {
        this.options.xPoints!.push(deltaX);
        this.options.yPoints!.push(deltaY);
        this.options.xcPoints!.push(finalX);
        this.options.ycPoints!.push(finalY);
    }

    /**
     * 分析手势，主要做法就是分析特定时间段内触发点坐标和大小
     */
    anlaseGesture() {
        if (this.options.timeLock) return;
        this.options.timeLock = true;
        var that = this;
        setTimeout(function () {
            var gesture = that.getGesture(
                that.sumValue(that.options.xcPoints!),
                that.sumValue(that.options.ycPoints!),
                that.sumValue(that.options.xPoints!) + that.sumValue(that.options.yPoints!));
            that.options.onGesture(gesture);
            that.options.xPoints = [];
            that.options.yPoints = [];
            that.options.xcPoints = [];
            that.options.ycPoints = [];
            that.options.timeLock = false;
        }, this.options.captureTime);
    }

    /**
     * 计算这些坐标点和
     * @param arr 
     */
    sumValue(arr: number[]) {
        var sum = 0;
        arr.forEach(function (val) {
            sum += val;
        });
        return sum;
    }

    /**
     * 获得手势点方向
     * @param aX 
     * @param aY 
     * @param aXY 
     */
    getGesture(aX: number, aY: number, aXY: number): GestureType {
        var abX = Math.abs(aX),
            abY = Math.abs(aY),
            gesture: GestureType = GestureType.unknow;

        if (aXY != 0 && aXY % 120 == 0) {
            if (aXY > 0) {
                gesture = GestureType.zoom;
            }
            else {
                gesture = GestureType.mini;
            }
        } else {
            if (abX > abY) {
                if (aX > 0) {
                    gesture = GestureType.right;
                } else {
                    gesture = GestureType.left;
                }
            }
            if (abX < abY) {
                if (aY > 0) {
                    gesture = GestureType.down;
                } else {
                    gesture = GestureType.up;
                }
            }
        }
        return gesture;
    }
}