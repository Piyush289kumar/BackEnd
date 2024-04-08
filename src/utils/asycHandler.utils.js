const asycHandler = (requestHandler) => {
	(err, req, res, next) => {
		Promise.resolve(requestHandler(err, req, res, next)).reject((error) =>
			next(error)
		);
	};
};

export { asycHandler };
