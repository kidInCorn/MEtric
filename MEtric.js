// JavaScript source code
MEtric = function (settings)
{
	this.defaults =
	{

	};
	if ( !settings )
		settings = this.defaults;

	this.container = settings.container || document.body;
	this.data = settings.data || {};
	this.date = settings.date ? new Date( settings.date ) : new Date();

	this._pastFutureStep = 2;
	this._dom = null;
	this._yearsDom = null;
	this._monthsDom = null;
	this._daysDom = null;
	this.render();
};

MEtric.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
MEtric.contex = {};

MEtric.getContext = function ( event )
{
	var path = event.path, domNode,
		pathLength = path.length, i, context;

	for ( i = 0; i < pathLength; i++ )
	{
		domNode = path.item( i );
		if ( domNode.id && domNode.id.indexOf( "MEtric" ) > -1 )
		{
			context = MEtric.contex[domNode.id];
			break;
		}
	}

	return context;
};

MEtric.prototype.render = function ()
{
	this._dom = document.createElement( "div" );
	this._dom.className = "MEtric";
	this._yearsDom = document.createElement( "table" );
	this._yearsDom.className = "MEtricYears";
	this._monthsDom = document.createElement( "table" );
	this._monthsDom.className = "MEtricMonths";
	this._daysDom = document.createElement( "div" );
	this._daysDom.className = "MEtricDays";
	this._saveContext();

	this._yearsDom.addEventListener( "click", this._clickHandlerYear );
	this._monthsDom.addEventListener( "click", this._clickHandlerMonth );

	this.parseData();
	this.initCalendar();

	this._dom.appendChild( this._yearsDom );
	this._dom.appendChild( this._monthsDom );
	this._dom.appendChild( this._daysDom );

	this.container.appendChild(this._dom);
};

MEtric.prototype.parseData = function ()
{
	this._metrics = this.data.metrics || {};
	this._timeline = this.data.timeline;
};

MEtric.prototype.setDate = function ( date )
{
	this.date = new Date(date.year, date.month, 1);
	this.clearCalendar();
	this.initCalendar();
};

MEtric.prototype.clearCalendar = function ()
{
	this._yearsDom.innerHTML = "";
	this._monthsDom.innerHTML = "";
	this._daysDom.innerHTML = "";
}

MEtric.prototype.initCalendar = function ()
{
	var year = this.date.getFullYear(),
		startYear = year - this._pastFutureStep,
		endYear = year + this._pastFutureStep, i,
		yearBasicItem = document.createElement( "td" ), yearItem,
		yearsRow = document.createElement( "tr" ),
		monthBasicItem = document.createElement( "td" ), monthItem, monthName,
		monthsRow = document.createElement( "tr" ),
		dayBasicItem = document.createElement( "td" ), dayItem,
		daysCount = daysInMonth( this.date.getMonth() + 1, year ),
		daysFirstRow = document.createElement( "tr" ),
		daysSecondRow = daysFirstRow.cloneNode( false ),
		daysFirstTable = document.createElement( "table" ),
		daysSecondTable = daysFirstTable.cloneNode(false);
	
	yearBasicItem.className = "MEtricYearsItem";
	for (i = startYear; i <= endYear; i++)
	{
		yearItem = yearBasicItem.cloneNode( false );
		yearItem.id = i + "year";
		yearItem.innerText = i;
		yearsRow.appendChild(yearItem);
	}
	this._yearsDom.appendChild(yearsRow);

	monthBasicItem.className = "MEtricMonthsItem";
	for ( i = 0; i < 12; i++ )
	{
		monthItem = monthBasicItem.cloneNode( false );
		monthName = MEtric.months[i];
		monthItem.id = "ME" + monthName;
		monthItem.innerText = monthName;
		monthsRow.appendChild( monthItem );
	}
	this._monthsDom.appendChild(monthsRow);

	dayBasicItem.className = "MEtricDaysItem";
	for (i = 1; i <= daysCount; i++)
	{
		dayItem = dayBasicItem.cloneNode( false );
		dayItem.id = "ME" + i + "day";
		dayItem.innerText = i;
		if ( i < 18 )
			daysFirstRow.appendChild( dayItem );
		else
			daysSecondRow.appendChild( dayItem );
	}
	daysFirstTable.appendChild( daysFirstRow );
	daysSecondTable.appendChild( daysSecondRow );
	this._daysDom.appendChild( daysFirstTable );
	this._daysDom.appendChild( daysSecondTable );
};

MEtric.prototype._saveContext = function ()
{
	var id = "MEtric" + Math.round( Math.random() * 1000 );
	this._dom.id = id;
	MEtric.contex[id] = this;
};

MEtric.prototype._clickHandlerYear = function ( event )
{
	var metric = MEtric.getContext( event ),
		year, target = event.target;

	if (target.className === "MEtricYearsItem")
	{
		year = parseInt( target.innerText );
		metric.setDate( { year: year, month: metric.date.getMonth() } );
	}
};

MEtric.prototype._clickHandlerMonth = function ( event )
{
	var metric = MEtric.getContext( event ),
		month, target = event.target;

	if ( target.className === "MEtricMonthsItem" )
	{
		month = MEtric.months.indexOf( target.innerText );
		metric.setDate( { year: metric.date.getFullYear(), month: month } );
	}

};

//other functions

function daysInMonth( month, year )
{
	return new Date( year, month, 0 ).getDate();
}