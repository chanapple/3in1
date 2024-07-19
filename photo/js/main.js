// 함수
//미니 팔레트 함수 정의
function setupColorButtonListener(buttonId, canvas) {
	//미니 팔레트 버튼 클릭 시 brush_color 변경.
	document.getElementById(buttonId).addEventListener("click", () => {
		var brush_color = buttonId;
		canvas.freeDrawingBrush.color = brush_color;
		document.getElementById("color-picker").value = buttonId;
		colorPickerBackgroundColor(brush_color); //클릭한 버튼의 색상으로 팔레트 색상 변경.
	});
}

//인자 값으로 팔레트 색상 변경하는 함수.
function colorPickerBackgroundColor(brush_color) {
	document.querySelectorAll(".sp-colorize").forEach(div => {
		div.style.backgroundColor = brush_color;
	});
}

// 모든 .color_button 클래스 버튼에 대해 id=backgroundColor로 설정함.(css 통일 위해 사용)
document.querySelectorAll(".color_button").forEach(button => {
	button.style.backgroundColor = button.id;
	button.value = button.id;
});

//저장 함수 정의
function handleSaveClick() {
	const image = canvas.toDataURL("image/png");
	const link = document.createElement("a");
	link.href = image;
	link.download = "PaintJS[EXPORT]";
	link.click();
}

//상태 기록 함수
function saveHistory(state) {
	history.push(state);
}

//Ctrl+Z 단축키(=뒤로가기) 함수
function keysPressed(e) {
	keys[e.keyCode] = true;
	// Ctrl + Z
	if (keys[17] && keys[90]) {
		document.getElementById("undo").click();
	}
}
function keysReleased(e) {
	keys[e.keyCode] = false;
}

//변수
//초기화 제어 변수
let clearControl = false;
//그리기 모드 제어 변수
let drawingControl = true;
//처음 캔버스 색상
let canvasBackgroundColor = "white";
let brush_color;
let brush_size;
//상태 기록 저장
let history = [];
let keys = [];

