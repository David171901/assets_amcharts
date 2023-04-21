(function (CS) {
  function symbolVis() {}
  CS.deriveVisualizationFromBase(symbolVis);

  var myCustomSymbolDefinition = {
    typeName: "tablaparettov3",
    displayName: "Tabla Eventos v3 - chungar",
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    visObjectType: symbolVis,
    iconUrl: "/Scripts/app/editor/symbols/ext/icons/TablaEventosCOMM.png",
    // inject: ['timeProvider'],
    // supportsCollections: true,
    supportsDynamicSearchCriteria: true,

    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        // DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
        Height: 300,
        Width: 1000,
        Intervals: 1000,
        // Mode: 'Compressed',
        FormatType: null,
        showDataItemNameCheckboxValue: true,
        showHeaderRightCheckboxValue: true,
        showDataItemNameCheckboxStyle: "table-cell",
        showTimestampCheckboxStyle: "table-cell",
        numberOfDecimalPlaces: 0,
        dataItemColumnColor: "black",
        headerRightTextColor: "#0A1C1A",
        headerRightColumnColor: "white",
        valueColumnColor: "black",
        hoverColor: "lightgreen",
        evenRowColor: "darkgray",
        oddRowColor: "none",
        outsideBorderColor: "none",
        headerBackgroundColor: "#50555A",
        subheaderBackgroundColor: "#297C72",
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

  symbolVis.prototype.init = function (scope, elem, timeProvider) {
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    console.log("\t[+]Tabla Eventos v2");
    var syContElement1 = elem.find("#table")[0];
    var newUniqueIDString1 =
      "myCustomSymbol_1" + Math.random().toString(36).substr(2, 16);
    syContElement1.id = newUniqueIDString1;
    var gearsName = [
      "MOLINO BARRAS 1",
      "MOLINO BARRAS 2",
      "MOLINO BOLAS 7X8",
      "MOLINO BOLAS 8X10",
      "MOLINO BOLAS 9 12X12",
      "CHANCADORA PRIMARIA C110",
      "CHANCADORA SECUNDARIA HP400",
      "CHANCADORA SECUNDARIA SYMONS",
      "CHANCADORA TERCIARIA HP500",
    ];

    function myCustomDataUpdateFunction(data) {
      if (data) {
        //   MOLINO BARRAS 1
        let gearOne = data.Data[0];
        // MOLINO BARRAS 2
        let gearTwo = data.Data[1];
        // MOLINO BOLAS 7X8
        let gearThree = data.Data[2];
        // MOLINO BOLAS 8X10
        let gearFour = data.Data[3];
        // MOLINO BOLAS 9 12X12
        let gearFive = data.Data[4];
        // CHANCADORA PRIMARIA C110
        let gearSix = data.Data[5];
        // CHANCADORA SECUNDARIA HP400
        let gearSeven = data.Data[6];
        // CHANCADORA SECUNDARIA SYMONS
        let gearEight = data.Data[7];
        // CHANCADORA TERCIARIA HP500
        let gearNine = data.Data[8];

        let arrayFilterZeros = filterZeros(
          gearOne,
          gearTwo,
          gearThree,
          gearFour,
          gearFive,
          gearSix,
          gearSeven,
          gearEight,
          gearNine
        );

        let arrayWithNameGear = addNameGear(arrayFilterZeros);

        let arrayData = []
          .concat(...arrayWithNameGear)
          .map((el) => {
            let arrayTime = el.Time.split("T")[0].split("-");

            return Object({
              ...el,
              Timestand: new Date(
                arrayTime[0] + "-" + arrayTime[1] + "-" + arrayTime[2]
              ).getTime(),
              TimeFormat: arrayTime[2] + "-" + arrayTime[1],
            });
          })
          .sort((a, b) => a.Timestand - b.Timestand);

        $("#" + syContElement1.id).empty();

        let zeroHeaders = ["DESCRIPCION", "DURACION (dd hh:mm)"];

        let headersRow = syContElement1.insertRow(-1);

        generatedRow(
          "FECHA",
          headersRow,
          zeroHeaders,
          "headerAPCellClass cellAPClass",
          "center",
          true,
          false
        );

        for (let index = 0; index < arrayData.length; index++) {
          let arrayFormat = arrayData[index].Value.split("||");

          generatedRow(
            arrayData[index].TimeFormat,
            headersRow,
            [
              arrayFormat[0] + arrayFormat[7] + "/" + arrayFormat[9],
              formatTime(arrayFormat[11]),
            ],
            "cellAPClass myValueCellClass",
            "center",
            false
          );
        }
      }
    }

    function filterZeros(...array) {
      let arrayFilterZeros = array.map((el) =>
        el.Values.filter((el) => el.Value.split("||").at(-1) != 0)
      );
      return arrayFilterZeros;
    }

    function addNameGear(...array) {
      array = array[0];
      let arrayWithNameGear = array.map((el, index) => {
        return el.map((elem) => {
          return {
            ...elem,
            Value: gearsName[index] + "||" + elem.Value,
          };
        });
      });
      return arrayWithNameGear;
    }

    function getTotalData(totalOfArrays, arrayUnitOne, arrayUnitTwo) {
      totalOfArrays.push("+");
      for (let index = 1; index < arrayUnitOne.length; index++) {
        index == 3 || index == 6 || index == 7
          ? totalOfArrays.push(
              (
                parseFloat(arrayUnitOne[index]) +
                parseFloat(arrayUnitTwo[index])
              ).toFixed(scope.config.numberOfDecimalPlaces)
            )
          : totalOfArrays.push(" ");
      }
      return totalOfArrays;
    }

    function dataToPush(data, index) {
      data = data.Data[index].Values.sort((a, b) => {
        return (
          -parseInt(a.Value.split("||")[2]) + parseInt(b.Value.split("||")[2])
        );
      });
      return data.map((element) => [
        element.Value.split("||")[0],
        element.Value.split("||")[1],
        element.Value.split("||")[3],
      ]);
    }

    function formatTime(time) {
      var day = Math.floor(time / (24 * 60));
      var hour = Math.floor((time - day * 24 * 60) / 60);
      var minute = Math.floor(time - day * 24 * 60 - hour * 60);
      return `${day == 0 ? "" : `${day}d `}${hour}:${minute}`;
    }

    function generatedRow(
      firstElement,
      insertRow,
      dataArray,
      nameClass,
      align,
      isHeader,
      isSubHeader
    ) {
      insertRow = syContElement1.insertRow(-1);
      let newCell = insertRow.insertCell(-1);
      newCell.innerHTML = firstElement;
      newCell.className = !isSubHeader
        ? "headerAPCellClass"
        : "subHeaderAPCellClass";
      isHeader
        ? (insertRow.className = "headerAPCellClass  cellAPClass")
        : (insertRow.className = "rowAPClass cellAPClass myValueCellClass");

      return dataArray.forEach((filasItemCell) => {
        let newRowsInsert = insertRow.insertCell(-1);
        newRowsInsert.innerHTML = filasItemCell;
        newRowsInsert.className = nameClass;
        newRowsInsert.style.textAlign = align;
      });
    }

    function generatedMultiRow(firstElement, insertRow, dataArray) {
      dataArray.forEach((filasItemCell) => {
        generatedRow(
          firstElement,
          insertRow,
          filasItemCell,
          "cellAPClass myValueCellClass",
          "center",
          false,
          true
        );
      });

      return true;
    }

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