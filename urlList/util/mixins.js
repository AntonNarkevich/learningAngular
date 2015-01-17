/*global _*/
(function mixins(_) {
	'use strict';

	_.mixin({
		toPercent: function mixins(float) {
			if (float > 1) {
				float = 1;
			}

			if (float < 0) {
				float = 0;
			}

			return Math.round(float * 100);
		}
	});

}(_));