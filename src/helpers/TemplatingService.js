const jade = require('jade'),
  path = require('path');

module.exports = class TemplatingService {

  render = (filePath, context) => {
    return jade.compileFile(filePath, {
      basedir: path.resolve(process.cwd(), 'views')
    })(context);
  };

}
