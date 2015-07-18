<?php

include_once("session.php");

?>
<!DOCTYPE HTML>
<html>
<head>
  <title>Raptor: Rules Editor (Client-Side)</title>
  <!--
  <link href="http://getbootstrap.com/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="http://getbootstrap.com/dist/css/bootstrap-theme.min.css" rel="stylesheet">
  -->
  <link rel="stylesheet" type="text/css" href="jsoneditor/core/jsoneditor.css">
  
  <style>
    
    html, body {
      font: 10pt Verdana;
    }

    #jsoneditor {
      width: 100%;
      height: 500px;
      margin-top: 10px;
    }

    .btn-file {
      position: relative;
      overflow: hidden;
    }

    .btn-file input[type=file] {
      position: absolute;
      top: 0;
      right: 0;
      min-width: 100%;
      min-height: 100%;
      font-size: 100px;
      text-align: right;
      filter: alpha(opacity=0);
      opacity: 0;
      outline: none;
      background: white;
      cursor: inherit;
      display: block;
    }

    .btn-success {
      background-image: -webkit-linear-gradient(top,#5cb85c 0,#419641 100%);
      background-image: -o-linear-gradient(top,#5cb85c 0,#419641 100%);
      background-image: -webkit-gradient(linear,left top,left bottom,from(#5cb85c),to(#419641));
      background-image: linear-gradient(to bottom,#5cb85c 0,#419641 100%);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff5cb85c', endColorstr='#ff419641', GradientType=0);
      filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);
      background-repeat: repeat-x;
      border-color: #3e8f3e;
      color: #fff;
      background-color: #5cb85c;
      border-color: #4cae4c;
      text-shadow: 0 -1px 0 rgba(0,0,0,.2);
      -webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,.15),0 1px 1px rgba(0,0,0,.075);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.15),0 1px 1px rgba(0,0,0,.075);
    }

    .btn {
      display: inline-block;
      padding: 6px 12px;
      margin-bottom: 0;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.42857143;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      background-image: none;
      border: 1px solid transparent;
      border-radius: 4px;
    }

    .iomenu {
      float: right;
      margin-bottom: 10px;
    }
  </style>

</head>
<body>
  <!--<h1> Rules Editor </h1>
  <p> A handy rules editor to view/edit rules, locally! </p>-->
  <div id="io_menu" class="iomenu">
    <span class="btn btn-success btn-file">Open <input type="file" id="loadDocument" value="Load"/></span>
    <input class="btn btn-success" type="button" id="saveDocument" value="Save"/>
  </div>

<div id="jsoneditor" ></div>
  
  <!-- require.js -->
  <script src="jsoneditor/require/require.js"></script>

  <!-- ace editor -->
  <script type="text/javascript" src="jsoneditor/ace/ace.js"></script>
  <!-- json lint -->
  <script type="text/javascript" src="jsoneditor/jsonlint/jsonlint.js"></script>

  <script src="jsoneditor/io/filereader.js"></script>
  <script src="jsoneditor/io/FileSaver.js"></script>

  <script>
    require.config({
      packages: [
        {
          name: 'JSONEditor',
          location: 'jsoneditor/core',
          main: 'JSONEditor'
        }
      ],
      paths: {
        'theme-jsoneditor.js': 'jsoneditor/ace/theme-jsoneditor.js'
      }
    });
  </script>

  <script type="text/javascript">
  // Load a JSON document
  FileReaderJS.setupInput(document.getElementById('loadDocument'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {
        editor.setText(event.target.result);
      }
    }
  });

  // Save a JSON document
  document.getElementById('saveDocument').onclick = function () {
    var blob = new Blob([editor.getText()], {type: 'application/json;charset=utf-8'});
    saveAs(blob, 'new.rulepack');
  };

  // JSON Editor
  var container, options, json, editor;

  require(['JSONEditor'], function (JSONEditor) {
    container = document.getElementById('jsoneditor');

    options = {
      mode: 'view',
      modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
      
      error: function (err) {
        console.trace();
        alert(err.toString());
      },
      
      editable: function (node) {
        //console.log(node);
        switch(node.field) {
          /*
          case '_id':
            return false;

          case '_field':
            return {
              field: false,
              value: true
            };
          */
          default:
            return true;
        }
      }
    };

    json = {};

    editor = new JSONEditor(container, options, json);
});
</script>
<script src="dist/js/heartbeat.js"></script>
</body>
</html>


