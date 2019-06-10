/**
* Target URL: https://www.time.ir/fa/eventyear-%D8%AA%D9%82%D9%88%DB%8C%D9%85-%D8%B3%D8%A7%D9%84%DB%8C%D8%A7%D9%86%D9%87
* Run this function into Google chrome console
*/
function getHolidays() {
	function parseNumbers(str) {
        return Number( str.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function(d) {
            return d.charCodeAt(0) - 1632; // Convert Arabic numbers
        }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function(d) {
            return d.charCodeAt(0) - 1776; // Convert Persian numbers
        }) );
    }

	function jalaliMonthName(monthNumber) {
		var months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

		return months[monthNumber - 1];
	} 

	function miladiMonthNumber(monthName) {
		return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].findIndex(function(month) { return month === monthName }) + 1;
	}

	function qamariMonthNumber(monthName) {
		return ["محرم", "صفر", "ربيع الاول", "ربيع الثاني", "جمادي الاولي", "جمادي الثانيه", "رجب", "شعبان", "رمضان", "شوال", "ذوالقعده", "ذوالحجه"].findIndex(function(month) { return month === monthName }) + 1;
	}

	function getEvent(month, day) {
		var event = "جمعه";
		var dayName = day + " " + jalaliMonthName(month);
		$(".eventHoliday").map(function() {
            var day = $(this).text().trim().split("\n").map(function(item) { return item.trim(); });
			var monthName = day[0].split(" ")[1];
			var dayNumber = parseNumbers(day[0].split(" ")[0]);
			
			if (dayName === dayNumber + " " + monthName) {
				event = day[1];
			}
        });
		
		return event;
	}

	var miladiNewMonth = false;
	var qamariNewMonth = false;
	var jalaliYear = 0;

	var data = $("div.holiday").map(function(day) {
		var dates = $(this).closest(".eventCalendar").find(".dates span");
		
		// Parse Jalali
		var jalali = dates.find("a.jalali").attr("href").split("/");
		jalaliYear = jalali[jalali.length - 2];
		var jalaliMonth = jalali[jalali.length - 1];
		var jalaliDay = parseNumbers($(this).find("div.jalali").text());

		// Parse Miladi
		var miladi = dates.find(".miladi").html().replace("- ", "").split(" ");
		var miladiYear = miladi[2];
		var miladiFirstMonth = miladi[0];
		var miladiSecondMonth = miladi[1];
		var miladiDay = parseInt($(this).find("div.miladi").text());
		if(miladiDay === 1) {
			miladiNewMonth = true;
		}
		var miladiMonthName = (miladiNewMonth) ? miladiSecondMonth : miladiFirstMonth;
		var miladiMonth = miladiMonthNumber(miladiMonthName);

		// Parse Qamari
		var qamari = dates.find(".qamari").html().split("-").map(function(item) { return item.trim() });
		var qamariYear = parseNumbers(qamari[2]);
		var qamariFirstMonth = qamari[0];
		var qamariSecondMonth = qamari[1];
		var qamariDay = parseNumbers($(this).find("div.qamari").text());
		if(qamariDay === 1) {
			qamariNewMonth = true;
		}
		var qamariMonthName = (qamariNewMonth) ? qamariSecondMonth : qamariFirstMonth;
		var qamariMonth = qamariMonthNumber(qamariMonthName);
		
		return {
			jalali: jalaliYear + "/"+ jalaliMonth + "/" + jalaliDay,
			miladi: miladiYear + "-" + miladiMonth + "-" + miladiDay,
			qamari: qamariYear + "/"+ qamariMonth + "/" + qamariDay,
			event: getEvent(jalaliMonth, jalaliDay)
		};
	});

	var firstDayOfYear = data.get().findIndex(function(item) { return item.jalali === jalaliYear + "/1/1" });
	if(firstDayOfYear > 0) {
		for(var i = 0; i < firstDayOfYear; i++) {
			delete data[i];
		}
	}

	return data.filter(function (el) {
      return el != "";
    });
}
