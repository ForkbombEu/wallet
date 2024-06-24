module.exports = {
	rules: {
		'check-localization': {
			create: function (context) {
				return {
					SvelteElement(node) {
						if (node.type === 'SvelteElement' && node.children) {
							node.children.forEach((child) => {
								 if (
										child.type === 'SvelteText' &&
										typeof child.value === 'string' &&
										!/{.*}|^.{0,1}$/.test(child.value.trim())
									) {
										context.report({
											node: child,
											message: 'Non-literals:' + child.value.trim()
										});
									}
							});
						}
					}
				};
			}
		}
	}
};

