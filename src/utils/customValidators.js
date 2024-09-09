export const passwordConfirmation = (password_confirm, { req }) => {
	if (password_confirm !== req.body.password) {
		return false;
	}
	return true;
};
