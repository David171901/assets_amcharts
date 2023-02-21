/**
 * Name: Tabla Disponibilidad
 * File name: sym-tabladisponibilidad.js
 * Atribute (4 atribute): 
 *    example path: 
        "af:\\YAUMS26\BASE DE DATOS  PIAF - UM YAULI\PLANTA CONCENTRADORA VICTORIA\00 EQUIPOS CRITICOS\MOLINOS\MOLINO PRIMARIO|DISPONIBILIDAD REAL GUARDIA DIAN (A)"
        "af:\\\\YAUMS26\\BASE DE DATOS  PIAF - UM YAULI\\PLANTA CONCENTRADORA VICTORIA\\00 EQUIPOS CRITICOS\\MOLINOS\\MOLINO PRIMARIO|DISPONIBILIDAD REAL GUARDIA NOCHE (B)"
        "af:\\YAUMS26\BASE DE DATOS  PIAF - UM YAULI\PLANTA CONCENTRADORA VICTORIA\00 EQUIPOS CRITICOS\MOLINOS\MOLINO PRIMARIO|DISPONIBILIDAD GUARDIA DIA (A)"
        "af:\\\\YAUMS26\\BASE DE DATOS  PIAF - UM YAULI\\PLANTA CONCENTRADORA VICTORIA\\00 EQUIPOS CRITICOS\\MOLINOS\\MOLINO PRIMARIO|DISPONIBILIDAD GUARDIA NOCHE (B)"

 *    example data: 
      1. [
        .
        .
        .
        ,{
            "Value": 100,
            "Time": "2023-01-04T11:40:00Z"
        },
        {
            "Value": "Calc Failed",
            "Time": "2023-01-05T00:00:00Z",
            "IsGood": false
        },
        {
            "Value": 100,
            "Time": "2023-01-05T00:20:00Z"
        },
        {
            "Value": 100,
            "Time": "2023-01-05T05:00:00Z"
        }
    ]
    2. [
        .
        .
        .
        ,{
            "Value": 100,
            "Time": "2023-01-04T11:40:00Z"
        },
        {
            "Value": "Calc Failed",
            "Time": "2023-01-05T00:00:00Z",
            "IsGood": false
        },
        {
            "Value": 100,
            "Time": "2023-01-05T00:20:00Z"
        },
        {
            "Value": 100,
            "Time": "2023-01-05T05:00:00Z"
        }
    ]
    3. [
        {
            "Value": 100,
            "Time": "2023-01-01T00:00:00Z"
        },
        {
            "Value": 96.01396942138672,
            "Time": "2023-01-02T00:00:00Z"
        },
        {
            "Value": 100,
            "Time": "2023-01-03T00:00:00Z"
        },
        {
            "Value": 99.99126434326172,
            "Time": "2023-01-04T00:00:00Z"
        },
        {
            "Value": 100,
            "Time": "2023-01-05T00:00:00Z"
        },
        {
            "Value": 99.48507690429688,
            "Time": "2023-01-05T05:00:00Z"
        }
    ]
    4. [
        {
            "Value": 100,
            "Time": "2023-01-01T00:00:00Z"
        },
        {
            "Value": 96.01396942138672,
            "Time": "2023-01-02T00:00:00Z"
        },
        {
            "Value": 100,
            "Time": "2023-01-03T00:00:00Z"
        },
        {
            "Value": 99.99126434326172,
            "Time": "2023-01-04T00:00:00Z"
        },
        {
            "Value": 100,
            "Time": "2023-01-05T00:00:00Z"
        },
        {
            "Value": 99.48507690429688,
            "Time": "2023-01-05T05:00:00Z"
        }
    ]
 */

