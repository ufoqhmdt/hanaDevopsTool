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
        $(".hanaInstancesList").html(makeHanaInstanceItem(data));
      }).fail(function(data) {
        console.log(data);
      }).always(function(data) {
        // console.log(data);
      });
    });


    function makeHanaInstanceItem(data) {
      var html = "";
      for (var i = data.length - 1; i >= 0; i--) {
        var item = data[i];
        html += '<div class="col-lg-4">';
        html += '  <div class="panel panel-default">';
        html += '    <div class="panel-heading">HANA INSTANCE</div>';
        html += '    <div class="panel-body">';
        html += '        <div name="ID">' + item.ID + '</div>';
        html += '        <div name="HOSTNAME">' + item.HOSTNAME + '</div>';
        html += '        <div name="USERNAME">' + item.USERNAME + '</div>';
        html += '        <div name="PASSWORD">' + item.PASSWORD + '</div>';
        html += '        <div name="SCHEMANAME">' + item.SCHEMANAME + '</div>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';
      };
      return html;
    };


    function stepControl(step) {
      if (step && step === 1) {
        $(".devstep1").show();
        $(".devstep2").hide();
        $(".devstep3").hide();
      } else if (step && step === 2) {
        $(".devstep1").hide();
        $(".devstep2").show();
        $(".devstep3").hide();
      } else if (step && step === 3) {
        $(".devstep1").hide();
        $(".devstep2").hide();
        $(".devstep3").show();
      } else {
        $(".devstep1").show();
        $(".devstep2").hide();
        $(".devstep3").hide();
      }
    };

    function activeLi(self) {
      $(".ufo-navli").removeClass("active");
      $(self).addClass("active");
    }

    function setStepLiEvent() {
      $(".devstepli1").click(function() {
        stepControl(1);
        activeLi(this);
      });
      $(".devstepli2").click(function() {
        stepControl(2);
        activeLi(this);
      });
      $(".devstepli3").click(function() {
        stepControl(3);
        activeLi(this);
      });
    };

    stepControl();
    setStepLiEvent();

    $("#btnAddMapping").click(function(event) {
      event.preventDefault();
      var inputhost = $("#inputhost").val();
      var inputport = $("#inputport").val();
      var inputpwd = $("#inputpwd").val();
      var mappingHistory = $("#mappingHistory");

      var html = $('<a href="#" class="settings-data list-group-item"></a>');
      var innerHtml = inputhost + " : " + inputport + " @ (" + inputpwd + ")";
      html.data("inputhost", inputhost);
      html.data("inputport", inputport);
      html.data("inputpwd", inputpwd);
      html.html(innerHtml);
      $.ajax({
        url: "/admin/addHostSchemaPwdMapping",
        data: {
          "host": inputhost,
          "port": inputport,
          "pwd": inputpwd
        }
      }).done(function(data) {
        console.log(data);
        mappingHistory.append(html);
        html.fadeOut("slow").fadeIn("slow");
        return false;
      }).fail(function() {

      }).always(function() {

      });
      return false;
    });


  })