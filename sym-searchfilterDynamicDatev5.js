(function (BS) {

    function symbolVis() { };
    BS.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: "searchfilterDynamicDatev5",
        displayName: "Buscador Fechas (Corte de Planta)",
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Single,
        iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
        inject: ['timeProvider', '$interval'],
        visObjectType: symbolVis,
        getDefaultConfig: function () {
            return {
                DataShape: 'TimeSeries',
                Height: 75,
                Width: 650,
                currentMonth: null,
            }
        }
    }

    symbolVis.prototype.init = function (scope, elem, timeProvider, $interval) {
        console.log('[+] Buscador de fechas (Corte de Planta)');
        this.onDataUpdate = myCustomDataUpdateFunction;

        var isLoaded = 'primero';
        var currentStringTimeED = null;
        var dataTotal = null;
        var dataTotal_ = null;
        var count = 0;

        function myCustomDataUpdateFunction(data) {
            if (isLoaded == 'primero') {
                dataTotal = data;
                dataTotal_ = data;

                let ultimoValue = dataTotal.Data[0].Values[dataTotal.Data[0].Values.length - 1].Value;
                let initialDate = dataTotal.Data[0].Values.filter(item => item.Value == ultimoValue);
                initialDate = initialDate[0].Time;

                let initialDay = parseInt(initialDate.split('/')[0]) - 1;
                let initialMonth = parseInt(initialDate.split('/')[1]);

                let yearNow = parseInt(initialDate.split('/')[2]);

                scope.timeED = { month: "", year: "" };

                currentStringTimeED = getStartEndTimeForLoad(initialMonth, yearNow, initialDay);
                timeProvider.requestNewTime(currentStringTimeED.startTimeED, currentStringTimeED.endTimeED, true);

                scope.timeED.month = ultimoValue.toString();
                scope.timeED.year = yearNow.toString();

                isLoaded = 'stop';

                scope.search = function () {
                    var stringTimeED = {
                        start: "",
                        end: ""
                    };

                    count++;

                    if (count == 1) {
                        dataTotal = data;
                    }

                    let searchInterval = new Date(scope.timeED.year, parseInt(scope.timeED.month) - 1, 1);

                    if (scope.timeED.month != (new Date().getMonth() + 1) || scope.timeED.year != (new Date().getFullYear())) {
                        stringTimeED = getStartEndTimeForSearch(parseInt(searchInterval.getMonth()), parseInt(searchInterval.getFullYear()), 1);
                    } else {
                        let initialDate = dataTotal_.Data[0].Values.filter(item => item.Value == ultimoValue);
                        initialDate = initialDate[0].Time;
                        let initialDay = parseInt(initialDate.split('/')[0]) - 1;
                        let initialMonth = parseInt(initialDate.split('/')[1]);
                        let yearNow = parseInt(initialDate.split('/')[2]);
                        stringTimeED = getStartEndTimeForLoad(initialMonth, yearNow, initialDay);
                    }

                    timeProvider.requestNewTime(stringTimeED.startTimeED, stringTimeED.endTimeED, true);

                    isLoaded = 'stop';
                }
            }

            if (isLoaded == 'stop') {
                if (data.Data[0].Values) {
                    data = {
                        Data: [
                            {
                                "Values": [
                                    {
                                        "Value": "11",
                                        "Time": "25/11/2022 00:00:00"
                                    },
                                    {
                                        "Value": "11",
                                        "Time": "26/11/2022 00:00:00"
                                    },
                                    {
                                        "Value": "12",
                                        "Time": "30/11/2022 00:00:00"
                                    }
                                ],
                                "StartTime": "31/10/2022 19:00:00",
                                "EndTime": "1/12/2022 09:28:48.977",
                                "Minimum": "0",
                                "Maximum": "100",
                                "DisplayDigits": -5,
                                "Label": "BALANZAS|CODIGO MES",
                                "Path": "af:\\\\YAUMS26\\BASE DE DATOS  PIAF - UM YAULI\\PLANTA CONCENTRADORA VICTORIA\\02 MOLIENDA\\BALANZAS|CODIGO MES"
                            }
                        ]
                    }
                }

                let initialDate = data.Data[0];

                let monthChange = (parseInt(initialDate.Values[initialDate.Values.length - 1].Time.split('/')[1]))
                    - parseInt(currentStringTimeED.startTimeED.split('-')[1]) == 2 ? true : false;

                monthChange ? isLoaded = 'primero' : isLoaded;
            }

            function getStartEndTimeForLoad(month, year, day) {
                let currentDate = new Date();
                if (!year) year = currentDate.getFullYear();

                let startDate = new Date(year, month - 1, day);

                if (month - 1 == 1 && day == 29 && year % 4 > 0) {
                    startDate = new Date(year, month - 1, 28);
                }

                let startMonth = startDate.getMonth() + 1;
                let startStringMonth = startMonth > 9 ? `${startMonth}` : `0${startMonth}`;

                let startTime;
                month = new Date().getMonth();

                switch (month) {
                    case 0:
                        startTime = `${new Date().getFullYear() - 1}-12-31T19:00:00`;
                        break;
                    case 1:
                        startTime = `${new Date().getFullYear()}-01-28T19:00:00`;
                        break;
                    case 2:
                        startTime = `${new Date().getFullYear()}-02-27T19:00:00`;
                        break;
                    case 3:
                        startTime = `${new Date().getFullYear()}-03-28T19:00:00`;
                        break;
                    case 4:
                        startTime = `${new Date().getFullYear()}-04-27T19:00:00`;
                        break;
                    case 5:
                        startTime = `${new Date().getFullYear()}-05-28T19:00:00`;
                        break;
                    case 6:
                        startTime = `${new Date().getFullYear()}-06-27T19:00:00`;
                        break;
                    case 7:
                        startTime = `${new Date().getFullYear()}-07-28T19:00:00`;
                        break;
                    case 8:
                        startTime = `${new Date().getFullYear()}-08-28T19:00:00`;
                        break;
                    case 9:
                        startTime = `${new Date().getFullYear()}-09-27T19:00:00`;
                        break;
                    case 10:
                        startTime = `${new Date().getFullYear()}-10-28T19:00:00`;
                        break;
                    case 11:
                        startTime = `${new Date().getFullYear()}-11-27T19:00:00`;
                        break;
                    default:
                        break;
                }


                return {
                    startTimeED: startTime,
                    endTimeED: "*"
                };
            }

            function getStartEndTimeForSearch(month, year, day) {

                // START

                let currentDate = new Date();
                if (!year) year = currentDate.getFullYear();

                if (month == 12) {
                    year -= 1;
                }

                let startDate;

                if (month == 0) startDate = new Date(year, month, day);
                else startDate = new Date(year, month, day);

                if (month - 1 == 1 && day == 29 && year % 4 > 0) {
                    startDate = new Date(year, month - 1, 28);
                }

                let startMonth = startDate.getMonth() + 1;
                let startStringMonth = startMonth > 9 ? `${startMonth}` : `0${startMonth}`;

                let endDate = new Date(year, month, day);

                if (month - 1 == 1 && day == 29 && year % 4 > 0) {
                    endDate = new Date(year, month - 1, 28);
                }

                let endMonth = endDate.getMonth() + 1;
                let endStringMonth = endMonth > 9 ? `${endMonth}` : `0${endMonth}`;

                let daysOfMonth = getDaysOfMonth(endMonth, endDate.getFullYear());

                let startTime;
                let endTime;

                let idSearch = `${month}-${year}`;

                switch (idSearch) {
                    case '0-2022':
                        startTime = `2022-01-01T19:00:00`;
                        endTime = `2022-01-28T19:00:00`;
                        break;
                    case '1-2022':
                        startTime = `2022-01-28T19:00:00`;
                        endTime = `2022-02-25T19:00:00`;
                        break;
                    case '2-2022':
                        startTime = `2022-02-25T19:00:00`;
                        endTime = `2022-03-28T19:00:00`;
                        break;
                    case '3-2022':
                        startTime = `2022-03-28T19:00:00`;
                        endTime = `2022-04-27T19:00:00`;
                        break;
                    case '4-2022':
                        startTime = `2022-04-27T19:00:00`;
                        endTime = `2022-05-28T19:00:00`;
                        break;
                    case '5-2022':
                        startTime = `2022-05-28T19:00:00`;
                        endTime = `2022-06-27T19:00:00`;
                        break;
                    case '6-2022':
                        startTime = `2022-06-27T19:00:00`;
                        endTime = `2022-07-28T19:00:00`;
                        break;
                    case '7-2022':
                        startTime = `2022-07-28T19:00:00`;
                        endTime = `2022-08-28T19:00:00`;
                        break;
                    case '8-2022':
                        startTime = `2022-08-28T19:00:00`;
                        endTime = `2022-09-27T19:00:00`;
                        break;
                    case '9-2022':
                        startTime = `2022-09-27T19:00:00`;
                        endTime = `2022-10-28T19:00:00`;
                        break;
                    case '10-2022':
                        startTime = `2022-10-28T19:00:00`;
                        endTime = `2022-11-27T19:00:00`;
                        break;
                    case '11-2022':
                        startTime = `2022-11-27T19:00:00`;
                        endTime = `2022-12-31T19:00:00`;
                        break;
                    case '0-2023':
                        startTime = `2022-12-31T19:00:00`;
                        endTime = `2023-01-28T19:00:00`;
                        break;
                    case '1-2023':
                        startTime = `2023-01-28T19:00:00`;
                        endTime = `2023-02-25T19:00:00`;
                        break;
                    case '2-2023':
                        startTime = `2023-02-25T19:00:00`;
                        endTime = `2023-03-28T19:00:00`;
                        break;
                    case '3-2023':
                        startTime = `2023-03-28T19:00:00`;
                        endTime = `2023-04-27T19:00:00`;
                        break;
                    case '4-2023':
                        startTime = `2023-04-27T19:00:00`;
                        endTime = `2023-05-28T19:00:00`;
                        break;
                    case '5-2023':
                        startTime = `2023-05-28T19:00:00`;
                        endTime = `2023-06-27T19:00:00`;
                        break;
                    case '6-2023':
                        startTime = `2023-06-27T19:00:00`;
                        endTime = `2023-07-28T19:00:00`;
                        break;
                    case '7-2023':
                        startTime = `2023-07-28T19:00:00`;
                        endTime = `2023-08-28T19:00:00`;
                        break;
                    case '8-2023':
                        startTime = `2023-08-28T19:00:00`;
                        endTime = `2023-09-27T19:00:00`;
                        break;
                    case '9-2023':
                        startTime = `2023-09-27T19:00:00`;
                        endTime = `2023-10-28T19:00:00`;
                        break;
                    case '10-2023':
                        startTime = `2023-10-28T19:00:00`;
                        endTime = `2023-11-27T19:00:00`;
                        break;
                    case '11-2023':
                        startTime = `2023-11-27T19:00:00`;
                        endTime = `2023-12-31T19:00:00`;
                        break;
                    case '0-2024':
                        startTime = `2023-12-31T19:00:00`;
                        endTime = `2024-01-28T19:00:00`;
                        break;
                    case '1-2024':
                        startTime = `2024-01-28T19:00:00`;
                        endTime = `2024-02-26T19:00:00`;
                        break;
                    case '2-2024':
                        startTime = `2024-02-26T19:00:00`;
                        endTime = `2024-03-28T19:00:00`;
                        break;
                    case '3-2024':
                        startTime = `2024-03-28T19:00:00`;
                        endTime = `2024-04-27T19:00:00`;
                        break;
                    case '4-2024':
                        startTime = `2024-04-27T19:00:00`;
                        endTime = `2024-05-28T19:00:00`;
                        break;
                    case '5-2024':
                        startTime = `2024-05-28T19:00:00`;
                        endTime = `2024-06-27T19:00:00`;
                        break;
                    case '6-2024':
                        startTime = `2024-06-27T19:00:00`;
                        endTime = `2024-07-28T19:00:00`;
                        break;
                    case '7-2024':
                        startTime = `2024-07-28T19:00:00`;
                        endTime = `2024-08-28T19:00:00`;
                        break;
                    case '8-2024':
                        startTime = `2024-08-28T19:00:00`;
                        endTime = `2024-09-27T19:00:00`;
                        break;
                    case '9-2024':
                        startTime = `2024-09-27T19:00:00`;
                        endTime = `2024-10-28T19:00:00`;
                        break;
                    case '10-2024':
                        startTime = `2024-10-28T19:00:00`;
                        endTime = `2024-11-27T19:00:00`;
                        break;
                    case '11-2024':
                        startTime = `2024-11-27T19:00:00`;
                        endTime = `2024-12-31T19:00:00`;
                        break;
                    default:
                        break;
                }

                return {
                    startTimeED: startTime,
                    endTimeED: endTime
                };
            }

            function getDaysOfMonth(numMonth, numYear) {
                let daysOfMonth = 31;
                numMonth = parseInt(numMonth);
                numYear = parseInt(numYear);
                if (numMonth == 4 || numMonth == 6 || numMonth == 9 || numMonth == 11) {
                    daysOfMonth = 30;
                }
                if (numMonth == 2) {
                    daysOfMonth = 28;
                    if (numYear % 4 == 0) {
                        daysOfMonth = 29;
                    }
                }
                return daysOfMonth;
            }

        }

    };

    BS.symbolCatalog.register(definition);

})(window.PIVisualization);