//캔버스
// HTML 문서가 완전히 로드될 때까지 기다린 후 코드를 실행
document.addEventListener("DOMContentLoaded", function () {
	//id=canvas를 이용해서 canvas 만듦
	let canvas = new fabric.Canvas("canvas", {
		isDrawingMode: drawingControl, // 그리기 모드 활성화
		backgroundColor: canvasBackgroundColor // 캔버스 배경색을 흰색으로 설정
	});

	// freeDrawingBrush가 undefined라서 PencilBrush를 수동으로 설정함.
	canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

	// 기본 그리기 브러시 너비와 색상 설정.
	canvas.freeDrawingBrush.width = 5;
	canvas.freeDrawingBrush.color = "#007FA1";

	//브러시 크기 변경.
	document.getElementById("brush_size").addEventListener("change", event => {
		let brushSizeValue = document.getElementById("brush_size_value");
		brushSizeValue.textContent = event.target.value;
		brush_size = parseInt(event.target.value, 10);
		canvas.freeDrawingBrush.width = brush_size;
	});

	// 팔레트 설정
	$("#color-picker").spectrum({
		type: "component",
		showPalette: false,
		showPaletteOnly: true,
		togglePaletteOnly: true,
		showInput: true,
		showInitial: true
	});
	//팔레트 색상 변경 시 브러시 색상 동일하게 변경.
	$("#color-picker").on("move.spectrum", function (e, tinycolor) {
		brush_color = "#" + tinycolor.toHex();
		canvas.freeDrawingBrush.color = brush_color;
	});

	// 미니 팔레트 클릭에 대한 이벤트 리스너
	setupColorButtonListener("#E1B1CA", canvas);
	setupColorButtonListener("#B19DC9", canvas);
	setupColorButtonListener("#6F8EBE", canvas);
	setupColorButtonListener("#007FA1", canvas);

	//"photoMode" 변경 이벤트 리스터
	let modeButton = document.getElementById("photoMode"); //photoMode 버튼 찾아서 할당함.
	modeButton.addEventListener("click", event => {
		//pen 상태에서 클릭했을 때
		if (event.currentTarget.value == "pen") {
			drawingControl = false; //pen 비활성화
			event.currentTarget.value = "select";
			event.currentTarget.innerHTML =
				'State: <img id="mode" src="photo/img/icon/select.png" style="width: 20px" />';
		} else {
			drawingControl = true; //pen 활성화
			event.currentTarget.value = "pen";
			event.currentTarget.innerHTML =
				'State: <img id="mode" src="photo/img/icon/pen.png" style="width: 20px" />';
		}
		canvas.isDrawingMode = drawingControl;
	});

	//"파일 업로드"
	document.getElementById("photofile").addEventListener("change", event => {
		//로컬 파일의 url 읽어오기
		const file = event.target.files[0];
		const url = URL.createObjectURL(file);
		//이미지로 불러오기
		var newImage = new Image();
		newImage.src = url;
		//이미지 불러오기
		newImage.onload = function (img) {
			let imgWidth = this.width;
			let imgHeight = this.height;
			let screenWidth = window.innerWidth - 10; //윈도우 화면 가로 크기
			let screenHeight = window.innerHeight - 10; //윈도우 화면 세로 크기
			let ratio = 1; //비율 저장 변수(크지 않으면 원본으로 나옴.)
			//이미지가 윈도우 화면 크기 보다 크다면
			if (imgWidth > screenWidth || imgHeight > screenHeight) {
				//윈도우 크기에 맞게 축소할 이미지 비율 구하기
				let widthRatio = screenWidth / imgWidth;
				let heightRatio = (screenHeight - 200) / imgHeight;
				//이미지 가로/세로 비율 중 어디에 맞출지 정하기(더 큰쪽=비율은 더 작아짐)
				if (heightRatio < widthRatio) {
					ratio = heightRatio;
				} else {
					ratio = widthRatio;
				}
			}
			//이미지 객체 만듦.
			var photo = new fabric.Image(newImage, {
				width: imgWidth,
				height: imgHeight
			});
			//구한 비율에 맞게 이미지 크기 설정, 이미지에 맞게 캔버스 크기 설정.
			photo.scale(ratio);
			canvas.setWidth(imgWidth * ratio);
			canvas.setHeight(imgHeight * ratio);
			canvas.renderAll();
			canvas.add(photo);
		};
	});

	//스티커 img 요소 추가하는 for문
	const sticker_container = document.getElementById("sticker_container");
	for (let i = 1; i < 7; i++) {
		// Image 객체 생성
		const img = new Image();
		// src 속성에 파일 주소 지정
		img.value = "img" + i;
		img.id = "img" + i;
		let src = "/photo/img/sticker/img" + i + ".png";
		img.src = src;
		img.onclick = function () {
			addImg(img.value);
		};
		// 요소에 삽입
		sticker_container.appendChild(img);
		img.style = "height: 100%; object-fit: cover";
	}

	//addImg 함수
	function addImg(imgValue) {
		let targetImg = document.getElementById(imgValue);
		let imageUrl = targetImg.src;
		if (imageUrl) {
			let stickerImg = new Image(); // const 또는 let으로 한 번만 선언
			stickerImg.onload = function () {
				const sticker = new fabric.Image(stickerImg);
				canvas.add(sticker);
			};
			stickerImg.src = imageUrl;
		}
	}

	// "저장" 버튼 클릭에 대한 이벤트 리스너
	const saveBtn = document.getElementById("photoSave");
	if (saveBtn) {
		saveBtn.addEventListener("click", handleSaveClick);
	}

	//"실행 취소"에 대한 이벤트 리스너
	document.getElementById("undo").addEventListener("click", () => {
		if (history.length > 0) {
			history.pop();
		}
		if (canvas._objects.length > 0) {
			canvas._objects.pop();
		}
		canvas.renderAll();
	});

	//history 배열에 저장.
	canvas.on("object:added", handleObjectEvent);
	canvas.on("object:modified", handleObjectEvent);
	canvas.on("object:removed", handleObjectEvent);

	function handleObjectEvent(e) {
		if (e.target) {
			canvas.setActiveObject(e.target);
		}
		saveHistory(e);
		socket.emit("sendCanvas", canvas.toJSON());
	}

	//"Ctrl+Z"에 대한 이벤트 리스너
	window.addEventListener("keydown", keysPressed, false);
	window.addEventListener("keyup", keysReleased, false);

	//캔버스 초기화
	document.getElementById("clearCanvas").addEventListener("click", () => {
		canvas.clear(); // 캔버스 초기화
		canvas.backgroundColor = canvasBackgroundColor; // 배경색 다시 설정
		canvas.renderAll(); // 캔버스 다시 렌더링
		// freeDrawingBrush 수동 설정.
		canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
		//brush_color 재설정.
		canvas.freeDrawingBrush.color =
			document.getElementById("color-picker").value;
		//brush_size 재설정.
		canvas.freeDrawingBrush.width = parseInt(
			document.getElementById("brush_size").value,
			10
		);
	});

	// Socket.IO 클라이언트 생성(객체를 통해 서버와 통신가능.)
	const socket = io();

	// 소켓 연결되면
	socket.on("connect", () => {
		console.log("Connected to the server", socket.id);
		socket.emit("getCanvas", socket.id);
	});

	socket.on("receiveCanvas", data => {
		console.log("receiveCanvas", data, canvas);
		if (data) {
			canvas.loadFromJSON(data).then(function () {
				canvas.renderAll();
			});
		}
		canvas.renderAll();
	});

	// 유저가 그린 그림 객체 받아오기. 서버에서 draw 이벤트가 발생하면 실행되는 콜백함수.
	socket.on("draw", data => {
		console.log("Draw event received:", data, canvas);
		//"fabric.util.enlivenObjects"은 JSON 데이터를 Fabric.js 객체로 변환하는 함수.
		//[data]는 서버에서 전송된 데이터를 배열로 감싼 것
		// fabric.util.enlivenObjects([data], objects => {
		// 	console.log(objects);
		// 	objects.forEach(obj => {
		// 		canvas.add(obj); // 그림판에 그림을 추가함.
		// 		console.log("Object added to canvas:", obj);
		// 		// console.log(obj + "그림판에 그림 추가함.");
		// 	});
		// });
		try {
			// 데이터가 path 타입인지 확인
			if (data.type === "path" || data.type === "Path") {
				// Fabric.js Path 객체로 변환
				const path = new fabric.Path(data.path, data);
				canvas.add(path);
				console.log("Path object added to canvas:", path);
			} else {
				console.error("Unsupported object type:", data.type);
			}
		} catch (error) {
			console.error("Error parsing data:", error);
		}
	});

	// 유저가 그림을 그릴 때
	canvas.on("mouse:up", () => {
		// console.log("마우스 업 입력됨.");
		// 지금 그린 그림 객체 가져오기
		const activeObject = canvas.getActiveObject();
		// console.log(activeObject);
		if (activeObject) {
			// 그 그림 객체를 JSON 데이터로 변환함.
			const objectData = activeObject.toObject();
			// 서버에 그림 객체 데이터를 전송함. 서버에게 보낸 데이터로 draw 이벤트 함수 실행시키라함.
			socket.emit("draw", objectData);
			// console.log(objectData);
			// console.log("index.js에 있는 draw에 " + objectData + " 보냄");
		}
	});
});
