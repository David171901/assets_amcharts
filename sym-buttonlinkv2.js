(function (PV) {
  PV.deriveVisualizationFromBase(symbolVis);

  var definition = {
    typeName: "buttonlinkv2",
    displayName: "Button Link",
    iconUrl: "/Scripts/app/editor/symbols/ext/Icons/navbarCOMM.png",
    visObjectType: symbolVis,
    datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
    getDefaultConfig: function () {
      return {
        Height: 50,
        Width: 400,
        title: "",
        href: "",
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
  symbolVis.prototype.init = function (scope, elem) {
    scope.Title = '';
    scope.Link = '';
    console.log("\t[+]Button Link");

    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;

    function myCustomDataUpdateFunction(data) {
      scope.Title = scope.Title;
      scope.Link = scope.Link;
      return true;
    }

    function myCustomConfigurationChangeFunction() {
      return true;
    }
  };

  PV.symbolCatalog.register(definition);
})(window.PIVisualization);
