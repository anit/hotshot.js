/*global $:false, jQuery:false */
/*jslint devel: true */
/*jshint forin: true */
/*jslint indent:2 */
(function ($) {
  'use strict';

  var CGridHelpers = {

    getDataSet: function (listTable) {
      return listTable.find('.cgrid-data-container > tr').map(function () { return $(this).data('all'); });
    },

    create: function (cGrid, listTableTemplate) {
      var i = 0,
        listTable = $(listTableTemplate),
        tableHeaderRow = listTable.find('.cgrid-header-row'),
        columns = cGrid.props.columns;

      for (var prop in columns) {
        if (columns.hasOwnProperty(prop)) {
          var col = $('<td></td>');
          col.html(cGrid.props.columns[prop].header);
          tableHeaderRow.append(col);
        }
      }
      tableHeaderRow.append('<td></td>');

      //create tableRows out of dataset
      var tableBody = listTable.find('tbody.cgrid-data-container');
      for (i = 0; i<cGrid.dataSet.length; i++) {
        var newRow = CGridHelpers.prepareTableRow(null, cGrid.props.columns, cGrid.dataSet[i], cGrid);
        tableBody.append(newRow);
      }

      return listTable;

    },


    prepareTableRow: function (existingRow, columns, obj, context) {
      var i = 0;

      //If tableRow is null then create a table row with columns specified. Used when a new row/model is added to the table/collection.
      if (!existingRow) {
        existingRow = $('<tr></tr>');
        for (i = 0; i < columns.length; i++) {
          existingRow.append('<td></td>');
        }

        existingRow.append('<td><div class="btn-group pull-right"><a class="btn edit-model"><i class="icon-edit"></i> Edit</a><a class="btn remove-model btn-danger"><i class="icon-trash icon-white"></i> Remove</a></div></td>');

        //TODO: bind proper events
        existingRow.find('.remove-model').click($.proxy(CGrid.events.remove, context));
        existingRow.find('.edit-model').click($.proxy(CGrid.events.openEdit, context));
      }

      $(existingRow).attr('data-all', JSON.stringify(obj));

      //Assuming that no. of columns defined and 'td's are going to be same.
      var tableDatas = existingRow.find('td');
      for(i = 0; i < tableDatas.length - 1; i++) {
        var valueFromObj = obj[columns[i].fieldName];
        $(tableDatas[i]).html(valueFromObj);
      }

      return existingRow;
    },

    /**
    * Method to show the popup. This method can change depending upon the popup used. Right now bootstrap
    * modal is used. So the function is too boostrap specifc.
    *
    * @param {jQuery} popUp
    */
    showPopup: function (popUp) {
      popUp.modal('show');
    },

    /**
    * Method to parse the form. This method will replace the word between patterns to corresponding
    * value in obj parameter.
    *
    * @param {Object} obj
    * @param {jQuery} popUp
    */
    parseForm: function (obj, popUp) {
      //TODO: parse
      var replace = popUp.html();
    },

    /**
    * Method to prepare the form with the object provided, setting headers, buttons and all the fields.
    *
    * @param {Object} formContainer Form container in which all the field values will be cleared
    *
    */
    prepareForm: function (obj, formContainer) {
      obj = obj || {};
      CGridHelpers.resetForm(formContainer);
      formContainer.find('[name]').each(function () {
        var name = $(this).attr('name'),
            type = $(this).attr('type'),
            value = Helpers.getValFromObj(obj, name);
        $(this).data('value', value);

        if (type === 'radio') {
          formContainer.find('[name="' + name + '"][value="' + value + '"]').click();
        } else {
          $(this).val(value).change();
        }
      });
    },


    /**
    * Method to reset all the fields in the form.
    *
    * @param {Object} formContainer Form container in which all the field values will be cleared
    *
    */
    resetForm: function (formContainer) {
      formContainer.find('[name]:not([type=radio], [type=checkbox])').val('');
      formContainer.find(':checked').removeAttr('checked');
      formContainer.find('[name]').trigger('change');
    },


    /**
    * Method to convert the object to input hidden fields.
    *
    * @param {Array} dataSet Array of objects with data to be transformed to input fields.
    * @param {Array} formFields Contains the form fields which should be transformed to input hidden fields.
    * @param {String} prefix  Prefix to be attached before the name of every input field
    *
    * @return {Object} returns jquery object which contains all the input fields
    *
    */
    serializeDataSet: function (dataSet, formFields, prefix) {

      var allInputFields = $('<div id="allInputFields-"' + prefix + '></div>');
      var i, j;

      for (i = 0; i < dataSet.length; i++) {
        var model = dataSet[i];
        for (j = 0; j < formFields.length; j++) {
          var value = Helpers.getValFromObj(model, formFields[j]);
          $('<input type="hidden">').attr({
            name: prefix + '[' + i + '].' + formFields[j],
            value: value
          }).appendTo(allInputFields);
        }
      }

      return allInputFields;
    },

    /**
    * Method to serialize the form and get the object hash.
    *
    * @param {Object} formContainer Form container from which the object hash will be extracted
    * @return {Object} object Object containing the all the values used has entered in the form
    *
    */
    serializeForm: function (formContainer, modelForm) {
      var object = {};
      formContainer.find('[name]').each(function () {
        var type = $(this).attr('type'),
            name = $(this).attr('name'),
            val = $(this).val();

        if (type === 'radio' || type === 'checked') {
          //check: what is modelForm?
          val = modelForm.find('[name="' + name + '"]:checked').val();
        }
        object[name] = val;
      });

      return object;
    },


    /**
    * Method to extract display values from the form. E.g select control should return the display value of the options selected instead of the value itself.
    *
    * @param {Object} formContainer Form container from which display values will be extracted
    * @param {Array} fieldNames Names of the field from which display values are to be extracted
    *
    *
    */
    extractDisplayVals: function (formContainer, fieldNames) {

      var displayValues = [];

      for (var i = 0; i < fieldNames.length; i++) {
        var element = formContainer.find('[name="' + fieldNames[i] + '"]');
        var value = { fieldName: fieldNames[i], displayValue: '' };


        if (element.data('display-value')) {
          value.displayValue = element.data('display-value');
        } else if (element.attr('type') === 'radio' || element.attr('type') === 'checked') {
          value.displayValue = formContainer.find('[name="' + fieldNames[i] + '"]:checked').html();
        } else if (element.is('input') || element.is('textarea')) {
          value.displayValue = element.val();
        } else if (element.is('select')) {
          value.displayValue = element.find('option:selected').html();
        }  else {
          value.displayValue = '-';
        }
        displayValues.push(value);
      }

      return displayValues;
    }


  };



  var CGrid = function (container) {

    this.container = container;
    this.container.append($(CGrid.templates.popUp));    //append popUp template to container
    this.popUp = this.container.find('.modal');


    this.props = {};
    this.props.modelPrefix = this.container.data('model-prefix');
    this.props.editMessageHeader = this.container.find('.edit-message-header').html();
    this.props.addMessageHeader = this.container.find('.add-message-header').html();
    this.props.columns = this.container.find('.cgrid-table').find('.table-column').map(function () { return $(this).data('info'); });


    this.dataSet = this.container.find('.model-data').map(function () { return $(this).data('all'); });

    //detach the model form in order to place it in the pop-up body
    this.modelForm = this.container.find('.model-form').detach();
    this.popUp.find('.modal-body').append(this.modelForm);

    this.listTable = CGridHelpers.create(this, CGrid.templates.listTable);
    this.container.find('.cgrid-table').replaceWith(this.listTable);

    this.container.find('.save-model').click($.proxy(CGrid.events.saveModel, this));
    this.container.find('.add-record').click($.proxy(CGrid.events.openAdd, this));
    this.container.closest('form').find('[type="submit"]').click($.proxy(CGrid.events.onSubmit, this));

  };

  CGrid.prototype = {

    add: function (obj) {
      var tableRow = CGridHelpers.prepareTableRow(null, this.props.columns, obj, this);
      this.listTable.find('.cgrid-data-container').append(tableRow);
      return tableRow;
    },

    edit: function (targetRowIndex, obj) {
      var tableRow = this.listTable.find('.cgrid-data-container > tr')[parseInt(targetRowIndex, 10)];
      CGridHelpers.prepareTableRow($(tableRow), this.props.columns, obj, this);
      return tableRow;
    }

  };

  CGrid.events = {
    openAdd: function (e) {

      e.stopPropagation();
      CGridHelpers.resetForm(this.modelForm);
      this.popUp.find('.popup-header').html(this.props.addMessageHeader);
      this.popUp.find('.save-model').data('targetRow', -1);

      CGridHelpers.showPopup(this.popUp);
    },

    openEdit: function (e) {

      e.preventDefault();
      this.popUp.find('.popup-header').html(this.props.editMessageHeader);
      var row = $(e.currentTarget).closest('tr');
      var obj = JSON.parse(row.attr('data-all'));
      var rowIndex = row.parents('tbody').find('tr').index(row);
      this.popUp.find('.save-model').data('targetRow', rowIndex);

      CGridHelpers.prepareForm(obj, this.modelForm);
      CGridHelpers.parseForm(obj, this.modelForm);
      CGridHelpers.showPopup(this.popUp);
    },

    saveModel: function (e) {

      e.preventDefault();

      var saveEvent;
      var obj = CGridHelpers.serializeForm(this.modelForm);
      var tableRow = {};

      if($(e.currentTarget).data('targetRow') === '-1') {
        tableRow = this.add(obj);
        saveEvent = $.Event('added');
      } else {
        tableRow = this.edit($(e.currentTarget).data('targetRow'), obj);
        saveEvent = $.Event('edited');
      }

      this.popUp.modal('hide');

      saveEvent.data = {tableRow: tableRow, model: obj};
      this.container.trigger(saveEvent);
    },

    remove: function (e) {
      e.preventDefault();
      var model = $(e.target).closest('tr').data('all');
      $(e.target).closest('tr').remove();
      var event = $.Event('removed');
      this.container.trigger(event, { model: model });
    },

    onSubmit: function (e) {
      var formFields = $.map(this.modelForm.find('[name]'), function (item, idx) {
        return $(item).attr('name');
      });
      var allInputFields = CGridHelpers.serializeDataSet(CGridHelpers.getDataSet(this.listTable), formFields, this.props.modelPrefix);
      this.container.parents('form').append(allInputFields);
    }
  };



  $.fn.gridify = function (options) {
    var cGrid = new CGrid(this);
    return this;
  };

  

  var Helpers = {

    /**
    * Method to extract value from object by giving the path as '.' seperated string
    *
    * @param {Object} obj Object from which the value is to be extracted,
    * @param {String} path This is '.' seperated string which contains the path of the value in the object hash. e.g. 'object.paramA.paramB'
    * @returns {Object} value Value obtained after extraction or throws exception if parsing is not successfull.
    *
    */
    getValFromObj: function (obj, path) {
      try {
        var value = Helpers.tryGetValByPath(obj, path);
        if (value !== undefined) {
          return value;
        }
        else {
          return eval('obj.' + path);
        }
      }
      catch (e) {
        try {
          return obj[path];
        }
        catch (e) {
          console.log('Could not parse ' + path, obj);
          return null;
        }
      }
    },


    /**
    * This method tries to extract value from object by '.' seperated path.
    *
    * @param {Object} obj Object from which the value is to be extracted,
    * @param {String} path This is '.' seperated string which contains the path of the value in the object hash. e.g. 'object.paramA.paramB'
    * @return {Object} value Value obtained after extraction or null value if any error occurs.
    *
    */
    tryGetValByPath: function (obj, path) {
      try {
        path = path.replace(/\[(\w+)\]/g, '.$1');  // convert indexes to properties
        path = path.replace(/^\./, ''); // strip leading dot
        var a = path.split('.');
        while (a.length) {
          var n = a.shift();
          if (obj !== null) {
            if (n in obj) {
              obj = obj[n];
            } else {
              return;
            }
          }
        }
      }
      catch (e) { }
      return obj;
    }
  };

  CGrid.templates = {
    listTable: [
      '<table class="cgrid-table">',
      '<thead>',
      '<tr class="cgrid-header-row">',
      '</tr>',
      '</thead>',
      '<tbody class="cgrid-data-container">',
      '</tbody>',
      '</table>'
    ].join('\n'),

    popUp: [
      '<div class="add-record create-model" data-toggle="modal">',
      '<i class="icon-plus-sign icon-large"></i> Add',
      '</div>',
      '<div id="" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
      '<div class="modal-header">',
      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
      '<h4 id="myModalLabel" class="popup-header"></h4>',
      '</div>',
      '<div class="modal-body">',
      '</div>',
      '<div class="modal-footer">',
      '<button type="button" class="btn" data-dismiss="modal" aria-hidden="true">Close</button>',
      '<button type="button" class="btn btn-success save-model">Save</button>',
      '</div>',
      '</div>',
    ].join('\n')
  };

}(jQuery));
