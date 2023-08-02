/* Modificar codigo para obtener Jefe Inmediato */
Core.UI.Autocomplete.Init(
  $Element,
  function (Request, Response) {
    var URL = Core.Config.Get("Baselink"),
      Data = {
        Action: "AgentCustomerSearch",
        Term: Request.term,
        MaxResults: Core.UI.Autocomplete.GetConfig("MaxResultsDisplayed"),
      };

    $Element.data(
      "AutoCompleteXHR",
      Core.AJAX.FunctionCall(URL, Data, function (Result) {
        var ValueData = [];
        $Element.removeData("AutoCompleteXHR");
        $.each(Result, function () {
          ValueData.push({
            label: this.Label + " (" + this.Value + ")",
            // customer list representation (see CustomerUserListFields from Defaults.pm)
            value: this.Label,
            // customer user id
            key: this.Value,
          });
        });
        Response(ValueData);
      })
    );
  },
  function (Event, UI) {
    var label;
    var CustomerKey = UI.item.key,
      CustomerValue = UI.item.value;
    var expNombre = new RegExp('"(.*)"');
    var nombre = CustomerValue.match(expNombre);
    $Element.val(CustomerValue);
    $("#ClienteUser").val(CustomerKey);
    var nombreUsuario = $("#DynamicField_NombreUsuario");
    var organismo = $("#DynamicField_Organismo");
    var loading = $("#AJAXLoaderDynamicField_Organismo");
    if (organismo.length) {
      loading.show();
      $.ajax({
        url:
          Core.Config.Get("Baselink") +
          "Action=RecuperarOrganismoARBA;Subaction=PorAjax;Login=" +
          CustomerKey,
        method: "GET",
      }).done(function (json) {
        label = organismo.parent().siblings("label");
        if (label.hasClass("LabelError")) {
          label.removeClass("LabelError");
          Core.Form.Validate.UnHighlightError(organismo);
        }
        organismo.val(json.contenido).prop("readonly", true);
        loading.hide();
      });
    }
    if (nombreUsuario.length && nombreUsuario.is(":visible")) {
      label = nombreUsuario.parent().siblings("label");
      if (label.hasClass("LabelError")) {
        label.removeClass("LabelError");
        Core.Form.Validate.UnHighlightError(nombreUsuario);
      }
      if (nombre) {
        nombreUsuario.val(nombre[1]);
      }
    }
    $Element.prop("readonly", true);
    $("#RemoveCustomer").show();
  },
  "CustomerSearch"
);
