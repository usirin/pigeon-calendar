
// these are labels for the days of the week
days_labels_us = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
days_labels_eu = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// these are human-readable month name labels, in order
months_labels = ['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];

region = "eu";

// these are the days of the week for each month, in order
days_in_month = [31, 999, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// current date
current_date = new Date();

/**
 * Calculates if the given year is a leap year or not. If so it returns the february length as 29, otherwise 28.
 *
 * @param year
 * @return {Number} - 29 if it is a leap year, otherwise 28.
 */
var calculateLeapYear = function(year)
{
    var february_length = 28;

    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0){
        february_length = 29;
    }

    return february_length;
};


/**
 * Calculates the row number for given month.
 *
 * @param starting_day_of_month - the day of the first day of the month.
 * @param month_length - length of the given month
 * @return {Number} - can be 4, 5, 6 depending on the month and the first day of month.
 */
var calculateRowNumber = function(starting_day_of_month, month_length)
{
    if( (starting_day_of_month >= 5 && month_length === 31) || (starting_day_of_month === 6 && month_length === 30) )
    {
        return 6;
    }
    else if( starting_day_of_month === 0 && month_length === 28)
    {
        return 4;
    }
    else
    {
        return 5;
    }
};


/**
 * Creates Calendar.
 *
 * @param month
 * @param year
 * @constructor
 */
function Calendar(month, year)
{

    if(isNaN(month) || month === null)
    {
        this.month = current_date.getMonth();
    }
    else
    {
        this.month = month;
    }

    if(isNaN(year) || year === null)
    {
        this.year = current_date.getFullYear();
    }
    else
    {
        this.year = year;
    }

    this.html = '';

};

/**
 * calculates the previous month, depending on the this month.
 */
Calendar.prototype.getPreviousMonth = function()
{

    console.log("asdasd");
    var calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    if(this.month === 0)
    {
        console.log("a222sdasd");

        this.month = 11;
        this.year -= 1;
    }
    else
    {
        console.log("asd333asd");

        console.log(this.month);
        this.month -= 1;
        console.log(this.month);
    }

    /*
     if(region === "us")
     {
     this.generateHTMLUs();
     }
     else if(region === "eu")
     {
     this.generateHTMLEu();
     } */
    console.log("asd5555asd");

    this.generateHTMLEu();
    console.log("asd6666sasd");


};

/**
 * calculates the next month, depending on the this month.
 */
Calendar.prototype.getNextMonth = function()
{
    var calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    if(this.month === 11)
    {
        this.month = 0;
        this.year += 1;
    }
    else
    {
        this.month += 1;
    }

    /*
     if(region === "us")
     {
     this.generateHTMLUs();
     }
     else if(region === "eu")
     {
     this.generateHTMLEu();
     } */
    this.generateHTMLEu();

};

Calendar.prototype.getNextYear = function()
{
    var calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    this.year += 1;

    if(region === "us")
    {
        this.generateHTMLUs();
    }
    else if(region === "eu")
    {
        this.generateHTMLEu();
    }
};


Calendar.prototype.getPreviousYear = function()
{
    var calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    this.year -= 1;

    if(region === "us")
    {
        this.generateHTMLUs();
    }
    else if(region === "eu")
    {
        this.generateHTMLEu();
    }
};


Calendar.prototype.backToToday = function()
{
    var calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    this.month = current_date.getMonth();
    this.year = current_date.getFullYear();


    if(region === "us")
    {
        this.generateHTMLUs();
    }
    else if(region === "eu")
    {
        this.generateHTMLEu();
    }

};


/**
 * generates the html code depending on all of the variables that has been created before.
 */
Calendar.prototype.generateHTMLUs = function()
{

    var calendar = document.getElementById("calendar");


    var html = "<table class='table table-bordered'>";

    html += "<tr><td colspan='7' style='vertical-align: middle;'><div class='pull-left'><h4> "+ months_labels[this.month] + ", " + this.year + "</h4></div>" +
        "<div class='btn-group pull-right'> " +
        "<div class='btn' onclick='cal.getPreviousYear()'> << </div>" +
        "<div class='btn' onclick='cal.getPreviousMonth()'> < </div>" +
        "<div class='btn' onclick='cal.getNextMonth()'> > </div>" +
        "<div class='btn' onclick='cal.getNextYear()'> >> </div>" +
        "</div>" +
        "</tr>";

    // get first day of recent or given month.
    var first_day_of_month = new Date(this.year, this.month, 1);

    // figure out what is the first day of month (0 = sunday, 1 = monday, 2 = tuesday, ..)
    var starting_day_of_month = first_day_of_month.getDay();

    // figure out the length of the month given.
    var month_length = days_in_month[this.month];

    if (this.month == 1) // February only!
    {
        month_length = calculateLeapYear(this.year);
    }

    var month_name = months_labels[this.month];
    var total_row_number = calculateRowNumber( starting_day_of_month, month_length );
    var day_counter = 1;
    var day_of_week = starting_day_of_month;



    html += "<tr>";
    for(i = 0; i < 7; i++)
    {
        html += "<th>"+ days_labels_us[i] +"</th>";
    }
    html += "</tr>";


    for(i = 0; i < total_row_number; i++)
    {
        html += "<tr>";
        for(j = 0; j < 7; j++)
        {
            if(day_of_week % 7 === j && day_counter <= month_length)
            {
                if(current_date.getDate() === day_counter && current_date.getMonth() === this.month && current_date.getFullYear() === this.year)
                {
                    html += "<td><b>-"+ day_counter +"-</b></td>";
                }
                else
                {
                    html += "<td>"+ day_counter +"</td>";
                }
                day_of_week++;
                day_counter++;
            }
            else
            {
                html += "<td></td>";
            }
        }
        html += "</tr>";
    }


    html += "</table>";

    this.html = html;

    calendar.innerHTML = this.html;

};



/**
 * generates the html code depending on all of the variables that has been created before.
 */
Calendar.prototype.generateHTMLEu = function()
{
    console.log("asda77777sd");

    var calendar = document.getElementById("calendar");


    var html = "<table class='table table-bordered'>";

    html += "<tr><td colspan='7' style='vertical-align: middle;'><div class='pull-left'><h4>" + months_labels[this.month] + ", " + this.year + "</h4>" +
        "<a href='#' onclick='cal.backToToday()'>Today</a> </div>" +
        "<div class='btn-group pull-right'> " +
        "<div class='btn' onclick='cal.getPreviousYear()'> << </div>" +
        "<div class='btn' onclick='cal.getPreviousMonth()'> < </div>" +
        "<div class='btn' onclick='cal.getNextMonth()'> > </div>" +
        "<div class='btn' onclick='cal.getNextYear()'> >> </div>" +
        "</div>" +
        "</tr>";

    // get first day of recent or given month.
    var first_day_of_month = new Date(this.year, this.month, 1);

    // figure out what is the first day of month (0 = sunday, 1 = monday, 2 = tuesday, ..) -- [-1 for 0 = monday, 1 = tuesday, ...]
    var starting_day_of_month = first_day_of_month.getDay() - 1;

    if(starting_day_of_month === -1) // if it is sunday
    {
        starting_day_of_month = 6;
    }
    // figure out the length of the month given.
    var month_length = days_in_month[this.month];

    if (this.month == 1) // February only!
    {
        month_length = calculateLeapYear(this.year);
    }

    var month_name = months_labels[this.month];
    var total_row_number = calculateRowNumber( starting_day_of_month, month_length );
    var day_counter = 1;
    var day_of_week = starting_day_of_month;



    html += "<tr>";
    for(i = 0; i < 7; i++)
    {
        html += "<th>"+ days_labels_eu[i] +"</th>";
    }
    html += "</tr>";


    for(i = 0; i < total_row_number; i++)
    {
        html += "<tr>";
        for(j = 0; j < 7; j++)
        {
            if(day_of_week % 7 === j && day_counter <= month_length)
            {
                if(current_date.getDate() === day_counter && current_date.getMonth() === this.month && current_date.getFullYear() === this.year)
                {
                    html += "<td><b>-"+ day_counter +"-</b></td>";
                }
                else
                {
                    html += "<td>"+ day_counter +"</td>";
                }
                day_of_week++;
                day_counter++;
            }
            else
            {
                html += "<td></td>";
            }
        }
        html += "</tr>";
    }


    html += "</table>";

    this.html = html;

    calendar.innerHTML = this.html;

};

var cal = new Calendar();
cal.generateHTMLEu();