(function (CS) {
  var myCustomSymbolDefinition = {
    typeName: "tableRunning",
    displayName: "Table Running - No Running",
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    visObjectType: symbolVis,
    inject: ["timeProvider"],
    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
        Height: 300,
        Width: 400,
        Intervals: 1000,
        Mode: "Compressed",
        showDataItemNameCheckboxValue: true,
        showHeaderRightCheckboxValue: true,
        showDataItemNameCheckboxStyle: "table-cell",
        showTimestampCheckboxStyle: "table-cell",
        numberOfDecimalPlaces: 2,
        dataItemColumnColor: "black",
        headerRightTextColor: "black",
        headerRightColumnColor: "white",
        valueColumnColor: "black",
        hoverColor: "lightgreen",
        evenRowColor: "darkgray",
        oddRowColor: "none",
        outsideBorderColor: "none",
        headerBackgroundColor: "black",
        headerTextColor: "white",
        fontSize: "16",
        unitFontSize: "px",
      };
    },
    configOptions: function () {
      return [
        {
          title: "Format Symbol",
          mode: "format",
        },
      ];
    },
  };

  function symbolVis() {}
  CS.deriveVisualizationFromBase(symbolVis);
  symbolVis.prototype.init = function (scope, elem, timeProvider) {
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    console.log("\t[+]Table Skips");
    var syContElement1 = elem.find("#container")[0];
    var newUniqueIDString1 =
      "myCustomSymbol_1" + Math.random().toString(36).substr(2, 16);
    syContElement1.id = newUniqueIDString1;

    // Funcion inicializadora
    function myCustomDataUpdateFunction(data) {
      console.log(data);
      if (data) {
        $("#" + syContElement1.id).empty();

        // let zeroHeaders = ["Diario", "Mensual"];
        let zeroHeaders = getPrevious12Hours('13:00');
        let subZeroHeaders = getPrevious12HoursWithIntervals(13);

        let headersRow = syContElement1.insertRow(-1);

        generatedRow(
          "",
          headersRow,
          zeroHeaders,
          "headerAPCellClass cellAPClass",
          "center",
          true,
          false
        );

        generatedRow(
          "",
          headersRow,
          subZeroHeaders,
          "headerAPCellClass cellAPClass",
          "center",
          false,
          false
        );

        generatedRow(
          "Equipo N1",
          headersRow,
          subZeroHeaders,
          "cellAPClass myValueCellClass",
          "center",
          false,
          false
        );

        // generatedRow(
        //   "Turno día (B)",
        //   headersRow,
        //   ruteSCAND,
        //   "cellAPClass myValueCellClass",
        //   "center",
        //   false,
        //   false
        // );

        // generatedRow(
        //   "Turno noche (A)",
        //   headersRow,
        //   ruteCARAND,
        //   "cellAPClass myValueCellClass",
        //   "center",
        //   false,
        //   false
        // );

        // generatedRow(
        //   "Promedio",
        //   headersRow,
        //   totalMINE,
        //   "myCustomRightHeaderCellClass cellAPClass myValueCellClass",
        //   "center",
        //   true,
        //   true
        // );
      }
    }

    function getPrevious12HoursWithIntervals(hour) {
      let date = new Date();
      date.setHours(hour);
        date.setMinutes(0)
      let result = [];
    
      for (let i = 0; i < 72; i++) {
        date.setMinutes(date.getMinutes() - 10);
        result.push(date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0"));
      }
      return result.reverse();
    }

    function getPrevious12Hours(time24h) {
      const previous12Hours = [];
      let hour = parseInt(time24h.split(':')[0]);
      for (let i = 1; i <= 12; i++) {
        hour = (hour - 1 + 24) % 24;
        previous12Hours.push(`${hour.toString().padStart(2, '0')}:00`);
      }
      return previous12Hours.reverse();
    }

    function dataToPush(arrayColector, data, indexMin, indexMax) {
      for (let selector = indexMin; selector < indexMax; selector++) {
        selector % 2 == 1
          ? arrayColector.push(
              (
                data.Data[selector].Values.reduce(
                  (previousValue, currentValue) =>
                    previousValue +
                    (isNaN(parseFloat(currentValue.Value))
                      ? 0
                      : parseFloat(currentValue.Value)),
                  0
                ) / data.Data[selector].Values.length
              ).toFixed(scope.config.numberOfDecimalPlaces)
            )
          : arrayColector.push(
              parseFloat(
                data.Data[selector].Values[
                  data.Data[selector].Values.length - 1
                ].Value.replace(",", "")
              ).toFixed(scope.config.numberOfDecimalPlaces)
            );
      }
      return arrayColector;
    }

    // Funcion creacion de fila
    function generatedRow(
      firstElement,
      insertRow,
      dataArray,
      nameClass,
      align,
      isHeader,
      isResult
    ) {
      insertRow = syContElement1.insertRow(-1);
      let newCell = insertRow.insertCell(-1);
      newCell.innerHTML = firstElement;
      newCell.className = "headerAPCellClass";
      isHeader
        ? (insertRow.className = "headerAPCellClass  cellAPClass")
        : (insertRow.className = "rowAPClass cellAPClass myValueCellClass");

      return dataArray.forEach((filasItemCell) => {
        let newRowsInsert = insertRow.insertCell(-1);
        newRowsInsert.innerHTML = `${filasItemCell}`;
        if (isHeader) newRowsInsert.colSpan = 6;
        newRowsInsert.className = nameClass;
        newRowsInsert.style.textAlign = align;
      });
    }

    // Funcion configuracion
    function myCustomConfigurationChangeFunction(data) {
      document.getElementById(syContElement1.id).style.border =
        "3px solid " + scope.config.outsideBorderColor;
      if (scope.config.showHeaderRightCheckboxValue) {
        scope.config.showHeaderRightCheckboxStyle = "table-cell";
      } else {
        scope.config.showHeaderRightCheckboxStyle = "none";
      }
      if (scope.config.showDataItemNameCheckboxValue) {
        scope.config.showDataItemNameCheckboxStyle = "table-cell";
      } else {
        scope.config.showDataItemNameCheckboxStyle = "none";
      }
    }
  };
  CS.symbolCatalog.register(myCustomSymbolDefinition);
})(window.PIVisualization);
