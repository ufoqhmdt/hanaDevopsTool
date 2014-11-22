  jQuery(function() {
    // jQuery("#inputSLDHanaSchema").hide();
    /*$("#ifSchema").click(function() {
      var ischecked = this.checked;
      if (ischecked) {
        jQuery("#inputSLDHanaSchema").fadeIn("slow");
      } else {
        jQuery("#inputSLDHanaSchema").fadeOut("slow");
      }
    });*/

    $("#settingsHistory").on("click", ".settings-data", function(event) {
      $("#inputSLDHanaHost").val($(this).data("host"));
      $("#inputSLDHanaPort").val($(this).data("port"));
      $("#inputSLDHanaAccount").val($(this).data("account"));
      $("#inputSLDHanaPassword").val($(this).data("password"));
      $("#inputSLDHanaSchema").val($(this).data("schema"));
      $("#sqlEditor").val($(this).data("sql"));
    });



    $("#btnSaveSettings").click(function(event) {
      event.preventDefault();
      var inputSLDHanaHost = $("#inputSLDHanaHost").val();
      var inputSLDHanaPort = $("#inputSLDHanaPort").val();
      var inputSLDHanaAccount = $("#inputSLDHanaAccount").val();
      var inputSLDHanaPassword = $("#inputSLDHanaPassword").val();
      var inputSLDHanaSchema = $("#inputSLDHanaSchema").val();
      var sqlEditor = $("#sqlEditor").val();
      var settingsHistory = $("#settingsHistory");


      var html = $('<a href="#" class="settings-data list-group-item"></a>');
      var innerHtml = inputSLDHanaAccount + ":" + inputSLDHanaPort + " @ " + inputSLDHanaHost + ":/" + inputSLDHanaSchema;
      html.data("host", inputSLDHanaHost);
      html.data("port", inputSLDHanaPort);
      html.data("account", inputSLDHanaAccount);
      html.data("password", inputSLDHanaPassword);
      html.data("schema", inputSLDHanaSchema);
      html.data("sql", sqlEditor);
      html.html(innerHtml);
      $.ajax({
        url: "/saveSettings",
        data: {
          "host": inputSLDHanaHost,
          "port": inputSLDHanaPort,
          "account": inputSLDHanaAccount,
          "password": inputSLDHanaPassword,
          "schema": inputSLDHanaSchema,
          "sql": sqlEditor
        }
      }).done(function(data) {
        console.log(data);
        settingsHistory.append(html);
        html.fadeOut("slow").fadeIn("slow");
        return false;
      }).fail(function() {

      }).always(function() {

      });
      return false;
    });

    $("#btnRunSql").click(function(event) {
      event.preventDefault();
      var inputSLDHanaHost = $("#inputSLDHanaHost").val();
      var inputSLDHanaPort = $("#inputSLDHanaPort").val();
      var inputSLDHanaAccount = $("#inputSLDHanaAccount").val();
      var inputSLDHanaPassword = $("#inputSLDHanaPassword").val();
      var inputSLDHanaSchema = $("#inputSLDHanaSchema").val();
      var sqlEditor = $("#sqlEditor").val();
      $.ajax({
        url: "/getTenentsInfo",
        data: {
          "host": inputSLDHanaHost,
          "port": inputSLDHanaPort,
          "account": inputSLDHanaAccount,
          "password": inputSLDHanaPassword,
          "schema": inputSLDHanaSchema,
          "sql": sqlEditor
        }
      }).done(function(data) {
        console.log(data);
      }).fail(function(data) {
        console.log(data);
      }).always(function(data) {
        // console.log(data);
      });
    });


  })