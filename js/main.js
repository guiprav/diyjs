document.addEventListener('DOMContentLoaded', function setupEditors() {
	$('.editor').each(function(i, editorContainer) {
		var $editorContainer = $(editorContainer);
		var editor = ace.edit(editorContainer);
		var theme = editorContainer.getAttribute('theme') || 'monokai';
		var mode = editorContainer.getAttribute('mode') || 'javascript';
		if(theme) {
			editor.setTheme('ace/theme/' + theme);
		}
		if(mode) {
			editor.getSession().setMode('ace/mode/' + mode);
		}
		$editorContainer.data('aceEditor', editor);
		$editorContainer.data('originalContents', editor.getValue());
	});
});
$(document).on('click', '.reset-button', function() {
	var $this = $(this);
	var editor = (
		$this.closest('.editor-controls')
			.siblings('.editor')
			.data('aceEditor')
	);
	editor.setValue($this.data('originalContents'));
});
