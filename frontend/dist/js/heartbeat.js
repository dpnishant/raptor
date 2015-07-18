//Docs: http://nakupanda.github.io/bootstrap3-dialog/#available-options 
var dialog_config = {
  type: 'type-danger',
  title: 'Service Unavailable',
  message: 'Please contact your server administrator.',
  buttons: [{
    icon: 'glyphicon glyphicon-send',
    label: 'Retry',
    cssClass: 'btn-primary',
    autospin: true,
    autodestroy: false,
    action: function(dialogRef) {
      dialogRef.enableButtons(false);
      dialogRef.setClosable(false);
      dialogRef.getModalBody().html('Checking service hearbeat...');
      setTimeout(function () {
        clearInterval(beat);
        var beat = setInterval('hearbeat()', 5000);
        $.each(BootstrapDialog.dialogs, function(id, dialog){
          dialog.close();
        });
      }, 3000);
    }
  }, {
    label: 'Close',
    action: function(dialogRef) {
      $.each(BootstrapDialog.dialogs, function(id, dialog) {
        dialog.close();
      });
    }
  }],
  onshow: function (dialogRef) {
    $.each(BootstrapDialog.dialogs, function (id, dialog) {
      dialog.close();
    })
  }
};

function heartbeat() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/raptor/heartbeat');
  xhr.onreadystatechange = function(e) {
    if (this.readyState !== 4 && this.status !== 200) {
      BootstrapDialog.show(dialog_config);
  }};
  xhr.send();
}

var beat = setInterval('heartbeat()', 5000);