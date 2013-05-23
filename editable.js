(function( $, undefined ) {

$.widget('silexlabs.editable', {
	version: '1.0.0',
	options: {
        mode: 'in-place',
        isContainer: false,
	},
	// _setOption is called for each individual option that is changing
	_setOption: function( key, value ) {
		console.log('set option '+key+'='+value);
		console.log(this.options.mode);
		console.log(this.options.isContainer);
		switch(key){
			case 'isContainer':
				this.setMode('disabled');					
				this.setMode(this.options.mode);
				break;
			case 'mode':
				this.setMode(value);
				break;
			case 'disabled':
				if (value==true){
					this.setMode('disabled');					
				}
				else{
					this.setMode(this.options.mode);
				}
				break;
		}
		this.options[key] = value;
	},
	_create: function() {
		this.setMode('created');
	},
	_destroy: function() {
		this.setMode('destroyed');
	},
	setMode : function (mode) {
		//console.log('setMode '+mode);
		switch (mode){
			case 'created':
				this.setDomMode(true);
				this.setDomMode(false);
				this.setInPlaceMode(true);
				//this.setInPlaceMode(false);
				break;
			case 'destroyed':
				this.element.resizable('destroy').draggable('destroy');
				if (this.options.isContainer){
					this.element.droppable('destroy');
				}
				break;
			case 'disabled':
				this.element.resizable('disable').draggable('disable');
				break;
			case 'in-place':
				this.setDomMode(false);
				this.setInPlaceMode(true);
				break;
			case 'dom':
				this.setInPlaceMode(false);
				this.setDomMode(true);
				break;
		}
	},
	/**
	 * turn dom edition mode on/off
	 */
	setInPlaceMode : function (onOff) {
		if (onOff==false){
			// unset in-place edition mode
			this.element.resizable().draggable({ 
				containment: null,
			});
			this.element.resizable('disable').draggable('disable');
		}
		else{
			// set in-place edition mode
			this.element.resizable().draggable({ 
				containment: 'parent'
			});
			this.element.resizable('enable').draggable('enable');
		}
	},
	/**
	 * turn dom edition mode on/off
	 */
	setDomMode : function (onOff) {
		if (onOff==false){
			// unset dom edition mode
			this.element.draggable({revert:undefined});
			this.element.draggable('disable');
			if (this.options.isContainer){
				this.element.droppable('disable');
			}
		}
		else{
			console.log('setDomMode '+this.options.isContainer);
			// set dom edition mode
			this.element.draggable({ revert: 'invalid' });
			this.element.draggable('enable');
			// set as dropable if it is a container
			if (this.options.isContainer){
				this.element.droppable({
					// prevent propagation
					greedy: true,
					
					drop: function( event, ui ) {
						// reference to the elements
						var dropped = ui.draggable;
						var droppedFrom = $(dropped).parent();
						var droppedTo = this;

						// compute new position in the container
						console.log('drop ');

						// keep initial position
						var initialOffset = $(dropped).offset();
						
						// move to the new container
						$(dropped).detach().appendTo($(droppedTo));
						
						// compute new position
						var newOffset = $(dropped).offset();
						var deltaTop = initialOffset.top - newOffset.top;
						var deltaLeft = initialOffset.left - newOffset.left;
						var newPosTop = $(dropped).position().top + deltaTop;
						var newPosLeft = $(dropped).position().left + deltaLeft;

						// put back at the same position
						$(dropped).css({top: newPosTop+'px',left: newPosLeft+'px'});
			    	}
			    });
			    this.element.droppable('enable');
			}
		}
	},
});
})(jQuery);