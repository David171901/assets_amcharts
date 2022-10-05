(function(CS) {
    //"use strict";
    var myEDcolumnDefinition = {
        typeName: "value4tagPonderated",
        displayName: 'value 4 tag ponderated',
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
                let first = getLastNotInterpolatedValue(first_data_array);

                let second_data_array = data.Data[1];
                let second = getLastNotInterpolatedValue(second_data_array);

                let third_data_array = data.Data[2];
                let third = getLastNotInterpolatedValue(third_data_array);

                let fourth_data_array = data.Data[3];
                let fourth = getLastNotInterpolatedValue(fourth_data_array);
                let result = null;

                result = second.value && first.value && first.date == second.date ? ((first.value * third.value) + (second.value * fourth.value)) / (third.value + fourth.value) : first.value;

                let container = $(`#${symbolContainerDiv.id}`);
                container.html(result ? result.toFixed(scope.config.decimalPlaces) : result);
                container.css({ 'color': scope.config.textColor });
                container.css({ 'font-size': scope.config.fontSize });

            }
        }

        function getLastNotInterpolatedValue(data_array) {
            let depuredValues = data_array.Values.filter(item => new Date(item.Time).getHours() == 0 && new Date(item.Time).getMinutes() == 00);
            return {
                value: parseFloat(depuredValues[depuredValues.length - 1].Value),
                date: new Date(depuredValues[depuredValues.length - 1].Time)
            };
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