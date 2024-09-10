export const createSchema = {
	text: {
		notEmpty: { errorMessage: "Text can't be empty" },
	},
	attachment: {
		optional: true,
	},
};
