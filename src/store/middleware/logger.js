const logger = param => store => next => action => {
  console.log('Logging to', param.destination);
  return next(action);
};

export default logger;
