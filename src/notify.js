import stamp from 'console-stamp';
import notifier from 'node-notifier';

stamp(console);

export default (...args) => {
  console.log(...args);
  notifier.notify(args.join('\n'));
};
