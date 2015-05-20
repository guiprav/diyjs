document.addEventListener('DOMContentLoaded', function setupEditors() {
	$('.editor').each(function(i, editor) {
		var $editor = $(editor);
		var aceEditor = ace.edit(editor);
		var components = findClosestEditorComponents($editor);
		var originalEditorContents = aceEditor.getValue();
		var theme = editor.getAttribute('theme') || 'monokai';
		var mode = editor.getAttribute('mode') || 'javascript';
		aceEditor.setOptions({ maxLines: 30 });
		if(theme) {
			aceEditor.setTheme('ace/theme/' + theme);
		}
		if(mode) {
			aceEditor.getSession().setMode('ace/mode/' + mode);
		}
		$editor.data('aceEditor', aceEditor);
		$editor.data('originalContents', originalEditorContents);
		if(originalEditorContents !== '') {
			components.$runButton.click();
		}
		components.$outputContainer.data (
			'originalContents',
			components.$outputContainer.text()
		);
	});
});
function findClosestEditorComponents($element) {
	var components = {};
	components.$root = $element.closest('.editor-area');
	components.$runButton = components.$root.find('.run-button');
	components.$resetButton = components.$root.find('.reset-button');
	components.$editor = components.$root.find('.editor');
	components.aceEditor = components.$editor.data('aceEditor');
	components.$outputContainer = components.$root.find('.program-output');
	return components;
}
$(document).on('click', '.run-button', function() {
	var $this = $(this);
	var components = findClosestEditorComponents($this);
	components.$outputContainer.text('');
	try {
		(new Function (
			'console',
			"'use strict';\n" + components.aceEditor.getValue()
		))({
			log: function() {
				components.$outputContainer.text (
					components.$outputContainer.text()
					+ [].join.call(arguments, ' ') + '\n'
				);
			},
			error: console.error.bind(console),
		});
	}
	catch(error) {
		components.$outputContainer.text (
			"Erro na linha " + (error.lineNumber - 1) + "!"
			+ '\n\n' + error
		);
	}
});
$(document).on('click', '.reset-button', function() {
	var $this = $(this);
	var components = findClosestEditorComponents($this);
	components.aceEditor.setValue (
		components.$editor.data('originalContents')
	);
	components.$outputContainer.text (
		components.$outputContainer.data('originalContents')
	);
});
