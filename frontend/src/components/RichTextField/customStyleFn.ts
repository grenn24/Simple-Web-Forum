import { DraftInlineStyle } from "draft-js";

export default function customStyleFn(style: DraftInlineStyle) {
	let appliedStyle = {};
	style.forEach((styleName) => {
		if (styleName?.startsWith("rgbcolor")) {
			// Extract RGB and alpha values from the style string
			const [r, g, b, a] = styleName
				.substring(9) // Remove 'rgb-' prefix
				.split("-");

			// Set the applied style
			appliedStyle = {
				color: `rgba(${r}, ${g}, ${b}, ${a})`,
			};
		}
	});
	return appliedStyle;
}
