/**
 * asd
 */
goog.provide("pigeon.Calendar");



days_labels_iso = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
days_labels_long_iso = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// these are human-readable month name labels, in order
months_labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// these are the days of the week for each month, in order
days_in_month = [31, 999, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

pigeon.Calendar = function( opt_year, opt_month, opt_date, opt_hours, opt_minutes, opt_seconds, opt_milliseconds ) {

    this.current_date = new goog.date.DateTime();

    if(isNaN(opt_year) || opt_year === null) {
        this.year = this.current_date.getFullYear();
    }
    else {
        this.year = opt_year;
    }

    if(isNaN(opt_month) || opt_month === null) {
        this.month = this.current_date.getMonth();
    }
    else {
        this.month = opt_month;
    }

    if(isNaN(opt_date) || opt_date === null) {
        this.date = this.current_date.getDate();
    }
    else {
        this.date = opt_date;
    }

    if(isNaN(opt_hours) || opt_hours === null) {
        this.hours = this.current_date.getHours();
    }
    else {
        this.hours = opt_hours;
    }

    if(isNaN(opt_minutes) || opt_minutes === null) {
        this.minutes = this.current_date.getMinutes();
    }
    else {
        this.minutes = opt_minutes;
    }

    if(isNaN(opt_seconds) || opt_seconds === null) {
        this.seconds = this.current_date.getSeconds();
    }
    else {
        this.seconds = opt_seconds;
    }

    if(isNaN(opt_milliseconds) || opt_milliseconds === null) {
        this.milliseconds = this.current_date.getMilliseconds();
    }
    else {
        this.milliseconds = opt_milliseconds;
    }

    this.html = '';

    // saati kac dakikalik aralara bolucez.
    this.time_block = 30;

    this.weekly_calendar_cell_height = 20;

};

/**
 * Calculates the row number for given month.
 *
 * @param starting_day_of_month - the day of the first day of the month.
 * @param month_length - length of the given month
 * @return {Number} - can be 4, 5, 6 depending on the month and the first day of month.
 */
pigeon.Calendar.prototype.calculateRowNumber = function( first_day_of_month, month_length )
{
    var starting_day_of_month = first_day_of_month.getIsoWeekday();

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
 * calculates the previous month, depending on the recent month.
 */
pigeon.Calendar.prototype.getPreviousMonth = function() {

    var calendar = goog.dom.getElement("calendar");
    calendar.innerHTML = "";

    if(this.month === 0) {
        this.month = 11;
        this.year -= 1;
    }
    else {
        this.month -= 1;
    }

    this.generateMonthlyHTML();
};


/**
 * calculates the next month, depending on the recent month.
 */
pigeon.Calendar.prototype.getNextMonth = function() {

    var calendar = goog.dom.getElement("calendar");
    calendar.innerHTML = "";

    if(this.month === 11) {
        this.month = 0;
        this.year += 1;
    }
    else {
        this.month += 1;
    }

    this.generateMonthlyHTML();

};



pigeon.Calendar.prototype.getNextYear = function() {
    var calendar = goog.dom.getElement("calendar");
    calendar.innerHTML = "";
    this.year += 1;

    this.generateMonthlyHTML();
};


pigeon.Calendar.prototype.getPreviousYear = function() {
    var calendar = goog.dom.getElement("calendar");
    calendar.innerHTML = "";
    this.year -= 1;

    this.generateMonthlyHTML();
};

pigeon.Calendar.prototype.backToToday = function() {
    var calendar = goog.dom.getElement("calendar");
    calendar.innerHTML = "";

    this.month = this.current_date.getMonth();
    this.year = this.current_date.getFullYear();

    this.generateMonthlyHTML();
};

pigeon.Calendar.prototype.generateMonthlyHTML = function() {

    var calendar = goog.dom.getElement("calendar");


    var html = "<table id='monthly-calendar' class='table table-bordered'>";

    html += "<tr><td colspan='7' style='vertical-align: middle;'><div class='pull-left'><h4><span id='month-label'>" + months_labels[this.month] + "</span>, " + this.year + "</h4>" +
        "<a href='#' id='back-to-today'>Today</a> </div>" +
        "<div class='btn-group pull-right'> " +
        "<div class='btn' id='previous-year'> << </div>" +
        "<div class='btn' id='previous-month'> < </div>" +
        "<div class='btn' id='next-month'> > </div>" +
        "<div class='btn' id='next-year'> >> </div>" +
        "</div>" +
        "</tr>";




    html += "<tr>";
    for(i = 0; i < 7; i++)
    {
        html += "<th>"+ days_labels_iso[i] +"</th>";
    }
    html += "</tr>";


    var first_day_of_month = new goog.date.DateTime(this.year, this.month, 1);
    var last_day_of_month = new goog.date.DateTime(this.year, this.month, first_day_of_month.getNumberOfDaysInMonth() + 1);


    var day_of_week_iterator = first_day_of_month.getIsoWeekday();

    var day_counter = 1; // displayed number of month. [1 - 31] || [1 - 30] ..
    var day_iterator = first_day_of_month.clone(); // to give an identity to table columns.
    var month_length = first_day_of_month.getNumberOfDaysInMonth();
    var flag = 0; /// ************

    // calendardaki bir onceki ve bir sonraki aylarin hesabinin yapilabilmesi icin kullanilacak degiskenler.
    var next_month = new goog.date.DateTime(this.year, this.month + 1, 1);

    var prev_month = new goog.date.DateTime(this.year, this.month, -1); // bir onceki ayin son gunu
    prev_month.setDate(prev_month.getNumberOfDaysInMonth() - day_of_week_iterator + 1);// bir onceki ayin son 'day_of_week_iterator' kadar gunu.

    // calendar-eventleri almak icin bu degiskeni kullanicaz.
    // cunku ilerideki for dongusu icersinde, degistiriyoruz prev_month'in gunlerini.
    var opt_prev_month = prev_month.clone();

    var total_row_number =  this.calculateRowNumber(first_day_of_month, month_length);


    // calendar'i yaratmaya basliyoruz. bi ara Closure Template incelenip bastan gozden gecirelecek bu scope.
    for(i = 0; i < total_row_number; i++){
        html += "<tr>";
        for(j = 0; j < 7; j++){
            // ayin baslangicindan onceki gunler.
            if(flag === 0 && day_of_week_iterator % 7 != j) {
                html += "<td class='calendar-column other-month-date' id='" + prev_month.getFullYear() + "-" + prev_month.getDayOfYear() + "'>"+ prev_month.getDate() + "</i></td>"; /// ************
                prev_month.setDate(prev_month.getDate() + 1);
            }
            // ayin gunleri
            else if(day_of_week_iterator % 7 === j && day_counter <= month_length){
                flag = 1; /// ************
                if(this.current_date.getDate() === day_counter && this.current_date.getMonth() === this.month && this.current_date.getFullYear() === this.year){
                    html += "<td class='calendar-column' id='"+ day_iterator.getFullYear() +"-"+ day_iterator.getDayOfYear() +"'><b>-"+ day_counter +"-</b></td>";
                }
                else{
                    html += "<td class='calendar-column' id='"+ day_iterator.getFullYear() +"-"+ day_iterator.getDayOfYear() +"'>"+ day_counter +"</td>";
                }
                day_of_week_iterator++;
                day_iterator.setDate(day_iterator.getDate() + 1);
                day_counter++;
            }
            // ayin bitisinden sonraki gunler.
            else{
                html += "<td class='calendar-column other-month-date' id='" + next_month.getFullYear() + "-" + next_month.getDayOfYear() + "'>" + next_month.getDate() + "</td>"; /// ************
                next_month.setDate(next_month.getDate() + 1);
            }
        }
        html += "</tr>";
    }


    html += "</table>";

    this.html = html;

    calendar.innerHTML = this.html;

    // Handle Events! (click, changed....)
    this.handleEvents();


    // fetch calendar events
    this.getCalendarEvents(opt_prev_month, next_month);

};

pigeon.Calendar.prototype.handleEvents = function() {
    // event handling.
    var back_to_today_link = goog.dom.getElement("back-to-today");
    var next_month_link = goog.dom.getElement("next-month");
    var previous_month_link = goog.dom.getElement("previous-month");
    var next_year_link = goog.dom.getElement("next-year");
    var previous_year_link = goog.dom.getElement("previous-year");

    goog.events.listen(back_to_today_link, goog.events.EventType.CLICK, this.backToToday, false, this);
    goog.events.listen(next_month_link, goog.events.EventType.CLICK, this.getNextMonth, false, this);
    goog.events.listen(previous_month_link, goog.events.EventType.CLICK, this.getPreviousMonth, false, this);
    goog.events.listen(next_year_link, goog.events.EventType.CLICK, this.getNextYear, false, this);
    goog.events.listen(previous_year_link, goog.events.EventType.CLICK, this.getPreviousYear, false, this);

    //

};

/**
 *
 * @param first_day_of_month
 * @param last_day_of_month
 */
pigeon.Calendar.prototype.getCalendarEvents = function(first_day_of_month, last_day_of_month) {

    var calendar_event_data = [
        {
            id: 1,
            name: "Event 2",
            start: "Oct 13 2012",
            end: "Oct 13 2013"
        },
        {
            id: 2,
            name: "Event 3",
            start: "Oct 12 2012",
            end: "Oct 15 2012"
        }
    ];

    var calendar = goog.dom.getElement("calendar");

    var yearly_first_day_of_month = first_day_of_month.getTime();
    var yearly_last_day_of_month = last_day_of_month.getTime();




    for(var counter = 0; counter < calendar_event_data.length; counter++) {

        var start_day = goog.date.DateTime.fromRfc822String(calendar_event_data[counter]["start"]);
        var end_day = goog.date.DateTime.fromRfc822String(calendar_event_data[counter]["end"]);



        // while icinde duzgunce kontrol edebilmek icin end day'i bir gun sonraya aliyoruz.
        var temp_end_day = end_day.clone();
        temp_end_day.setDate(end_day.getDate() + 1);

        // eger baslangic ve bitis gunu ayni aydaysa
        if(start_day.getTime() >= yearly_first_day_of_month
            && temp_end_day.getTime() <= yearly_last_day_of_month) {



            var current_day = start_day.clone();

            while(!current_day.equals(temp_end_day)){


                // baslangic gunu
                if(current_day.equals(start_day)) {
                    // baslangic icin baslangic class'li div yaratiyoruz.
                    var start_day_element = goog.dom.createDom('div', {class: "calendar-event start-day"}, calendar_event_data[counter]["name"]);

                    //start_day id'li td'yi bulup icine yapistiricaz.
                    var start_day_td = goog.dom.getElement(current_day.getFullYear() + "-" + current_day.getDayOfYear());
                    goog.dom.appendChild(start_day_td, start_day_element);

                }
                // bitis gunu
                else if(current_day.equals(end_day)) {
                    // baslangic icin baslangic class'li div yaratiyoruz.
                    var end_day_element = goog.dom.createDom('div', {class: "calendar-event end-day"}, "End of" + calendar_event_data[counter]["name"]);

                    //start_day id'li td'yi bulup icine yapistiricaz.
                    var end_day_td = goog.dom.getElement(current_day.getFullYear() + "-" + current_day.getDayOfYear());
                    goog.dom.appendChild(end_day_td, end_day_element);
                }
                // arada kalan gunler
                else {
                    // ici doldurulacak
                    // baslangic icin baslangic class'li div yaratiyoruz.
                    var start_day_element = goog.dom.createDom('div', {class: "calendar-event"}, null);

                    //start_day id'li td'yi bulup icine yapistiricaz.
                    var start_day_td = goog.dom.getElement(current_day.getFullYear() + "-" + current_day.getDayOfYear());
                    goog.dom.appendChild(start_day_td, start_day_element);


                }



                // bir sonraki gune gec.
                current_day.setDate(current_day.getDate() + 1);

            }


        }
        // eger baslangic gorunen ayda bitis, baska bir aydaysa.
        else if(start_day.getTime() >= yearly_first_day_of_month
             && start_day.getTime() <= yearly_last_day_of_month
             && temp_end_day.getTime() > yearly_last_day_of_month) {


            var current_day = start_day.clone();

            while(!current_day.equals(last_day_of_month)){
                // baslangic gunu
                if(current_day.equals(start_day)) {
                    // baslangic icin baslangic class'li div yaratiyoruz.
                    var start_day_element = goog.dom.createDom('div', {class: "calendar-event start-day"}, calendar_event_data[counter]["name"]);

                    //start_day id'li td'yi bulup icine yapistiricaz.
                    var start_day_td = goog.dom.getElement(current_day.getFullYear() + "-" + current_day.getDayOfYear());
                    goog.dom.appendChild(start_day_td, start_day_element);

                }
                // arada kalan gunler
                else {
                    // ici doldurulacak
                    // baslangic icin baslangic class'li div yaratiyoruz.
                    var start_day_element = goog.dom.createDom('div', {class: "calendar-event"}, null);

                    //start_day id'li td'yi bulup icine yapistiricaz.
                    var start_day_td = goog.dom.getElement(current_day.getFullYear() + "-" + current_day.getDayOfYear());
                    goog.dom.appendChild(start_day_td, start_day_element);

                }



                // bir sonraki gune gec.
                current_day.setDate(current_day.getDate() + 1);

            }




        }
        // eger baslangic daha onceki bi ayda, fakat bitis bu aydaysa
        else if(start_day.getTime() < yearly_first_day_of_month
             && temp_end_day.getTime() <= yearly_last_day_of_month
             && temp_end_day.getTime() >= yearly_first_day_of_month) {



            var current_day = first_day_of_month.clone();

            while(!current_day.equals(temp_end_day)){

                // baslangic gunu
                if(current_day.equals(end_day)) {
                    // baslangic icin baslangic class'li div yaratiyoruz.
                    var end_day_element = goog.dom.createDom('div', {class: "calendar-event end-day"}, "End of" + calendar_event_data[counter]["name"]);

                    //start_day id'li td'yi bulup icine yapistiricaz.
                    var end_day_td = goog.dom.getElement(current_day.getFullYear() + "-" + current_day.getDayOfYear());
                    goog.dom.appendChild(end_day_td, end_day_element);

                }
                // arada kalan gunler
                else {
                    // ici doldurulacak
                    // baslangic icin baslangic class'li div yaratiyoruz.
                    var start_day_element = goog.dom.createDom('div', {class: "calendar-event"}, null);

                    //start_day id'li td'yi bulup icine yapistiricaz.
                    var start_day_td = goog.dom.getElement(current_day.getFullYear() + "-" + current_day.getDayOfYear());
                    goog.dom.appendChild(start_day_td, start_day_element);

                }



                // bir sonraki gune gec.
                current_day.setDate(current_day.getDate() + 1);

            }





        }
        // baslangic da bitis de gorunen ayda degilse.
        // if statemenet'a bir sey daha eklenmesi gerekiyor. kontrol edilecek.
        else if(start_day.getTime() < yearly_first_day_of_month
             && end_day.getTime() > yearly_last_day_of_month){


            if(this.month === 11) {
                yearly_last_day_of_month = 36
            }

            var current_day = first_day_of_month.clone();

            while(!current_day.equals(last_day_of_month)){

                // ici doldurulacak
                // baslangic icin baslangic class'li div yaratiyoruz.
                var start_day_element = goog.dom.createDom('div', {class: "calendar-event"}, null);

                //start_day id'li td'yi bulup icine yapistiricaz.
                var start_day_td = goog.dom.getElement(current_day.getFullYear() + "-" + current_day.getDayOfYear());
                goog.dom.appendChild(start_day_td, start_day_element);

                // bir sonraki gune gec.
                current_day.setDate(current_day.getDate() + 1);

            }
        }



    }

};


///////////////////////////////
///////////////////////////////
/////// WEEKLY CALENDAR ///////
///////////////////////////////
///////////////////////////////


pigeon.Calendar.prototype.calculateWeeklyRowNumber = function(time_block) {
    return (24 * 60) / time_block;
};

pigeon.Calendar.prototype.generateWeeklyTimeArray = function(timestamp, time_block) {

    var ret_val = [];
    var current_time = new goog.date.DateTime();

    var milliseconds_of_day = 24 * 60 * 60 * 1000;
    var milliseconds_of_timeblock = time_block * 60 * 1000;

    current_time.setTime(timestamp);
    for(i = 0; i < milliseconds_of_day; i+=milliseconds_of_timeblock) {
        ret_val.push(current_time.toIsoTimeString(false));
        current_time.setTime(current_time.getTime() + milliseconds_of_timeblock);

    }

    return ret_val;

};

pigeon.Calendar.prototype.getPigeonTimestamp = function(day_iterator) {
    var ret_val = "" + day_iterator.getFullYear();
    if(day_iterator.getMonth() < 10) {
        ret_val += "0"+day_iterator.getMonth();
    }
    else {
        ret_val += day_iterator.getMonth();
    }

    if(day_iterator.getDate() < 10) {
        ret_val += "0"+day_iterator.getDate();
    }
    else {
        ret_val += day_iterator.getDate();
    }

    if(day_iterator.getHours() < 10) {
        ret_val += "0"+day_iterator.getHours();
    }
    else {
        ret_val += day_iterator.getHours();
    }

    if(day_iterator.getMinutes() < 10) {
        ret_val += "0"+day_iterator.getMinutes();
    }
    else {
        ret_val += day_iterator.getMinutes();
    }

    return ret_val;
}

pigeon.Calendar.prototype.subtractPigeonTimestamps = function(pigeon_timestamp_x, pigeon_timestamp_y) {
    var time_x = [];
    var time_y = [];

    time_x.year = goog.string.parseInt(goog.string.buildString(pigeon_timestamp_x[0], pigeon_timestamp_x[1], pigeon_timestamp_x[2], pigeon_timestamp_x[3]));
    time_x.month = goog.string.parseInt(goog.string.buildString(pigeon_timestamp_x[4], pigeon_timestamp_x[5]));
    time_x.day = goog.string.parseInt(goog.string.buildString(pigeon_timestamp_x[6], pigeon_timestamp_x[7]));
    time_x.hours = goog.string.parseInt(goog.string.buildString(pigeon_timestamp_x[8], pigeon_timestamp_x[9]));
    time_x.minutes = goog.string.parseInt(goog.string.buildString(pigeon_timestamp_x[10], pigeon_timestamp_x[11]));

    time_y.year = goog.string.parseInt(goog.string.buildString(pigeon_timestamp_y[0], pigeon_timestamp_y[1], pigeon_timestamp_y[2], pigeon_timestamp_y[3]));
    time_y.month = goog.string.parseInt(goog.string.buildString(pigeon_timestamp_y[4], pigeon_timestamp_y[5]));
    time_y.day = goog.string.parseInt(goog.string.buildString(pigeon_timestamp_y[6], pigeon_timestamp_y[7]));
    time_y.hours = goog.string.parseInt(goog.string.buildString(pigeon_timestamp_y[8], pigeon_timestamp_y[9]));
    time_y.minutes = goog.string.parseInt(goog.string.buildString(pigeon_timestamp_y[10], pigeon_timestamp_y[11]));

    time_y.asd = 123123;

    var ret_val = 0;

    if(time_x.day === time_y.day) {
        var minutes_x = (time_x.hours * 60) + time_x.minutes;
        var minutes_y = (time_y.hours * 60) + time_y.minutes;
        ret_val = minutes_x - minutes_y;
    }

    return ret_val;

};

pigeon.Calendar.prototype.generateWeeklyHTML = function() {

    var calendar = goog.dom.getElement("calendar");

    var first_day_of_week = new goog.date.DateTime(this.year, this.month, this.date - this.current_date.getIsoWeekday());
    var last_day_of_week = first_day_of_week.clone();
    last_day_of_week.setDate(last_day_of_week.getDate() + 6);



    var row_number = this.calculateWeeklyRowNumber(this.time_block);

    var html = "<table id='weekly-calendar' class='table table-bordered'>";

    html += "<tr><td colspan='7' style='vertical-align: middle;'><div class='pull-left'>" +
        "<h4>" + months_labels[first_day_of_week.getMonth()] + " " + first_day_of_week.getDate() +", " + first_day_of_week.getFullYear() +
        " - " +  months_labels[last_day_of_week.getMonth()] + " " + last_day_of_week.getDate() +", " + last_day_of_week.getFullYear() +
        "</h4>" +
        "<a href='#' id='back-to-today'>Today</a> </div>" +
        "<div class='btn-group pull-right'> " +
        "<div class='btn' id='previous-year'> << </div>" +
        "<div class='btn' id='previous-month'> < </div>" +
        "<div class='btn' id='next-month'> > </div>" +
        "<div class='btn' id='next-year'> >> </div>" +
        "</div>" +
        "</tr>";

    var time_array = this.generateWeeklyTimeArray(first_day_of_week.getTime(), this.time_block);

    // ilk satir, gunler..
    var day_iterator = first_day_of_week.clone();
    html += "<tr>";
    html += "<th></th>"; // ilk bosluk
    for(i = 0; i < 7; i++) {

        if(day_iterator.getDate() === this.current_date.getDate()) {
            html += "<th class='today'><div>" + day_iterator.getDate() + " " + months_labels[day_iterator.getMonth()] + "</div>" +
                "<div>" + days_labels_long_iso[day_iterator.getIsoWeekday()] + "</div>" +
                "</th>";
        }
        else {
            html += "<th><div class='regular-day'>" + day_iterator.getDate() + " " + months_labels[day_iterator.getMonth()] + "</div>" +
                "<div>" + days_labels_long_iso[day_iterator.getIsoWeekday()] + "</div>" +
                "</th>";
        }

        day_iterator.setDate(day_iterator.getDate() + 1);

    }

    var timestamp;

    day_iterator = first_day_of_week.clone();

    html += "</tr>";

    html += "<div id='week-wrapper'><tr id='calendar-row'>";
    for(i = 0; i < 8; i++) {

        html += "<td><div class='days' id='day-"+ i +"' style='position: relative'>";


        if(i === 0) {
            for(j = 0; j < row_number; j++) {
                html += "<div class='weekly-cell weekly-time'>" + time_array[j] + "</div>";
            }
        }
        else {
            for(j = 0; j < row_number; j++) {
                timestamp = this.getPigeonTimestamp(day_iterator);
                html += "<div id="+ timestamp +" class='weekly-cell' style='height: "+ this.weekly_calendar_cell_height +"px'>&nbsp;</div>";
                day_iterator.setMinutes(day_iterator.getMinutes() + this.time_block);
            }
        }

        html += "</td></div>";

    }
    last_day_of_week = day_iterator.clone();;

    html += "</div></tr>";
    html += "</table>";


    this.html = html;
    calendar.innerHTML = this.html;
    var weekly_events = this.getWeeklyEvents(first_day_of_week, last_day_of_week);

    this.printWeeklyEvents(weekly_events);

    this.handleWeeklyDragAndDrops();


};

pigeon.Calendar.prototype.getWeeklyEvents = function(first_day_of_week, last_day_of_week) {
    // ilk gunu alicak, son gunu alicak, o gunler arasindaki eventleri array olarak dondurecek.
    var calendar_event_data = [
        {
            id: 1,
            name: "Event 2",
            start: "2012-288",
            start_timestamp: "",
            end: "2012-307",
            end_timestamp: ""
        },
        {
            id: 2,
            name: "Event 2",
            start: "2012-288",
            start_timestamp: "201208040530",
            end: "2012-307",
            end_timestamp: "201208040930"
        },
        {
            id: 3,
            name: "Event 3",
            start: "2012-288",
            start_timestamp: "201208051530",
            end: "2012-307",
            end_timestamp: "201208051930"
        }
    ];

    var week_events = [];


    for(i = 0; i < calendar_event_data.length; i++) {
        if(calendar_event_data[i].start_timestamp >= this.getPigeonTimestamp(first_day_of_week)
        && calendar_event_data[i].end_timestamp < this.getPigeonTimestamp(last_day_of_week)) {
            week_events.push(calendar_event_data[i]);
        }
    }

    return week_events;
};

pigeon.Calendar.prototype.printWeeklyEvents = function(weekly_events) {
  // arrayin icinde eventleri alicak, calendar'a bastiracak.
    var start_time = "";
    var end_time = "";
    for(i = 0; i < weekly_events.length; i++) {
        start_time = weekly_events[i].start_timestamp;
        end_time = weekly_events[i].end_timestamp;


        var event_length = this.subtractPigeonTimestamps(end_time, start_time);
        var element_height = (event_length / this.time_block) * (this.weekly_calendar_cell_height + 1);

        //start_day id'li td'yi bulup icine yapistiricaz.
        var start_time_div = goog.dom.getElement(start_time);

        var that_day = goog.dom.getAncestorByClass(start_time_div, "days");


        var start_time_of_that_day = goog.dom.getFirstElementChild(that_day).id;

        var top_position_of_event_div = this.subtractPigeonTimestamps(start_time, start_time_of_that_day) / this.time_block * (this.weekly_calendar_cell_height + 1);



        var start_time_element_style = "position: absolute; width:118px; border-left: 1px solid #111; border-right: 1px solid #111; height: " + element_height + "px; background: red;" +
                                       "top: " + top_position_of_event_div + "px ";
        var event_element = goog.dom.createDom('div', {id: "event-"+weekly_events[i].id, class: "calendar-weekly-event", style: start_time_element_style}, "asd");

        goog.dom.appendChild(that_day, event_element);


    }


};

pigeon.Calendar.prototype.handleWeeklyDragAndDrops = function() {
    // weekly_eventleri alir, drag and drop islerini halleder.

    var weekly_cells = goog.dom.getElementsByClass("weekly-cell");
    var week_event_elements = goog.dom.getElementsByClass("calendar-weekly-event");
    var drag_drop_group = new goog.fx.DragDropGroup();



    // weekly-cell'leri draggable yapiyoruz.

    for(i = 0; i < weekly_cells.length; i++) {
        drag_drop_group.addItem(weekly_cells[i], weekly_cells[i].id);
    }


    for(i = 0; i < week_event_elements.length; i++) {

        var drag_element = new goog.fx.DragDrop(week_event_elements[i].id.toString(), week_event_elements[i].id.toString());

        drag_element.addTarget(drag_drop_group);

        drag_element.setTargetClass("target");

        drag_element.init();


    }

    drag_drop_group.init();

};

cal = new pigeon.Calendar();
cal.generateMonthlyHTML();