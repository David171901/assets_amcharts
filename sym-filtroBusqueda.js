(function (BS) {

    function symbolVis() { };
    BS.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: "filtroBusqueda",
        displayName: "Filtro Busqueda (Dia - Mes - Año)",
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Single,
        iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
        inject: ['timeProvider', '$interval'],
        visObjectType: symbolVis,
        getDefaultConfig: function () {
            // TODO
            return {
                DataShape: 'TimeSeries',
                Height: 75,
                Width: 650,
                currentMonth: null,
            }
        }
    }

    symbolVis.prototype.init = function (scope, elem, timeProvider, $interval) {
        console.log('[+] Filtro Busqueda (Dia - Mes - Año)');
        this.onDataUpdate = myCustomDataUpdateFunction;

        var isLoaded = true;
        var currentStringTimeED = null;
        var piPointData = null;
        var count = 0;

        function myCustomDataUpdateFunction(data) {
            if (isLoaded === true) {
                piPointData = data;

                let lastValueInPiPointData = piPointData?.Data[0]?.Values[piPointData?.Data[0]?.Values.length - 1].Value;
                let lastTimeInPiPointDate = piPointData?.Data[0]?.Values[piPointData?.Data[0]?.Values.length - 1].Time;

                const { day, month, year } = extractDate(lastTimeInPiPointDate);

                scope.timeED = { day: "", month: "", year: "" };

                currentStringTimeED = getStartEndTimeForLoad({
                    day: day,
                    month: month,
                    year: year,
                });

                timeProvider.requestNewTime(currentStringTimeED.startTimeED, currentStringTimeED.endTimeED, true);

                scope.timeED.day = day.toString();
                scope.timeED.month = month.toString();
                scope.timeED.year = year.toString();

                isLoaded = false;

                scope.search = function () {
                    let stringTimeED = {
                        startTimeED: "",
                        endTimeED: "",
                    };

                    count++;

                    if (count === 1) piPointData = data;

                    const nowDate = new Date();
                    const searchedDate = new Date(scope.timeED.year, scope.timeED.month, scope.timeED.day);

                    if (searchedDate.getTime() <= nowDate.getTime() && lastValueInPiPointData) {
                        stringTimeED = getStartEndTimeForSearch({
                            day: parseInt(scope.timeED.day),
                            month: parseInt(scope.timeED.month),
                            year: parseInt(scope.timeED.year),
                        });
                    } else {
                        // TODO revisar casos busqueda de fechas futuras
                        stringTimeED = getStartEndTimeForSearch({
                            day: parseInt(scope.timeED.day),
                            month: parseInt(scope.timeED.month),
                            year: parseInt(scope.timeED.year),
                        });
                    }

                    timeProvider.requestNewTime(stringTimeED.startTimeED, stringTimeED.endTimeED, true);
                    isLoaded = false;
                }
            }

            if (isLoaded === true) {
                isLoaded = true;
                setTimeout(function () {
                    isLoaded = false;
                }, 2500);
            }
        }

        function getStartEndTimeForLoad({
            month,
            year,
            day,
        }) {
            try {
                let startTime = `${year}-${month}-${day}T00:00:00`;
                let endTime = `${year}-${month}-${day}T23:59:59`;
                return {
                    startTimeED: startTime,
                    endTimeED: endTime
                };
            } catch (error) {
                console.error('Error in getStartEndTimeForLoad:', error);
            }
        }

        function getStartEndTimeForSearch({
            month,
            year,
            day,
        }) {
            try {
                let startTime = `${year}-${month}-${day}T00:00:00`;
                let endTime = `${year}-${month}-${day}T23:59:59`;
                return {
                    startTimeED: startTime,
                    endTimeED: endTime
                };
            } catch (error) {
                console.error('Error in getStartEndTimeForSearch:', error);
            }
        }

        function getDaysOfMonth(numMonth, numYear) {
            try {
                let daysOfMonth = 31;
                if ([4, 6, 9, 11].includes(numMonth)) {
                    daysOfMonth = 30;
                }
                if (numMonth === 2) {
                    daysOfMonth = 28;
                    if (numYear % 4 === 0) {
                        daysOfMonth = 29;
                    }
                }
                return daysOfMonth;
            } catch (error) {
                console.error('Error in getDaysOfMonth:', error);
            }
        }

        function extractDate(date) {
            try {
                const regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
                const matches = date.match(regex);
                if (matches) {
                    const day = parseInt(matches[1], 10);
                    const month = parseInt(matches[2], 10);
                    const year = parseInt(matches[3], 10);
                    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
                        return { day: day, month: month, year: year };
                    }
                }
                const currentDate = new Date();
                return {
                    day: currentDate.getDate(),
                    month: currentDate.getMonth() + 1,
                    year: currentDate.getFullYear()
                };
            } catch (error) {
                console.error('Error in extractDate:', error);
            }
        }

    };

    BS.symbolCatalog.register(definition);

})(window.PIVisualization);