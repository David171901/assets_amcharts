(function(BS) {
    
    function symbolVis() {};
    BS.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: "searchfilterDynamicDatev4",
        displayName: "Buscador Fechas 29 - 28",
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Single,
        iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
        inject: ['timeProvider', '$interval'],
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                Height: 20,
                Width: 320,
                currentMonth: null,
            }
        }
    }

    symbolVis.prototype.init = function(scope, elem, timeProvider, $interval) {
        console.log('[+] Search Filter Date Loaded v3');
        this.onDataUpdate = myCustomDataUpdateFunction;
        
        var isLoaded = 'primero';
        var initialTime = 'T19:00:00';
        var currentStringTimeED = null;
        var dataTotal = null;
        var count = 0;
        
        function myCustomDataUpdateFunction(data) {
            console.log(" ~ file: sym-searchfilterDynamicDatev2.js ~ line 34 ~ myCustomDataUpdateFunction ~ data", data)
            if(isLoaded == 'primero'){
                dataTotal = data;

                let ultimoValue =  dataTotal.Data[0].Values[dataTotal.Data[0].Values.length-1].Value;
               
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

                scope.search = function() {
                    var stringTimeED = {
                        start: "",
                        end: ""
                    };

                    count++;
                    
                    if(count == 1){
                        dataTotal = data;
                    }

                    let searchInterval = new Date(scope.timeED.year, parseInt(scope.timeED.month)-1, 1);
                    if(new Date().getMonth() >= scope.timeED.month){
                        stringTimeED = getStartEndTimeForSearch(parseInt(searchInterval.getMonth()), parseInt(searchInterval.getFullYear()), 1);
                    } else {
                        let initialDate = dataTotal.Data[0].Values.filter(item => item.Value == ultimoValue);
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

            if(isLoaded == 'stop'){
                if(data.Data[0].Values) {
                    data  = {
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
                
                let monthChange = (parseInt(initialDate.Values[initialDate.Values.length-1].Time.split('/')[1]))
                - parseInt(currentStringTimeED.startTimeED.split('-')[1]) == 2? true : false;
                
                monthChange ? isLoaded='primero' : isLoaded;
            }

            function getStartEndTimeForLoad(month, year, day) {
                console.log(" ~ file: sym-searchfilterDynamicDatev4.js:98 ~ getStartEndTimeForLoad ~ month, year, day", month, year, day)
                // if (day == 29 || day == 30) month = month -1;
                let currentDate = new Date();
                if (!year) year = currentDate.getFullYear();
                
                // if (month == 12){
                //     year-=1;
                // }
                
                let startDate = new Date(year, month-1, day);

                if (month - 1 == 1 && day == 29 && year % 4 > 0) {
                    startDate = new Date(year, month - 1, 28);
                }

                let startMonth = startDate.getMonth() + 1;
                let startStringMonth = startMonth > 9 ? `${startMonth}` : `0${startMonth}`;
                
                return {
                    startTimeED: `${startDate.getFullYear()}-${startStringMonth}-28${initialTime}`,
                    endTimeED: "*"
                };
            }

            function getStartEndTimeForSearch(month, year, day) {
                console.log(" ~ file: sym-searchfilterDynamicDatev4.js:122 ~ getStartEndTimeForSearch ~ month, year, day", month, year, day)

                // START
                let currentDate = new Date();
                if (!year) year = currentDate.getFullYear();
                
                if (month == 12){
                    year-=1;
                }
                
                let startDate = new Date(year, month-1, day);

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

                let daysOfMonth = getDaysOfMonth(endMonth,endDate.getFullYear())

                return {
                    startTimeED: `${startDate.getFullYear()}-${startStringMonth}-28${initialTime}`,
                    endTimeED: `${endDate.getFullYear()}-${endStringMonth}-${28}T19:00:00`
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