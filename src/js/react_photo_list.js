//利用自执行函数，将图片文件名信息转成Url路径，写入原Json数据
imgList = (function  genImageUrl(imgListArr){
	for(var i = 0; i <= imgList.length-1; i++){
		var singleImageData = imgListArr[i];

		singleImageData.imageUrl = './images/' + singleImageData.fileName;

		imgListArr[i] = singleImageData;
	}
	return imgListArr;
})(imgList);
//console.log(imgList);

// 获取区间内的一个随机数函数
function getRangeRandom(low, high){
	return Math.ceil(Math.random() * (high - low) + low);
}

// 获取0-30之间的随机正负值
function get30DegRandom(){
	return(Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

//React图片组建
var ImgFigure = React.createClass({
	/*
	 * ImgFigure的点击处理函数
	 */
	handleClick : function(e){

		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		
		//console.log('ImgFigure Click');

		e.stopPropagation();
		e.preventDefault();
	},

	render : function(){

		var styleObj = {};

		//如果图片定位至存在，为图片添加定位值
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		//如果图片旋转角度不为0，为图片添加定旋转角度
		if(this.props.arrange.rotate) {
			(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}

		//如果是居中图片，赋值CSS z-index
		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = "imgFigure";
			imgFigureClassName += this.props.arrange.isInverse ? ' isInverse' : '';

		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageUrl} alt={this.props.data.title} />
				<figcaption>
					<h2>{this.props.data.title}</h2>
					<div className="imgBack" onClick={this.handleClick}>
						<p>{this.props.data.desc}</p>
					</div>
				</figcaption>
			</figure>
		);
	}
})

//控制按钮组件
var ImgNav = React.createClass({
	handleClick : function(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	},
	render : function(){

		var imgNavClassName = "imgNav";

		//如果当前按钮状态是选中状态，添加对应CSS
		if(this.props.arrange.isCenter){
			imgNavClassName += " onthis";
			//如果当前按钮状态是选中反转状态，添加对应CSS
			if(this.props.arrange.isInverse){
				imgNavClassName += " inverse";
			}
		}

		return (
			<span className={imgNavClassName} onClick={this.handleClick}>
			</span>
		);
	}
})

//用React构建核心组件
var HtmlPrint = React.createClass({
	//自定义内容，定义
	Constant : {
		centerPos : {
			left : 0,
			right : 0
		},
		hPosRange:{  //水平方向的取值范围
			leftSecX : [0,0],
			rightSecX : [0,0],
			y : [0,0]
		},
		vPosRange : {
			x : [0,0],
			topY : [0,0]
		}
	},

	/*
	 * 翻转图片
	 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	 * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
	 */
	inverse : function(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr : imgsArrangeArr
			})
		}.bind(this);
	},
	
	/*
	 * 重新排布所有图片
	 * @param centerIndex 指定居中排布哪个图片
	 */
	rearrange : function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), //取值0-1

			topImgSpliceIndex = 0,

			/* 
			 * splice() 向/从数组中添加/删除项目，然后返回被删除的项目
			 * 这里用来替换数组中的项目
			 */
			imgArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
			
			/* 
			 * 首先居中centerIndex的图片
			 * 居中的图片不需要旋转
			 */
			imgArrangeCenterArr[0] = {
				pos : centerPos,
				rotate : 0,
				isCenter : true
			}


			// 取出要布局上侧图片的状态信息
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

			// 布局上侧图片
			imgArrangeTopArr.forEach(function(value,index){
				imgArrangeTopArr[index] = {
					pos : {
						top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
						left : getRangeRandom(vPosRangeX[0],vPosRangeX[1])
					},
					rotate : get30DegRandom()
				}
			});

			//布局左右两侧的图片
			for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
				var hPosRangeLORX = null;

				// 前半部分布局左边，右半部分布局右边
				if(i < k){
					hPosRangeLORX = hPosRangeLeftSecX;
				}else{
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos : {
						top : getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
						left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
					},
					rotate : get30DegRandom(),
					isCenter : false
				}
			}
			
			//debugger是谷歌浏览器提供的调试语句
			//debugger;

			if(imgArrangeTopArr && imgArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr : imgsArrangeArr
			})
	},

	/*
	 * 利用 rearrange 函数，居中对应index的图片
	 * @param index,需要被居中的图片对应的图片信息数组的index值
	 * @return {Function}
	 */
	center : function(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	},

	getInitialState : function(){
		return {
			imgsArrangeArr : [
				/*{
					pos : {
						left : 0,
						top : 0
					},
					rotate : 0, //图片旋转角度
					isInverse : false, //图片正反面
					isCenter : false //图片是否居中，默认不居中
				}*/
			]
		};
	},

	/*
	 * React生命周期方法
	 * 页面DOM截点初始化渲染执行之后，会立刻调用一次此函数
	 */
	componentDidMount : function(){
		//拿到舞台的大小
		var stageDOM = React.findDOMNode(this.refs.stage),  //通过定义的refs名获取DOM对象
			stageW = stageDOM.scrollWidth, //对象的真实宽度
			stageH = stageDOM.scrollHeight, //对象的真实高度
			halfStageW = Math.ceil(stageW / 2), //一半的宽度
			halfStageH = Math.ceil(stageH / 2) //一半的高度

		//console.log(stageW + " " + stageH);

		//拿到imgFigure的大小
		var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2)

		//console.log(imgW + " " + imgH);
		
		//this.Constant用来储存图片排布位置的取值范围
		//计算中心图片的位置点
		this.Constant.centerPos = {
			left : halfStageW - halfImgW,
			top : halfStageH - halfImgH
		}

		/*
		 * 下面开始计算图片排布位置的取值范围
		 */
		
		//左侧区域图片，X轴最小值，不小于图片宽度的一半
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		//左侧区域图片，X轴最大值，不小于图片宽度的一半
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = stageH - halfImgH * 3;

		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);
	},

	render : function(){

		var imgFigures = [],
			clickNav = [];

		/* 
		 * 循环插入图片组件至imgList数组
		 * 这里的index是数组元素的数字索引
		 * bind是将function外层的this带到function内部，和var _self = this的效果一样
		 */
		imgList.forEach(function(value,index){
			
			/*
			 * this.state（React State）是组件的状态
			 * getInitialState 方法用于定义初始状态
			 * 也就是一个对象，这个对象可以通过 this.state 属性读取。
			 * state的内容需要通过getInitialState初始化
			 */

			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos:{
						left : 0,
						top : 0
					},
					rotate : 0,
					isInverse : false,
					isCenter : false,
				}
			}

			// key={index} 用于React优化性能
			imgFigures.push(<ImgFigure key={index} data={value} ref={"imgFigure" + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
			//console.log(value);

			clickNav.push(<ImgNav key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		}.bind(this));

		return(
			<div className="sectionBox">
				<section ref="stage">
					{imgFigures}
				</section>
				<nav>
					{clickNav}
				</nav>
			</div>
		);
	}
})