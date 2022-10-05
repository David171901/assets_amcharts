(function (BS) {
    "use strict";

    function symbolVis() { };
    BS.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: "searchfilter",
        displayName: "Search Filter",
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Single,
        iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
        inject: ['timeProvider', '$interval'],
        visObjectType: symbolVis,
        getDefaultConfig: function () {
            return {
                Height: 20,
                Width: 320
            }
        }
    }

    symbolVis.prototype.init = function (scope, elem, timeProvider, $interval) {
        var currentDate = new Date();
        var monthTime = null;

        if ((currentDate.getMonth()+1) < 10) monthTime = "0" + (currentDate.getMonth() + 1);
        else monthTime = (currentDate.getMonth()+1);
            scope.timeED = {
            month: "",
            year: ""
        }
        setInitSeacrhFilter();

        scope.search = function () {
            var stringTimeED = {
                start: "",
                end: ""
            };
            var numericValueOfMonth = parseInt(scope.timeED.month);
            stringTimeED = getStartEndTime(numericValueOfMonth, scope.timeED.year);
            timeProvider.requestNewTime(stringTimeED.startTimeED, stringTimeED.endTimeED, true);
            scope.timeED.year = "";
        }

        function setInitSeacrhFilter() {
            var currentMonth = currentDate.getMonth() + 1;
            var currentYear = currentDate.getFullYear();
            var currentStringTimeED = getStartEndTime(currentMonth, currentYear);
            timeProvider.requestNewTime(currentStringTimeED.startTimeED, currentStringTimeED.endTimeED, true);
            scope.timeED.month = currentMonth.toString();
            scope.timeED.year = currentYear.toString();
        };

        function getStartEndTime(month, year) {
            
            
            var stringTimeED = {
                startTimeED: null,
                endTimeED: null
            };

            var start = "";
            var end = "";


            if (year < 2018 || year > 2050 || isNaN(year)) {
                year = 2020;
            }

            switch (month) {
                case 1:
                    start = "01";
                    end = "01-31"
                    break;
                case 2:
                    start = "02";
                    end = "02-28"
                    break;
                case 3:
                    start = "03";
                    end = "03-31"
                    break;
                case 4:
                    start = "04";
                    end = "04-30"
                    break;
                case 5:
                    start = "05";
                    end = "05-31"
                    break;
                case 6:
                    start = "06";
                    end = "06-30"
                    break;
                case 7:
                    start = "07";
                    end = "07-31"
                    break;
                case 8:
                    start = "08";
                    end = "08-31"
                    break;
                case 9:
                    start = "09";
                    end = "09-30"
                    break;
                case 10:
                    start = "10";
                    end = "10-31"
                    break;
                case 11:
                    start = "11";
                    end = "11-30"
                    break;
                case 12:
                    start = "12";
                    end = "12-31"
                    break;
                default:
                    start = "";
                    end = ""
            }

            stringTimeED.startTimeED = year + "-" + start + "-01T00:00:00";
            if (start == 12) year = parseInt(year);
            if (monthTime.toString() == start) stringTimeED.endTimeED = "*";
            else stringTimeED.endTimeED = year + "-" + end + "T23:59:00";


            return stringTimeED;

        }

    };

    BS.symbolCatalog.register(definition);

})(window.PIVisualization); 