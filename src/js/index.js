import Path from 'path';
// eslint-disable-next-line no-undef
const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
const baseModule = requireFunc.main.children.find(module => module.id.includes('gen-spring/dist/spring.min.js'));
// eslint-disable-next-line no-unused-vars
let basePath;

if (!baseModule) {
    basePath = '.';
} else {
    basePath = Path.dirname(Path.dirname(baseModule.id));
}

basePath = Path.relative(process.cwd(), basePath) || '.';

const options = {
    // eslint-disable-next-line no-undef
    version: app.version,
    generator: ['pom']
};

export default options;
