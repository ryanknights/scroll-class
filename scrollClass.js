(function (window, document, $)
{	
	function throttle (delay, fn, context)
	{
		var previous = new Date().getTime();

		return function ()
		{
			var time = new Date().getTime();

			if ((time - previous) >= delay)
			{
				previous = time;

				fn.call(context);
			}
		}
	}

	function ScrollClass (el, options)
	{
		this.$items = $(el);
		this.items  = el;

		this.options = $.extend({}, this.defaultOptions, options);

		this._init();
	};

	ScrollClass.prototype.version = 1.0;

	ScrollClass.prototype.defaultOptions =
	{
		viewport       : window,
		offset         : 0,
		attribute      : 'data-scroll-class',
		throttle       : 250,

		runOnInit      : true,
		removeOnScroll : false,
		cachePositions : true,

		addClass     : null,
		removeClass  : null
	};

	ScrollClass.prototype._init = function ()
	{
		this.options.cachePositions && this._cachePositions();

		this.options.runOnInit && this._isInView();

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
		var self = this;

		$(this.options.viewport).on('scroll', throttle(this.options.throttle, this._isInView, this));
	};

	ScrollClass.prototype._itemTopPosition = function (item)
	{
		return item.offset().top + item.outerHeight() + this.options.offset;
	}

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

			$.isFunction(this.options[action + 'Class']) && this.options[action + 'Class'].call(this);
		}
	};

	function Plugin (options)
	{	
		new ScrollClass(this, options);

		return this;
	};

	$.fn.scrollClass             = Plugin;
	$.fn.scrollClass.constructor = ScrollClass;

}(window, document, jQuery))