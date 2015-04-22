(function (window, document, $)
{
	function debounce (fn, delay, context)
	{
		var timer = null;

		return function ()
		{
			var args = arguments, context = this;

			clearTimeout(timer);

			timer = setTimeout(function ()
			{
				fn.apply(context, args);

			}, delay);
		};
	}

	function throttle(fn, threshhold, scope) {

	  var last,
	      deferTimer;

	  return function () {

	    var context = scope || this,
	    	now = +new Date(),
	        args = arguments;

	    if (last && now < last + threshhold) 
	    {
	     	clearTimeout(deferTimer);

			deferTimer = setTimeout(function () 
			{
				last = now;
				fn.apply(context, args);
			}, threshhold);
			} 
			else 
			{
				last = now;
				fn.apply(context, args);
			}
	  	};
	}

	function ScrollClass (el, options)
	{
		this.$items = $(el);
		this.items  = el;

		this.options = $.extend({}, this.defaultOptions, options);

		this._init();
	}

	ScrollClass.prototype.version = 1.0;

	ScrollClass.prototype.defaultOptions =
	{
		viewport         : window,
		offset           : 0,
		attribute        : 'data-scroll-class',

		debounce         : false,
		throttle         : true,
		delay            : 250,

		runOnInit      : true,
		removeOnScroll : false,
		cachePositions : true,

		addClass     : null,
		removeClass  : null
	};

	ScrollClass.prototype._init = function ()
	{
		if (this.options.cachePositions) this._cachePositions();

		if (this.options.runOnInit) this._isInView();

		this._events();
	};

	ScrollClass.prototype._cachePositions = function ()
	{	
		var self = this;

		this.$items.each(function ()
		{	
			var item = $(this);

			item.data('positionTop', self._itemTopPosition(item));
		});
	};

	ScrollClass.prototype._events = function ()
	{	
		var self = this,
			fn   = (this.options.throttle) ? throttle : debounce;

		$(this.options.viewport).on('scroll', fn(function (event)
		{
			self._isInView();

		}, self.options.delay));
	};

	ScrollClass.prototype._itemTopPosition = function (item)
	{
		return item.offset().top + item.outerHeight() + this.options.offset;
	};

	ScrollClass.prototype._isInView = function ()
	{
		var self = this;

		this.$items.each(function ()
		{	
			var item           = $(this),
				viewport       = $(self.options.viewport),
				viewportBottom = viewport.scrollTop() + viewport.height(),
				itemTop        = (self.options.cachePositions) ? item.data('positionTop') : self._itemTopPosition(item);

			if (viewportBottom > itemTop)
			{
				self._action('add', item);
			}
			else if (viewportBottom < itemTop && self.options.removeOnScroll)
			{
				self._action('remove', item);
			}
		});
	};

	ScrollClass.prototype._action = function (action, item)
	{
		if (item.attr(this.options.attribute))
		{
			var classes = item.attr(this.options.attribute).split(' ');

			$.each(classes, function (i, e)
			{
				item[action + 'Class'](e);
			});

			if ($.isFunction(this.options[action + 'Class'])) this.options[action + 'Class'].call(this);
		}
	};

	function Plugin (options)
	{	
		new ScrollClass(this, options);

		return this;
	}

	$.fn.scrollClass             = Plugin;
	$.fn.scrollClass.constructor = ScrollClass;

}(window, document, jQuery));