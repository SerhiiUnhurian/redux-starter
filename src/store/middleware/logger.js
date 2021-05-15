const logger = param => store => next => action => {
  console.log('Logging to', param.destination);
  next(action);
};

export default logger;
