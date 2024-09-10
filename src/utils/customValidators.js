export const passwordConfirmation = (password_confirm, { req }) =>
	password_confirm === req.body.password;
