# SVG

## 线条

### 直线

- line

	- 开始点

		- x1="0" y1="0"

	- 结束点

		- x2="200" y2="0"

	- 样式

		- style="stroke:rgb(0,0,0);stroke-width:5"

### 折线

- polyline

	- 点数组

		- points="3,3 30,28 3,53"

### 路径

- path

	- 点数组

		- d="M 18,3 L 46,3  L 46,40  L 61,40  L 32,68  L 3,40  L 18,40  Z“

### 属性

- stroke

	- stroke-width
	- stroke-opacity
	- stroke-dasharray

		- "5,5"

	- stroke-linecap

		- butt
		- square
		- round

	- stroke-linejoin

		- miter
		- round
		- bevel

- fill

	- fill-opacity

## 形状

### 椭圆

- ellipse

	- 中心坐标

		- cx="60" cy="60"

	- 横纵半径

		- ry="40" rx="20"

### 矩形

- rect

	- 原点

		- x="0" y="0"

	- 宽高

		- height="100" width="200"

	- 圆角

		- rx="10" ry="10"

### 圆形

- circle

	- 圆心

		- cx="50" cy="50"

	- 半径

		- r="50"

### 多边形

- polygon

	- fill="green" stroke="orange" stroke-width="1" points="0,0 100,0 100,100 0,100 0,0"

## 图像

### 文本

- text

	- 基线坐标

		-  x="50" y="25"

### 图片

- image

	- 链接

		- xlink:href="path/to/image.jpg"

	- 宽高

		- width="50%" height="50%"

## 特性

### 定义模式

- defs

### 定义模版

- pattern

	- 原点

		- x="0" y="0"

	- 宽高

		- width="100" height="100"

	- 方式

		- patternUnits="userSpaceOnUse"

### 元素编组

- g

### 元素拷贝

- use

	- 复制id

		- href="#myCircle"

	- 原点

		- x="10" y="0"

### 不同空间

- foreignObject

	- 子主题发顺丰打发沙发发发达发发到沙发上发发发发撒的发达发撒的安抚阿到沙发打法电动阀范德萨发DSFDAFSAFSDFSAFSAFASFASFASFSFASDFASDFSFSGFDGDGREGDFGDFDFFFFDD

## 动画

### 属性动画

- animate

	- 属性名

		- attributeName="x"

	- 初始值和结束值

		- from="0" to="500"

	- 单次持续时间

		- dur="2s"

	- 循环模式

		- repeatCount="indefinite"

### 形变动画

- animateTransform

	- 属性名

		- attributeName="transform"

	- 子主题

		- type="rotate"

	- 单次持续时间

		- dur="2s"

	- 初始值和结束值

		- from="0 200 200" to="360 400 400"

	- 循环模式

		- repeatCount="indefinite"

## 样式扩展

### 填充

- fill: steelblue; 

### 笔触

- stroke: blue; 

### 笔宽

- stroke-width:4;

### 透明

- opacity: 0.5

*XMind - Trial Version*