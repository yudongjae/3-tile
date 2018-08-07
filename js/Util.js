function Add_DraggingAndBound(_obj)
{
	_obj.inputEnabled = true;
	_obj.input.enableDrag(false, true);

	//_obj.input.boundsRect = BoundRect;
}

function getRandom(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
