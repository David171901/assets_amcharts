(function (CS) {
  var myGaugeDefinition = {
    typeName: "tumv2",
    displayName: "tumv2",
    inject: ["timeProvider"],
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    visObjectType: symbolVis,
    iconUrl: "/Scripts/app/editor/symbols/ext/icons/TUM_COMM.png",
    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        //DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
        Height: 800,
        Width: 600,
        backgroundColor: "transparent",
        gridColor: "transparent",
        plotAreaFillColor: "transparent",
        decimalPlaces: 1,
        FormatType: null,
        showTitle: true,
        fontSize: 20,
        customTitle: "",
        // //color para las bandas
        // bandColor1: "#ea3838",
        // bandColor2: "#ffac29",
        // bandColor3: "#00CC00",
        // bulletSize: 8,
        // // Axis
        // startAxis: 0,
        // limitAxis1: 30,
        // limitAxis2: 60,
        // endAxis: 100,
        // // Others
        // bottomTextYOffset: -175,
        // labelOffset: 90,
        // unit: "",
        // valueInterval: 10,
        // // Type
        // type: "utilizacion",
      };
    },
    configOptions: function () {
      return [
        {
          title: "Editar Formato",
          mode: "format",
        },
      ];
    },
  };

  function symbolVis() {}

  CS.deriveVisualizationFromBase(symbolVis);
  symbolVis.prototype.init = function (scope, elem, timeProvider) {
    console.log("\t[+]Tum v1");
    // INIT ATRIBUTES
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    scope.config.FormatType = null;

    // DOM
    var symbolContainerDiv1 = elem.find("#container1")[0];
    var newUniqueIDString1 =
      "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
    symbolContainerDiv1.id = newUniqueIDString1;
    var chart;
    var dataArray = [];
    var colors = [
      "#173fcf", //0
      "#34bfcf", //1
      "#34bfcf", //2
      "#34bfcf", //2
      "#08c447", //4
      "#08c447", //5
      "#7104d1", //6
      "#de0929", //7
      "#de0929", //8
      "#de0929", //9
      "#de0929", //10
      "#34bfcf", //11
    ];

    function myCustomDataUpdateFunction(data) {
      dataArray = [];
      const datainfo = getDataProvider(data);
      dataArray.push(...datainfo);

      !chart
        ? (chart = generateChart(dataArray, scope))
        : refreshChart(chart, dataArray);
    }

    function getDataProvider(data) {
      // console.log(" ~ file: sym-gaugev3.js ~ line 73 ~ getDataProvider ~ data", data)
      // Events - Lista de eventos
      let eventArray = data.Data[0].Values || [];
      let disponibilidad = data.Data[1].Values || [];

      // PROCESSED VARIABLES
      // Time Models Vars
      let dataFormat = timeModels(eventArray, disponibilidad);

      return dataFormat;
    }

    function timeModels(data, disponibilidad) {
      return [
       /* {
          Label: "TF <br> [Tiempo de funcionamiento]",
          Value: getDailyAvailability(disponibilidad),
          Color: colors[10],
        },*/
        {
          Label: "RnP:",
          Value: filterToModelTime("RnP", data),
          Color: colors[1],
          balloonText: "RnP:"
          
        },
        { 
          Label: "RP:", 
          Value: filterToModelTime("RP", data), 
          Color: colors[2],
        },
        { 
          Label: "RG:", 
          Value: filterToModelTime("RG", data), 
          Color: colors[3],
         },
        { 
          Label: "RE", 
          Value: filterToModelTime("RE", data), 
          Color: colors[4],
        },

        { Label: "RM", Value: filterToModelTime("RM", data), Color: colors[5] },
        { Label: "MP", Value: filterToModelTime("MP", data), Color: colors[6] },
        { Label: "IP", Value: filterToModelTime("IP", data), Color: colors[7] },
        { Label: "IM", Value: filterToModelTime("IM", data), Color: colors[8] },
        { Label: "IE", Value: filterToModelTime("IE", data), Color: colors[9] },
        { Label: "IO", Value: filterToModelTime("IO", data), Color: colors[10] },
        {
          Label: "TnP",
          Value: filterToModelTime("TnP", data),
          Color: colors[11],
        },
      ];
    }

    function getDailyAvailability(data) {
      return data.reduce(
        (previousValue, currentValue) =>
          previousValue + parseInt(currentValue.Value),
        0
      );
    }

    function filterToModelTime(key, array) {
      return (
        array
          .filter((element, index) => element.Value.includes(key))
          .reduce(
            (previousValue, currentValue) =>
              previousValue +
              (parseInt(currentValue.Value.split("||").at(-1)) || 0),
            0
          ) / 60
      ).toFixed(2);
    }

    function refreshChart(chart, dataArray) {
      chart.validateData();
      chart.validateNow();
      return chart;
    }

    function createArrayOfChartTitles() {
      var titlesArray = null;
      if (scope.config.useCustomTitle) {
        titlesArray = [
          {
            text: scope.config.customTitle,
            size: scope.config.fontSize + 10,
          },
        ];
      }
      return titlesArray;
    }

    function myCustomConfigurationChangeFunction() {
      if (chart) {
        // set title
        if (scope.config.showTitle) {
          chart.titles = createArrayOfChartTitles();
        }
        if (scope.config.fontSize) {
          chart.titles = createArrayOfChartTitles();
          chart.axes[0].fontSize = scope.config.fontSize;
          chart.axes[0].bottomTextFontSize = scope.config.fontSize + 10;
        }

        chart.validateData();
        chart.validateNow();
      }
    }

    function generateChart(dataArray, scope) {
      chart = AmCharts.makeChart(symbolContainerDiv1.id, {
        theme: "none",
        type: "serial",
        titles: createArrayOfChartTitles(),
        fontSize: scope.config.fontSize,
        hideCredits: true,
        startDuration: 2,
        rotate: 90,
        dataProvider: dataArray,
        balloon: {
          maxWidth: 1000,
          fontSize: scope.config.fontSize + 5,
          fillAlpha: 1,
          borderThickness: 6,
          bordercolor: "#0a0a0a",
          cornerRadius: 2,
          textAlign: "left",
          fadeOutDuration: 10,
        },
        valueAxes: [
          {
            id: "v1",
            axisAlpha: 0,
            position: "left",
            maximum: 5,
            minimum: 0,
           // labelsEnabled: false,
          },
          {
            id: "v2",
            axisAlpha: 0,
            position: "right",
            minimum: 0,
            labelsEnabled: false,
          },
        ],
        graphs: [
          {
            balloonText: "[[category]]: <b>[[value]] horas</b>",
            fillColorsField: "Color",
            fillAlphas: 1,
            lineAlpha: 0.1,
            type: "column",
            valueField: "Value",
          },
          {
            valueAxis: "v2",
            balloonText: "[[category]]: <b>[[value]] horas</b>",
            fillColorsField: "Color",
            fillAlphas: 1,
            lineAlpha: 0.1,
            type: "column",
            valueField: "Value",
            valueField: "TnP",
          },
        ],
        depth3D: 20,
        angle: 30,
        chartCursor: {
          categoryBalloonEnabled: false,
          cursorAlpha: 0,
          zoomable: false,
        },
        categoryField: "Label",
        categoryAxis: {
          gridPosition: "start",
        },
      });
      refreshChart(chart, dataArray);
      return chart;
    }
  };

  CS.symbolCatalog.register(myGaugeDefinition);
})(window.PIVisualization);
