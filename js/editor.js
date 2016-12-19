(function(document) {
	if(!window.editor) {
		window.editor = {};
	}
	//自动获取html中id为editor的div块，获取此元素的宽高.
	var wraper = document.getElementById("editor");
	// var w = wraper.;
	// var h = wraper.height();
	var toolbar = document.createElement("div");
	toolbar.className = 'tool-bar';
	toolbar.style.MozUserSelect= 'none';
	toolbar.style.WebkitUserSelect = 'none';
	toolbar.style.MsUserSelect = 'none';
	//编辑区
	var editor = document.createElement("div");
	editor.className = "edit-area";
	var tools = [];
	//图片url;
	var img_flag = false;
	var has_darkbg = false;
	//生成editor控件
	(function createToolBar() {
		
		//加粗
		var bold_button = document.createElement("span");
		bold_button.className = "icon-bold";
		tools.push(bold_button);
		//倾斜
		var italic_button = document.createElement("span");
		italic_button.className = "icon-italic";
		tools.push(italic_button);
		//中划线
		var strike_button = document.createElement("span");
		strike_button.className = "icon-strikethrough";
		tools.push(strike_button);
		//下划线
		var underline_button = document.createElement("span");
		underline_button.className = "icon-underline";
		tools.push(underline_button);
		//字体
		var font_button = document.createElement("span");
		font_button.className ="icon-font";
		tools.push(font_button);
		//字号
		var fontheight_button = document.createElement("span");
		fontheight_button.className = "icon-text-height";
		tools.push(fontheight_button);
		//左对齐
		var alignleft_button = document.createElement("span");
		alignleft_button.className = "icon-align-left";
		tools.push(alignleft_button);
		//居中
		var aligncenter_button = document.createElement("span");
		aligncenter_button.className = "icon-align-center";
		tools.push(aligncenter_button);
		//右对齐
		var alignright_button = document.createElement("span");
		alignright_button.className = "icon-align-right";
		tools.push(alignright_button);
		//两边对齐
		var alignjust_button = document.createElement("span");
		alignjust_button.className = "icon-align-justify";
		tools.push(alignjust_button);
		//插入图片
		var picture_button = document.createElement("span");
		picture_button.className = "icon-picture";
		picture_button.innerHTML = '<input id="imgInput" type="file" name="imageInput" accept="image/jpg, image/jpeg, image/png">'
		tools.push(picture_button);
		//插入图连接按钮
		var link_button = document.createElement("span");
		link_button.className = "icon-link";
		tools.push(link_button);
		//无序列表
		var ul_button = document.createElement("span");
		ul_button.className = "icon-list";
		tools.push(ul_button);
		//有序列表
		var ol_button = document.createElement("span");
		ol_button.className = "icon-list-ol";
		tools.push(ol_button);
		//数学公式
		var math_button = document.createElement("span");
		math_button.className = "icon-paper-clip";
		tools.push(math_button);
		//撤销
		var undo_button = document.createElement("span");
		undo_button.className = "icon-undo";
		tools.push(undo_button);
		for (var i = 0; i < tools.length; i++) {
			var ele = document.createElement("div");
			ele.className = "button-wraper";
			ele.appendChild(tools[i]);
			toolbar.appendChild(ele);
		};
		wraper.appendChild(toolbar);

	}) ();

	//得到所有对齐类按钮
	var aligns = (function() {
		var array = [];
		for (var i = 0; i < tools.length; i++) {
			if (tools[i].className.split("-").indexOf("align")) {
				array.push(tools[i]);
			};
		};
		return array;
	}) ();
	//创建编辑区
	function createEditor() {
		editor.contentEditable = "true";
		wraper.appendChild(editor);
	}
	//为各个按钮添加事件
	var s = window.getSelection();
	var focusNode;
	var focusOffset;
	//每秒保存光标位置
	var range; //保存选区

	//editor失去焦点时保存选区
	function saveSelection() {
		//保存focusNode
		focusNode = s.focusNode;
		focusOffset = s.focusOffset;
	
		anchorNode = s.anchorNode;
		anchorOffset = s.anchorOffset;
	}
	
	//重新设置选区
	function setFocus() {
		/**
		 * 此处可能导致代码出现问题
		 */
		range = s.getRangeAt(0);

		var indexs =  judgeNodeIndex(anchorNode, focusNode);

		//设置选区开始和结束
		if (indexs.anchor > indexs.focus) {
			range.setStart(focusNode, focusOffset);
			range.setEnd(anchorNode, anchorOffset);
		}
		else {
			if(anchorOffset > focusOffset) {
				range.setStart(anchorNode, focusOffset);
				range.setEnd(focusNode, anchorOffset);
				return;
			}
			range.setStart(anchorNode, anchorOffset);
			range.setEnd(focusNode, focusOffset);
		}
		s.removeAllRanges();
		s.addRange(range);
	}
	//判断子元素的位置
	function judgeNodeIndex(anchorNode, focusNode) {
		//得到editor的子元素集合
		var childs = editor.childNodes;
		var indexs = {
			anchor: 0,
			focus: 0
		}
		for (var i = 0; i < childs.length; i++) {
			if (childs.item(i) === anchorNode) {
				indexs.anchor = i;
			}

			if(childs.item(i) === focusNode) {
				indexs.focus = i;
			}
		};

		return indexs;
	}
	//自动保存选区
	
	editor.addEventListener('blur', saveSelection);

	//工具栏各个按钮绑定事件
	function buttonEvent() {
		for (var i = 0; i < tools.length; i++) {
			if(tools[i].className.split("-").indexOf("bold") > -1) {
				tools[i].onclick = function(e) {
					//粗体
					//判断是否已经被点击，如果被点击就删除has-click，否则添加
					if(hasClick(this)) {
						removeClass(this, "has-click");
					}
					else {
					// 	//判断光标是否在编辑区内，如果不在将光标移到编辑区内
						addClass(this, "has-click");	
					}
					editor.focus();				
					setFocus();
					document.execCommand("bold", false, null);

				}
				continue;
			}
			else if(tools[i].className.split("-").indexOf("italic") > -1) {
				tools[i].onclick = function(e) {
					//斜体				
					if(hasClick(this)) {
						removeClass(this, "has-click");	
					}
					else {
						addClass(this, "has-click");
						
					}
					editor.focus();
					setFocus();
					document.execCommand("italic", false, null);
				}
				continue;

			}
			else if(tools[i].className.split("-").indexOf("strikethrough") > -1) {
				tools[i].onclick = function(e) {
					//删除线
					if(hasClick(this)) {
						removeClass(this, "has-click");
					}
					else {
						addClass(this, "has-click");
						
					}
					editor.focus();
					setFocus();
					document.execCommand("strikeThrough", false, null);
				}
				continue;

			}
			else if(tools[i].className.split("-").indexOf("underline") > -1) {
				tools[i].onclick = function(e) {
					//下划线
					if(hasClick(this)) {
						removeClass(this, "has-click");
					}
					else {
						addClass(this, "has-click");
					}
					editor.focus();
					setFocus();
					document.execCommand("underline", false, null);
				}
				continue;

			}
			else if(tools[i].className.split("-").indexOf("font") > -1) {
				tools[i].onclick = function(e) {
					//字体
					if(hasClick(this)) {
						removeClass(this, "has-click");
					}
					else {
						addClass(this, "has-click");	
					}
					/**
					 * 设置字体功能
					 * 待添加
					 */
					return;
					editor.focus();
					setFocus();
				}
				continue;

			}
			else if(tools[i].className.split("-").indexOf("height") > -1) {
				tools[i].onclick = function(e) {
					//字体大小
					if(hasClick(this)) {
						removeClass(this, "has-click");
					}
					else {
						addClass(this, "has-click");
					}
					/**
					 * 字体大小功能
					 * 待添加
					 */
					editor.focus();
					setFocus();
				}
				continue;

			}
			/**************对齐方式***************/
			else if(tools[i].className.split("-").indexOf("left") > -1) {
				tools[i].onclick = function(e) {
					//左对齐
					if(hasClick(this)) {
						removeClass(this, "has-click");
					}
					else {
						removeAligntHit();
						addClass(this, "has-click");
					}
					editor.focus();
					setFocus();
					document.execCommand("justifyLeft", false, null);
					
				}
				continue;

			}
			else if(tools[i].className.split("-").indexOf("center") > -1) {
				tools[i].onclick = function(e) {
					//居中
					if(hasClick(this)) {
						removeClass(this, "has-click");
						
					}
					else {
						removeAligntHit();
						addClass(this, "has-click");			
					}
					editor.focus();
					setFocus();
					document.execCommand("justifyCenter", false, null);
				}
				continue;

			}
			else if(tools[i].className.split("-").indexOf("right") > -1) {
				tools[i].onclick = function(e) {
					//右对齐
					if(hasClick(this)) {
						removeClass(this, "has-click");
					}
					else {
						removeAligntHit();
						addClass(this, "has-click");
						
					}
					editor.focus();
					setFocus();
					document.execCommand("justifyRight", false, null);
				}
				continue;

			}
			else if(tools[i].className.split("-").indexOf("justify") > -1) {
				tools[i].onclick = function(e) {
					//两边对齐
					if(hasClick(this)) {
						removeClass(this, "has-click");
					}
					else {
						removeAligntHit();
						addClass(this, "has-click");
					}
					editor.focus();
					setFocus();
					document.execCommand("justifyFull", false, null);
				}
				continue;

			}
			/**************Justify End***************/

			/******************插入图片或者链接*****************/
			else if(tools[i].className.split("-").indexOf("picture") > -1) {
				//图片按钮被点击时应该弹出图片选择框
				tools[i].onclick = function(e) {
					//背景变暗
					darken(true);
					//插入图片
					// imgInput.click();   //触发input的点击事件,会冒泡
					addClass(this, "has-click");
					removeClass(this, "has-click");
					insertImageConfirm();
					editor.focus();
				}
				continue;

			}
			else if(tools[i].className.split("-").indexOf("link") > -1) {
				tools[i].onclick = function(e) {
					//背景变暗
					darken(true);
					//插入链接
					addClass(this, "has-click");
					//弹出对话框
					createLinkConfirm();
					//关闭样式
					removeClass(this, "has-click")

				}
				continue;

			}
			/******************Insert End*****************/

			/******************List*****************/
			else if(tools[i].className.split("-").indexOf("list") > -1) {
				if(tools[i].className.split("-").indexOf("ol") > -1) {
					tools[i].onclick = function(e) {
						//有序列表
						if(hasClick(this)) {
							removeClass(this, "has-click");
						}
						else {
							addClass(this, "has-click");
							document.execCommand("insertorderedlist", false, null);
						}
						editor.focus();
					}
					continue;
				}
				else {
					//无序列表
					tools[i].onclick = function(e) {
						if(hasClick(this)) {
							removeClass(this, "has-click");
						}
						else {
							addClass(this, "has-click");
							document.execCommand("insertunorderedlist", false, null);
						}
						editor.focus();
					}
					continue;
				}

			}

			/******************List End*****************/
			/********************Formula*******************/
			else if(tools[i].className.split('-').indexOf('paper') > -1) {
				tools[i].onclick = function(e) {
					/*
						. . . 
						插入公式
						. . .
					*/
					//背景变暗
					darken(true);
					addClass(this, "has-click");
					removeClass(this, "has-click");
					formulaConfirm();
					editor.focus();
				}
			}
			/********************Fomula End*******************/
			/********************Undo*******************/
			else if(tools[i].className.split("-").indexOf("undo") > -1) {
				tools[i].onclick = function(e) {
					//撤销
					addClass(this, "has-click");
					document.execCommand("undo", false, null);
					removeClass(this, "has-click");
					editor.focus();
				}

			}
		};
	}

	/****************Classname Function****************/
	function hasClick(ele) {
		var c_name = ele.className;
		var cls = c_name.split(" ");
		if(cls.indexOf("has-click") > -1) {
			return true;
		}
		return false;

	}
	//移除所有对齐按钮的点击样式
	function removeAligntHit() {
		for (var i = 0; i < aligns.length; i++) {
			var cls = aligns[i].className.split(" ");
			var index = cls.indexOf("has-click");
			if(index > -1 ) {
				cls.splice(index);
				aligns[i].className = cls.join(" ").toString();
			}
		};
	}
	//删除类名
	function removeClass(ele, cls_name) {
		var c_name = ele.className;
		var cls = c_name.split(" ");
		cls.splice(cls.indexOf(cls_name));
		ele.className = cls.join(" ").toString();
	}
	//添加类名
	function addClass(ele, cls_name) {
		if((typeof cls_name) != "string") {
			console.error("c_name is not string");
			return;
		}
		var c_name = ele.className;
		var cls = c_name.split(" ");
		cls.push(cls_name);
		ele.className = cls.join(" ").toString();
	}
	/****************Classname Function End****************/

	//透明度降低
	/**
		@param r true 表示要求添加dark
		@param r false 表示要求删除dark
	*/
	var darkbg;
	function darken(r) {
		if(typeof r != 'boolean') {
			console.error('argument must is boolean');
			return;
		}
		if(r) {
			//检查darkbg是否已经存在
			if(!has_darkbg) {		
				darkbg = document.createElement('div');
				darkbg.className = "dialog-dark-bg";
				wraper.appendChild(darkbg);
				has_darkbg = true;
			}
			return;
		}
		else {
			//检查darkbg是否存在
			if(has_darkbg) {
				wraper.removeChild(darkbg);
				has_darkbg = false;
			}
			return;
		}
	}
	/*************Insert Image Function**************/
	//读取图片，设置imgUrl
	var fr = new FileReader();
	function readImage(f, ele) {
		if(typeof f != 'object') {
			console.log('argument should be object');
			return;
		} 
		fr.readAsDataURL(f);
		//得到选择图片按钮
		document.querySelector("#editor .img-dialog .icon-refresh").style.opacity = 1;
		
		fr.onload = function() {
			imgUrl = fr.result;
			document.execCommand("insertImage", false, imgUrl);
			/**
		 	* 解决Chrome插入图片之后光标变大的问题
		 	*/	 	
			img_flag = true;
			//移除变暗背景
			// darken(false);
			//关闭加载图像显示
			setTimeout(function() {
				document.querySelector("#editor .img-dialog .icon-refresh").style.opacity = 0;
			}, 200);
			
		}
		fr.onerror = function() {
			console.error("Read image failed");
		}
	}
	//得到insert图片按钮
	var imgInput = document.getElementById("imgInput");
	imgInput.onchange = function(e) {
		console.log(this.files[0]);
		readImage(this.files[0], this);
	}
	imgInput.onclick = function(e) {
		e.stopPropagation(); //阻止事件冒泡，防止二次添加“has-click”类
	}
	//创建新的插入链接对话框
	function createLinkConfirm() {
		var dialog = document.createElement("div");
		dialog.className = 'link-dialog';
		dialog.onselectstart = "return false";
		dialog.innerHTML = '<p>插入链接<span class="icon-remove"></span></p><div><label>请输入链接：</label><span></span><input id="urlinput" type="url"> <label class="btn" style="-webkit-user-select:none;moz-user-select:none;-ms-user-select:none;">确定</lael></div>'
		wraper.appendChild(dialog);
		var head = dialog.getElementsByTagName("p")[0];
		var btn = dialog.querySelector(".btn");
		var off = dialog.querySelector(".icon-remove");
		var urlInput = document.getElementById('urlinput');
		//初始化坐标到屏幕的中间
		var left = (window.innerWidth - dialog.clientWidth) / 2;
		var top = (window.innerHeight - dialog.clientHeight)  / 2;
		dialog.style.left = left + "px";
		dialog.style.top = top + "px";
		//添加鼠标点击事件
		var text,
		isClick = false,
		_px = 0,
		_py = 0;
		head.addEventListener("mousedown", function(e) {
			isClick = true;
			_px = e.clientX;
			_py = e.clientY;
		});
		//添加鼠标移动事件
		document.addEventListener("mousemove", function(e) {
			e.stopPropagation();
			if(isClick) {
				left = left + e.clientX - _px;
				top = top + e.clientY - _py;
				dialog.style.left = left + "px";
				dialog.style.top = top + "px";
				_px = e.clientX;
				_py = e.clientY;
			}
		});
		document.addEventListener("mouseup", function(e) {
			isClick = false;
		});
		
		var reg = /^(https:\/\/|http:\/\/)www\.[^\n\r\t\v]+.(com|net|cn)(\/\w+\.(asp|html|htm|php|jsp))?$/g;
		//为确定按钮添加事件
		btn.addEventListener("click", function(e) {
			//增加点击样式
			addClass(this, "ensure");
			//移除暗背景
			var text = urlinput.value;
			setTimeout(function() {
				removeClass(btn, "ensure")
			}, 200);

			/**
			 * 注册键盘事件
			 * 检测是不是url输入的合法，如果不合法，点击确定按钮没反应
			 */
			if(reg.test(text)) {
				darken(false);
				off.click();
			}
		});

		//为off添加点击关闭事件
		off.addEventListener("click", function(e) {
			//移除暗背景
			darken(false);
			//移除监听器
			head.removeEventListener("mousedown", function(e) {});
			document.removeEventListener("mousemove", function(e) {});
			document.removeEventListener("mouseup", function(e) {});
			btn.removeEventListener("click", function(e) {});
			off.removeEventListener("click", function(e) {});
			wraper.removeChild(dialog)
		});

	}

	// createLinkConfirm()

	//创建新的插入图片对话框
	function insertImageConfirm() {
		var dialog = document.createElement("div");
		dialog.className = 'img-dialog';
		dialog.onselectstart = "return false";
		dialog.innerHTML = '<p>插入图片<span class="icon-remove"></span></p><div><button class="btn">选择图片</button><span class="icon-refresh icon-spin"></span></div>'
		wraper.appendChild(dialog);
		var head = dialog.getElementsByTagName("p")[0];
		var btn = dialog.querySelector(".btn");
		var off = dialog.querySelector(".icon-remove");
		//初始化坐标到屏幕的中间
		var left = (window.innerWidth - dialog.clientWidth) / 2;
		var top = (window.innerHeight - dialog.clientHeight)  / 2;
		dialog.style.left = left + "px";
		dialog.style.top = top + "px";
		//添加鼠标点击事件
		var isClick = false,
		_px = 0,
		_py = 0;
		head.addEventListener("mousedown", function(e) {
			e.stopPropagation();
			isClick = true;
			_px = e.clientX;
			_py = e.clientY;
		});
		//添加鼠标移动事件
		document.addEventListener("mousemove", function(e) {
			e.stopPropagation();
			if(isClick) {
				left = left + e.clientX - _px;
				top = top + e.clientY - _py;
				dialog.style.left = left + "px";
				dialog.style.top = top + "px";
				_px = e.clientX;
				_py = e.clientY;
			}
		});
		document.addEventListener("mouseup", function(e) {
			isClick = false;
		});

		//为选择按钮添加事件
		btn.addEventListener("click", function(e) {
			//增加点击样式
			addClass(this, "ensure");
			setTimeout(function() {
				removeClass(btn, "ensure");
			}, 200);
			imgInput.click();
		});

		//为off添加点击关闭事件
		off.addEventListener("click", function(e) {
			//移除暗背景
			darken(false);
			head.removeEventListener("mousedown", function(e) {});
			document.removeEventListener("mousemove", function(e) {});
			document.removeEventListener("mouseup", function(e) {});
			btn.removeEventListener("click", function(e) {});
			off.removeEventListener("click", function(e) {});
			wraper.removeChild(dialog);
		});

	}
	
	/*************Insert Image Function  End**************/

	/*************Insert Formula**************/
	//插入公式
	function formulaConfirm() {
		var dialog = document.createElement("div");
		dialog.className = 'formula-dialog';
		dialog.onselectstart = "return false";
		dialog.innerHTML = '<div class="head">Tex 公式<span class="icon-remove"></span></div><div><div class="formu-area"><table class="tools"></table><textarea id="formula-text-box" autofocus></textarea></div><div class="preview"><label>预览</label><div class="view"></div></div><div class="btns"><label class="formula-cancel">取消</label><label class="formula-ensure">确定</label></div></div>'
		wraper.appendChild(dialog);
		var head = dialog.getElementsByTagName("div")[0];
		//初始化坐标到屏幕的中间
		var left = (window.innerWidth - dialog.clientWidth) / 2;
		var top = (window.innerHeight - dialog.clientHeight)  / 2;
		var off = dialog.querySelector(".icon-remove");
		var cancel = dialog.querySelector(".formula-cancel");
		var acser = dialog.querySelector(".formula-ensure")
		dialog.style.left = left + "px";
		dialog.style.top = top + "px";
		var textarea = document.getElementById('formula-text-box');
		var selects = [];
		var isClick = false,
		_px = 0,
		_py = 0;
		/* 	. . .
			关闭按钮
			. . .
		*/
		off.onclick = function(e) {
			//移除暗背景
			darken(false);
			head.removeEventListener("mousedown", function(e) {});
			document.removeEventListener("mousemove", function(e) {});
			document.removeEventListener("mouseup", function(e) {});
			off.removeEventListener("click", function(e) {});
			wraper.removeChild(dialog);
		}
		
		//点击取消按钮关闭dialog
		cancel.addEventListener('click', function(e) {
			darken(false);
			head.removeEventListener('mousedown', function(e) {});
			document.removeEventListener('mousemove', function(e) {});
			document.removeEventListener('mouseup', function(e) {});
			off.removeEventListener('click', function(e) {});
			wraper.removeChild(dialog);
		}, false)
		
		//点击确定按钮关闭按钮
		acser.addEventListener('click', function(e) {
			/**
			 * ...
			 * 公式编辑器里的内容插入文本编辑器中
			 * ...
			 */
			darken(false);
			head.removeEventListener('mousedown', function(e) {});
			document.removeEventListener('mousemove', function(e) {});
			document.removeEventListener('mouseup', function(e) {});
			off.removeEventListener('click', function(e) {});
			wraper.removeChild(dialog);
		})

		//添加鼠标点击事件
		head.addEventListener("mousedown", function(e) {
			e.stopPropagation();
			isClick = true;
			_px = e.clientX;
			_py = e.clientY;
		});
		//添加鼠标移动事件
		document.addEventListener("mousemove", function(e) {
			e.stopPropagation();
			if(isClick) {
				left = left + e.clientX - _px;
				top = top + e.clientY - _py;
				dialog.style.left = left + "px";
				dialog.style.top = top + "px";
				_px = e.clientX;
				_py = e.clientY;
			}
		});
		document.addEventListener("mouseup", function(e) {
			isClick = false;
		});

		//...
		var simple; //希腊字符
		function createItemsSimple(parent) {
			simple = document.createElement('table');
			simple.className = "simple";

			var tbody = document.createElement('tbody');

			//选择table的方式来显示各个tag
			for (var i = 0, j = -1; i < 40; i++) {
				if(i%8 == 0) {
					//创建新的一行
					j++;
					tbody.insertRow(j);
				}
				var tag = document.createElement('div');
				tag.className = 'tag simple-item'
				tag.style.width = '18px'
				tag.style.height = '20px';
				tag.style.backgroundPosition = -i * 18 + 'px -25px'
				tbody.rows[j].insertCell(i%8);
				tbody.rows[j].cells[i%8].appendChild(tag);
			};
			simple.appendChild(tbody);
			selects.push(simple);
			parent.appendChild(simple);
		}

		var opreator;
		function createItemsOperator(parent) {
			opreator = document.createElement('table');
			opreator.className = "opreator";

			var tbody = document.createElement('tbody');

			//选择table的方式来显示各个tag
			for (var i = 0, j=-1; i < 33; i++) {
				if(i%8 == 0) {
					//创建新的一行
					j++;
					tbody.insertRow(j);
				}
				var tag = document.createElement('div');
				tag.className = 'tag opreator-item'
				tag.style.width = '18px'
				tag.style.height = '20px';
				tag.style.backgroundPosition = -i * 18 + 'px -48px'
				tbody.rows[j].insertCell(i%8);
				tbody.rows[j].cells[i%8].appendChild(tag);
			};
			opreator.appendChild(tbody);
			selects.push(opreator);
			parent.appendChild(opreator);
		}

		var brackets;
		function createBrackets(parent) {
			brackets = document.createElement('table');
			brackets.className = "brackets";

			var tbody = document.createElement('tbody');

			//选择table的方式来显示各个tag
			for (var i = 0, j = -1; i < 21; i++) {
				if(i%8 ==0 ) {
					//创建新的一行
					j++;
					tbody.insertRow(j);
				}
				var tag = document.createElement('div');
				tag.className = 'tag brackets-item'
				tag.style.width = '18px'
				tag.style.height = '20px';
				tag.style.backgroundPosition = -i * 18 + 'px -65px'
				tbody.rows[j].insertCell(i%8);
				tbody.rows[j].cells[i%8].appendChild(tag);
			};
			brackets.appendChild(tbody);
			selects.push(brackets);
			parent.appendChild(brackets);
		}

		var powers;
		function createPowers(parent) {
			powers = document.createElement('table');
			powers.className = "powers";

			var tbody = document.createElement('tbody');

			//选择table的方式来显示各个tag
			for (var i = 0, j = -1; i < 19; i++) {
				if(i%8 ==0 ) {
					//创建新的一行
					j++;
					tbody.insertRow(j);
				}
				var tag = document.createElement('div');
				tag.className = 'tag powers-item'
				// tag.style.width = '30px'
				// tag.style.height = '50px';
				if(i > 7) {
					tag.style.width = '30px'
					tag.style.height = '60px';
					tag.style.backgroundPosition = -i * 30 + 'px -90px';
				}
				else {	
					tag.style.width = '30px'
					tag.style.height = '40px';			
					tag.style.backgroundPosition = -i * 30 + 'px -95px';
				}
				tbody.rows[j].insertCell(i%8);
				tbody.rows[j].cells[i%8].appendChild(tag);
			};
			powers.appendChild(tbody);
			selects.push(powers);
			parent.appendChild(powers);
		}

		var logics;
		function createLogics(parent) {
			logics = document.createElement('table');
			logics.className = "logics";

			var tbody = document.createElement('tbody');
			//选择table的方式来显示各个tag
			for (var i = 0, j = -1; i < 12; i++) {
				if(i%8 ==0 ) {
					//创建新的一行
					j++;
					tbody.insertRow(j);
				}
				var tag = document.createElement('div');
				tag.className = 'tag logics-item'
				tag.style.width = '18px'
				tag.style.height = '20px';
				tag.style.backgroundPosition = -i * 18 + 'px -150px'
				tbody.rows[j].insertCell(i%8);
				tbody.rows[j].cells[i%8].appendChild(tag);
			};
			logics.appendChild(tbody);
			selects.push(logics);
			parent.appendChild(logics);
		}

		//创建公式工具栏中字符选择器
		function addFormulaSelects() {
			createItemsSimple(head);
			createItemsOperator(head);
			createBrackets(head);
			createPowers(head);
			createLogics(head);
		}
		//使所有字符选择器display:none
		function hideAllSelects() {
			for (var i = 0; i < selects.length; i++) {
				//检查各个元素的display属性
				if(selects[i].style.display != 'none') {
					selects[i].style.display = 'none';
				}
			};
		}

		addFormulaSelects();
		hideAllSelects();
		(function() {
			//为table添加单元格
			var table = document.querySelector(".formula-dialog .tools");
			var tbody = document.createElement("tbody");

			//创建表格
			tbody.insertRow(0);
			tbody.rows[0].insertCell(0);
			tbody.rows[0].insertCell(1);
			tbody.rows[0].insertCell(2);
			tbody.rows[0].insertCell(3);
			tbody.rows[0].insertCell(4);

			for (var i = 0; i < tbody.rows[0].cells.length; i++) {
				var div = document.createElement("div");
				div.className = "formula-item";
				if(i == 0) {
					/*
						希腊字符simple
					*/
					div.onclick = function(e) {
						hideAllSelects();
						simple.style.display = 'table';
						textarea.focus();
					}
					
				}
				else if(i == 1) {
					/*
						运算符operator
					*/
					div.onclick = function(e) {
						hideAllSelects();
						opreator.style.display = 'table';
						textarea.focus();
					}
					// createItemsOperator(head);
				}
				else if(i == 2) {
					/*
						括号等bracket
					*/
					div.onclick = function(e) {
						hideAllSelects();
						brackets.style.display = 'table';
						textarea.focus();
					}
					// createBrackets(head);
				}
				else if(i == 3) {
					/*
						次方等powers
					*/
					div.onclick = function(e) {
						hideAllSelects();
						powers.style.display = 'table';
						textarea.focus();
					}
					// createPowers(head);
				}
				else if(i == 4) {
					/*
						逻辑符号logic
					*/
					div.onclick = function(e) {
						hideAllSelects();
						logics.style.display = 'table';
						textarea.focus();
					}
					// createLogics(head);
				}
				div.style.width = "46px";
				div.style.height = "18px";
				div.style.backgroundPosition = -i * 46 + "px 0px";
				tbody.rows[0].cells[i].appendChild(div);
			};

			table.appendChild(tbody)
		}) ()
	}
	
	/**
	 * 返回当前的文本内容
	 */
	function getText() {
		/**
		 * ...待写
		 */
	}
	/**
	 * @param timeout 时间间隔
	 * @param func 回调函数
	 */
	function save(timeout, func) {
		

	}
	
	/*************Insert Formula  End**************/
	//执行方法
	createEditor();
	editor.focus();
	buttonEvent();
	



}) (document);

// editor.apperScroll(false)