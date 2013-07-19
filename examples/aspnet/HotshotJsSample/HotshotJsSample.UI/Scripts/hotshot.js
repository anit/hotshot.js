ModalForm = function (options) { 
	this.container = $('#' + options.containerId);
	this.modelPrefix = options.modelPrefix;
	this.columnNames = options.columnNames;
	this.AddHeader = options.AddHeader || this.AddHeader;
	this.EditHeader = options.EditHeader || this.EditHeader;
	if(this.container.length < 1)
		return;

	this.listTable = this.container.find('table');
	this.modalForm = this.container.find('.modal');
	this.parentForm = this.container.closest('form');
	this.fieldNames = $.map(this.modalForm.find('[name]'), function (item, idx) {
		return $(item).attr('name');
	});

	if(this.container && this.modelPrefix)
		this.initialize();
};

$.extend(ModalForm.prototype, {



	//
	//Functions and properties that can be overrided.
	//

	//Column names from the model to be displayed in the table. Give in order.
	columnNames: [], 
	EditHeader: 'Edit',
	AddHeader: 'Add',
	EmptyMessage: 'Nothing Added!',

	container: null,

	initialize: function () {
		//Bind events to add, edit, remove and form submit buttons
		this.container.find('.create-model').click($.proxy(this.openAdd, this));
		this.container.find('.edit-model').click($.proxy(this.openEdit, this));
    	this.container.find('.remove-model').click($.proxy(this.Remove, this));
    	this.container.find('.save-model').click($.proxy(this.saveModel, this));
    	this.parentForm.find('[type="submit"]').click($.proxy(this.onSubmit, this));

    	this.modalForm.find('[required]').on('change', function (e) {
			if($(this).val().trim().length < 1) {
				$(this).toggleClass('modal-field-error');
			} else {
				$(this).toggleClass('modal-field-valid');
			}
		});
	},

	validate: function () {
		var flag=true;
		this.modalForm.find('[required]').each(function () {
			if($(this).val().trim().length < 1) {
				flag = false;
			}
		});
		return flag;
	},

	saveModel: function (e) {
		e.preventDefault();
		if(!this.validate())
			return;

		if($(e.currentTarget).data('targetRow') == '-1')
			this.Add();
		else
			this.Edit($(e.currentTarget).data('targetRow'));
		this.modalForm.modal('hide');
		this.toggleTable('save');
		var event = $.Event("saved");
		$(this).trigger(event);

	},

	Add: function () {
		var tableRow = $('<tr></tr>');
		this.prepareTr(this.modalForm, tableRow, this.columnNames, 'add');
		var tbody = this.listTable.find('tbody');
		if(tbody.find('tr').length > 0)
			tbody.find('tr:last').after(tableRow);
		else
		    tbody.append(tableRow);

		var event = $.Event('added');
		event.data = tableRow;
		$(this).trigger(event);
	},

	Edit: function (targetRowIndex) {
		var i=0;
		var tableRow = $(this.listTable.find('tbody > tr')[parseInt(targetRowIndex)]);
		this.prepareTr(this.modalForm, tableRow, this.columnNames,'edit');
		var tableDatas = tableRow.find('td');
		var displayValues = this.extractDisplayVals(this.modalForm, this.columnNames);
		for(i=0; i<displayValues.length; i++) {
			$(tableDatas[i]).html(displayValues[i]);
		}

		var event = $.Event('edited');
		event.data = tableRow;
		$(this).trigger(event);
	},

	openAdd: function (e) {
		e.stopPropagation();
		this.modalForm.find('[name]:not([type=radio], [type=checkbox])').val('');
		this.modalForm.find(':checked').removeAttr('checked');
		this.modalForm.find('#myModalLabel').html(this.AddHeader);
		this.modalForm.find('[name]').trigger('change');
		this.modalForm.find('.save-model').data('targetRow', -1);
		this.modalForm.modal('show');
	},

	openEdit: function (e) {
		e.preventDefault();
		var self = this;
		this.modalForm.find('#myModalLabel').html(this.EditHeader);	
		var row = $(e.currentTarget).closest('tr');
		var model = JSON.parse(row.attr('data-all'));
		var rowIndex = this.listTable.find('tbody > tr').index(row);
		this.modalForm.find('.save-model').data('targetRow', rowIndex);
    	this.modalForm.find('[name]').each(function () {
    	    var name = $(this).attr('name'),
                type = $(this).attr('type'),
                value = self.getValFromObj(model, name);
    	    $(this).data('value', value);
             
    	    if (type === 'radio') {
    	        $(this).closest('form').find('[name="' + name + '"][value="' + value + '"]').click();
    	    }
    	    else {
    	        $(this).val(value).change();
    	    }
    	});
    	this.modalForm.modal('show');
    	this.modalForm.find('[required]').trigger('change');
	},

	Remove: function (e) {
		e.preventDefault();
		$(e.target).closest('tr').remove();
		this.toggleTable('remove');
		var event = $.Event("removed");
		$(this).trigger(event);
	},

	onSubmit: function (e) {
	    var self = this;
	    var i, j;
	    var rows = this.listTable.find('tbody > tr');
	    for(i=0; i<rows.length; i++) {
	        var model = JSON.parse($(rows[i]).attr('data-all'));
	        for (j = 0; j < this.fieldNames.length; j++) {
	            var value = self.getValFromObj(model, this.fieldNames[j]);
	            $('<input type="hidden">').attr({
                    name: this.modelPrefix + '[' + i + '].' + this.fieldNames[j],
                    value: value
                }).appendTo(this.parentForm);
	        } 
	    }
		return true;
	},

	toggleTable: function (action) {

	},



	//
	// Helpers, not to be overrided.
	//

	prepareTr: function (modalForm, tableRow, columnNames, mode) {
	    var object = {};
	    var i=0;
	    var displayValues;

	    modalForm.find('[name]').each(function () {
	        var type = $(this).attr('type'),
                name = $(this).attr('name'),
                val = $(this).val();

	        if (type === 'radio' || type === 'checked') {
	            val = modalForm.find('[name="' + name + '"]:checked').val();
	        }
	        object[name] = val;
	    });

		tableRow.attr('data-all', JSON.stringify(object));

		if(mode == 'add') {
		    displayValues = this.extractDisplayVals(modalForm, columnNames);

		    for(i=0;i<displayValues.length; i++) {
		    	tableRow.append('<td>' + displayValues[i] + '</td>');
		    }

		    tableRow.append('<td><div class="btn-group pull-right"><a class="btn edit-model"><i class="icon-edit"></i> Edit</a><a class="btn remove-model btn-danger"><i class="icon-trash icon-white"></i> Remove</a></div></td>');
		    tableRow.find('.remove-model').click($.proxy(this.Remove, this));
		    tableRow.find('.edit-model').click($.proxy(this.openEdit, this));
		}

	    return object;
	},

	extractDisplayVals: function (elementsContainer, columnNames) {

		var displayValues = [];

	    for(i=0;i<columnNames.length;i++) {
	    	var element = elementsContainer.find('[name="' + columnNames[i] + '"]');
	    	if(element.is('input') || element.is('textarea')) {
	    		displayValues[i] = element.val();
	    	}
	    	else if(element.is('select')) {
	    		displayValues[i] = element.find('option:selected').html();
	    	}
	    	else {
	    		displayValues[i] = '-';
	    	}
	    }

	    return displayValues;
	},

	getValFromObj: function (obj, path) {
	    try {
	        var value = this.tryGetValByPath(obj, path);
	        if (value != undefined) {
	            return value;
	        }
	        else {
	            return eval('obj.' + path)
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

	tryGetValByPath: function (obj, path) {
	    try {
	        path = path.replace(/\[(\w+)\]/g, '.$1');  // convert indexes to properties
	        path = path.replace(/^\./, ''); // strip leading dot
	        var a = path.split('.');
	        while (a.length) {
	            var n = a.shift();
	            if(obj !== null) {
	                if (n in obj) {
	                    obj = obj[n];
	                } else {
	                    return;
	                }
	            }
	        }
	    }
	    catch (e) {}
        return obj;
    }

});
