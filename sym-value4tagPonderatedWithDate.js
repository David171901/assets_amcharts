(function(CS) {
    //"use strict";
    var myEDcolumnDefinition = {
        typeName: "value4tagPonderatedWithDate",
        displayName: 'value 4 tag ponderated with date',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: 'Images/chrome.value.svg',
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 100,
                Width: 100,
                Intervals: 1000,
                decimalPlaces: 0,
                textColor: "black",
                backgroundColor: "transparent",
                gridColor: "transparent",
                plotAreaFillColor: "transparent",
                showTitle: false,
                showValues: true,
                fontSize: 12,
                FormatType: null,
                lineThick: 1,
                showLegend: true,
                showChartScrollBar: false,
                legendPosition: "bottom",
                bulletSize: 8,
                customTitle: ""
            };
        },
        configOptions: function() {
            return [{
                title: 'Editar Formato',
                mode: 'format'
            }];
        }
    };

    function symbolVis() {};
    CS.deriveVisualizationFromBase(symbolVis);
    symbolVis.prototype.init = function(scope, elem) {

        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;

        scope.config.FormatType = null;

        let symbolContainerDiv = elem.find('#container')[0];
        let newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
        symbolContainerDiv.id = newUniqueIDString;


        function myCustomDataUpdateFunction(data) {

            if (data !== null && data.Data) {

                let first_data_array = data.Data[0];
                let firsts = getNotInterpolatedValues(first_data_array);

                let second_data_array = data.Data[1];
                let seconds = getNotInterpolatedValues(second_data_array);

                let third_data_array = data.Data[2];
                let thirds = getNotInterpolatedValues(third_data_array);

                let fourth_data_array = data.Data[3];
                let fourths = getNotInterpolatedValues(fourth_data_array);

                var customDate = data.Data[4];
                var customStartDate = customDate.Values[customDate.Values.length - 1];

                let result = null;

                let total = 0;
                let days = 0;

                var todayDate = new Date();
                let iterableDate = new Date(customStartDate.Value);

                while (iterableDate <= todayDate) {
                    iterableDate.setDate(iterableDate.getDate() + 1);
                    let first = getValueInDate(firsts, iterableDate);
                    let second = getValueInDate(seconds, iterableDate);
                    let third = getValueInDate(thirds, iterableDate);
                    let fourth = getValueInDate(fourths, iterableDate);
                    result = second.Value && first.Value ? ((first.Value * third.Value) + (second.Value * fourth.Value)) / (third.Value + fourth.Value) : first.Value;
                    total += result;
                    days++;
                }

                let container = $(`#${symbolContainerDiv.id}`);
                container.html(result ? result.toFixed(scope.config.decimalPlaces) : result);
                container.css({ 'color': scope.config.textColor });
                container.css({ 'font-size': scope.config.fontSize });
            }
        }



        function getNotInterpolatedValues(data_array) {
            return data_array.Values.filter(item => new Date(item.Time).getHours() == 0 && new Date(item.Time).getMinutes() == 00);
        }

        function getValueInDate(data_array, iterableDate) {
            return data_array.Values.filter(item => new Date(item.Time).getMonth() == iterableDate.getMonth() &&
                new Date(item.Time).getDate() == iterableDate.getDate())[0];
        }

        function myCustomConfigurationChangeFunction() {
            let container = $(`#${symbolContainerDiv.id}`);
            container.html(result ? result.toFixed(scope.config.decimalPlaces) : result, );
            container.css({ 'color': scope.config.textColor });
            container.css({ 'font-size': scope.config.fontSize });
        }

    };

    CS.symbolCatalog.register(myEDcolumnDefinition);

})(window.PIVisualization);