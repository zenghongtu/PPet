import ua from 'universal-analytics';

let visitor: any = null;

export const initGA = () => {
  visitor = ua('UA-160700616-1');
  sendPageView();
};

export const sendPageView = (path = '/') => {
  visitor?.pageview(path).send();
};

export const sendEvent = (category = 'window', action = 'focus') => {
  visitor?.event(category, action).send();
};
