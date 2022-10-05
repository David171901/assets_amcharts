(function (BS) {

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    var definition = {

        typeName: 'piechart',
        displayName: 'Pie Chart',
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/comm.png',
        visObjectType: symbolVis,

        getDefaultConfig: function () {
            return {
                DataShape: 'Table',
                FormatType: null,
                Height: 500,
                Width: 500,
                fontSize: 22,
                textColor: "black",
                backgroundColor: "transparent",
                outlineColor: "white",
                useCustomTitle: false,
                customTitle: "",
                showLabels: true,
                showLegend: false,
                donut: false,
                labels: [],
                units: [],
                decimalPlaces: 2,
            };
        },

        configOptions: function () {
            return [{
                title: 'Format Symbol',
                mode: 'format'
            }];
        }
    };

    symbolVis.prototype.init = function (scope, elem) {
        console.log('\t[+]PieCharts');
        scope.config.FormatType = null;
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        var symbolContainerDiv = elem.find('#container')[0];
        var newUniqueIDString = "amChart_" + scope.symbol.Name;
        symbolContainerDiv.id = newUniqueIDString;

        var chart;
        var dataArray = [];

        function myCustomDataUpdateFunction(data) {
            console.log(data);
            if (data) {
                dataArray = [];
                for (var i = 0; i < data.Rows.length; i++) {
                    let item = data.Rows[i];

                    let itemHasLabel = !!item.Label;
                    
                    let itemHasUnits = !!item.Units;
                    if (itemHasLabel) scope.config.labels.push(item.Label.split('|')[0]);
                    if (itemHasUnits) scope.config.units.push(item.Units);
                    let itemTime = new Date(item.Time).toLocaleTimeString();
                    let itemValue = parseFloat(("" + item.Value).replace(",", "")).toFixed(scope.config.decimalPlaces);

                    let newDataObject = {
                        "Label": item.Label.split('|')[1] || "",
                        "Time": itemTime,
                        "Units": scope.config.units[i] || "",
                        "Value": itemValue,
                    };
                    dataArray.push(newDataObject);
                }
                

                if (!chart) chart = getNewChart(dataArray);
                else refreshChart(chart, dataArray)
            }
        }

        function getNewChart(dataArray) {
            return AmCharts.makeChart(symbolContainerDiv.id, {
                "type": "pie",
                "dataProvider": dataArray,
                "valueField": "Value",
                "titleField": "Label",
                "descriptionField": "Units",
                "titles": createArrayOfChartTitles(),
                "balloonText": "[[title]] [[value]] ([[percents]]%)",
                "labelText": "[[title]] ([[percents]]%)",
                "labelsEnabled": scope.config.showLabels,
                "hideCredits": true,
                "color": scope.config.textColor,
                "outlineColor": scope.config.outlineColor,
                "outlineAlpha": 1,
                "outlineThickness": 1,
                "innerRadius": 0,
                "fontSize": scope.config.fontSize,
                "colors": ["#3AB8A8","#34A496","#2F9084","#297C72", "#236960","#1D554F", "#17423D", "#102F2B",  "#0A1C1A", "#030908"],
                "legend": {
                    "enabled": scope.config.showLegend,
                    "color": scope.config.textColor,
                    "valueText": "[[value]] [[description]]",
                    "fontSize": scope.config.fontSize,
                    "align": "center",
                    "labelWidth": 150,
                    "position": "right",
                }
            });
        }


        function refreshChart(chart, dataArray) {
            chart.titles = createArrayOfChartTitles();
            chart.dataProvider = dataArray;
            chart.validateData();
            chart.validateNow();
        }

        function createArrayOfChartTitles() {
            var titlesArray;
            if (scope.config.useCustomTitle) {
                titlesArray = [
                    {
                        "text": scope.config.customTitle,
                        "size": (scope.config.fontSize + 5)
                    }
                ];
            }
            return titlesArray;
        }

        function myCustomConfigurationChangeFunction(data) {
            if (chart) {
                if (chart.fontSize !== scope.config.fontSize) {
                    chart.titles = createArrayOfChartTitles();
                    chart.fontSize = scope.config.fontSize;
                    chart.legend.fontSize = scope.config.fontSize ;
                }

                if (chart.color !== scope.config.textColor) {
                    chart.color = scope.config.textColor;
                    chart.legend.color = scope.config.textColor;
                }

                if (chart.backgroundColor !== scope.config.backgroundColor) chart.backgroundColor = scope.config.backgroundColor;
                if (chart.outlineColor !== scope.config.outlineColor) chart.outlineColor = scope.config.outlineColor;
                if (scope.config.useCustomTitle) chart.titles = createArrayOfChartTitles();
                else chart.titles = null;

                chart.labelsEnabled = scope.config.showLabels;
                chart.legend.enabled = scope.config.showLegend;

                if (scope.config.donut) chart.innerRadius = "60%";
                else chart.innerRadius = 0;

                chart.validateNow();
            }
        }
    }

    BS.symbolCatalog.register(definition);

})(window.PIVisualization);