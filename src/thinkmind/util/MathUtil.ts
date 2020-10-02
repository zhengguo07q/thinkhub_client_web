import { List } from 'immutable'
import { number, string } from 'prop-types'
import {
  Point,
  Rect,
} from './Interface'



export function getBoundingBoxOfPoints(points: List<Point>): Rect |null{
  if (points.isEmpty()) {
    return null
  }
  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)
  const x = xs.min()!
  const y = ys.min()!
  const width = xs.max()! - x
  const height = ys.max()! - y
  return { x, y, width, height }  
}

export function round(number: number, n: number) {
  const t = 10 ** n
  return Math.round(number * t) / t  
} 

export const round3 = (number: number) => round(number, 3)

export function containsPoint(vs: Point[], p: Point) {
  // copied from node packge point-in-polygon
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  const { x, y } = p
  let inside = false
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i, i += 1) {
    const xi = vs[i].x
    const yi = vs[i].y
    const xj = vs[j].x
    const yj = vs[j].y
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

// 在resize元素的时候, 该函数用来获取点坐标的更新函数
export function getCoordinateUpdater(anchor: number, start: number, end: number) {
  return (target: number) => anchor + (end - anchor) * (target - anchor) / (start - anchor)
}

const square = (x: number) => x * x
const dist2 = (a: Point, b: Point) => square(a.x - b.x) + square(a.y - b.y)

// 计算两个点之前的距离
export function distanceBetweenPointAndPoint(point1: Point, point2: Point) {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  return Math.sqrt(dx * dx + dy * dy)
}

// 计算点与线段之间的距离  start, end分别为线段的起点和终点
export function distanceBetweenPointAndSegment(point: Point, start: Point, end: Point) {
  const length2 = dist2(start, end)
  if (length2 === 0) {
    return distanceBetweenPointAndPoint(point, start)
  }
  const t =
    ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / length2
  if (t <= 0) {
    return distanceBetweenPointAndPoint(start, point)
  } else if (t >= 1) {
    return distanceBetweenPointAndPoint(end, point)
  }
  return Math.sqrt(
    dist2(point, {
      x: start.x + t * (end.x - start.x),
      y: start.y + t * (end.y - start.y),
    }),
  )
}

export function getIn(obj: any, keyPath: string) {
  return keyPath.split('.').reduce((result, part) => result && result[part], obj)
}

/**
 * 随机uuid
 */
export function UUID() {
    return getSerialNo(8);
    /*
  function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  */
};

/**
 * 随机整数值
 * @param min 
 * @param max 
 */
export function RandomValue(min:number, max:number):number{
  return Math.floor(Math.random() * (max - min) + min)
}

const serialNo:string[] = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8',  '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',  'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',  'Z' 
]; 

export function getSerialNo(size:number):string{  
    let cs:string[] = [];  
    for (let i = 0; i < size; i++) { 
        let random = Math.floor(Math.random()*62); 
        cs.push(serialNo[random]);  
    }  
    return cs.join('');  
}