function Add_Dragging(_obj)
{
	_obj.inputEnabled = true;
	_obj.input.enableDrag();
}

function getRandom(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
