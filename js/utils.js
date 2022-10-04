MutationObserver =
	window.MutationObserver ||
	window.WebKitMutationObserver ||
	window.MozMutationObserver;

function observer(element, callback, attributeFilter = []) {
	return new MutationObserver(() => {
		callback(element);
	}).observe(element, {
		attributes: true,
		attributeFilter,
	});
}

export { observer };
