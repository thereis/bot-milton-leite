function Command(commandName: string) {
  return function (target: Function) {
    Object.assign(target.prototype, { commandName });
  };
}

export default Command;
