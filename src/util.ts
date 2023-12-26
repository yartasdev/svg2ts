import { glob } from "glob";
import { optimize } from "svgo";
import { join, relative } from "path";
import camelCase from "lodash.camelcase";
import kebabCase from "lodash.kebabcase";
import { cosmiconfigSync } from "cosmiconfig";
import { SVGConfig, SVGPreview } from "./config.interface";
import { JSDOM } from 'jsdom'; 
import { outputFileSync, readFileSync } from "fs-extra";
import { NewLineKind, NodeFlags, ScriptKind, ScriptTarget, Statement, SyntaxKind, VariableStatement, createPrinter, createSourceFile, factory } from "typescript";

export function createSVG(configs: SVGConfig[]) {
 
  for(const config of configs) {

    if(!config.target) throw new Error('Please specify a target folder!');
    if(!config.output) throw new Error('Please specify a output folder!');

    const files = glob.sync(config.target + '/**/*.svg');

    if(!files || !files.length) throw new Error('No .svg file was found in the folder you specified.')
  
    const statements: Statement[] = [];

    const previews: SVGPreview[] = [];
  
    for(const file of files) {
  
      const identifier = getIdentifierName(file, config); 

      const { data } = optimize(readFileSync(file, { encoding: 'utf8' }), {...config.svgo}); 
  
      statements.push(createVariableStatement(identifier, data));

      previews.push({identifier, data});
  
    }

    createSVGIconPreview(previews, config);
  
    const content = getPrinter().printFile(factory.updateSourceFile(getSourceFile(), statements));
  
    outputFileSync(join(config.output, 'index.ts'), content, { encoding: 'utf8' });

  }

}

export function createSVGIconPreview(previews: SVGPreview[], config: SVGConfig) {

  const { document } = (new JSDOM(readFileSync(join(__dirname, '..', 'src', 'assets', 'index.html'), { encoding: 'utf8' }))).window;

  const container = document.querySelector('#content');

  if(!container) return;

  for(const {identifier, data} of previews) {
    const wrapper = document.createElement('li');
    wrapper.setAttribute('class', 'col mb-4');
    wrapper.innerHTML = createPreviewIconHTML(identifier, data);
    container.appendChild(wrapper);
  }

  outputFileSync(join(config.output, 'index.html'), document.documentElement.outerHTML, { encoding: 'utf8' });

}

export function createSVGWithConfig(dir: string = process.cwd()) {
 
  const search = cosmiconfigSync("svg2ts").search(dir);

  const config: SVGConfig[] | null = search?.config;

  if (!config) throw new Error('Please create a config file in your root directory with "svg2ts.config.{.js,.cjs,.ts}"');

  createSVG(config);

}

export function getIdentifierName(path: string, config: SVGConfig) {
  const rel = slash(relative(config.target, path));
  const identifier = config.prefix ? `${config.prefix}-${identify(rel)}` : `${identify(rel)}`;
  return camelCase(identifier);
}

function getPrinter() {
  return createPrinter({ newLine: NewLineKind.LineFeed });
}

function getSourceFile(name = 'index.ts') {
  return createSourceFile(name, '', ScriptTarget.Latest, false, ScriptKind.TS)
}

function createVariableStatement(identifier: string, content: string): VariableStatement { 
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(
        factory.createIdentifier(identifier),
        undefined,
        undefined,
        factory.createStringLiteral(
          content,
          true
        )
      )],
      NodeFlags.Const
    )
  )
}

function createPreviewIconHTML(identifier: string, data: string) {
  return `
  <div class="d-block text-body-emphasis text-decoration-none">
    <div class="px-3 py-4 mb-2 bg-body-secondary text-center rounded text-white fill-white">${data}</div>
    <div class="name text-muted text-decoration-none text-center pt-1">${identifier} (${kebabCase(identifier)})</div>
  </div>`.trim();
}

function slash(path: string) {
  const isExtendedLengthPath = path.startsWith('\\\\?\\');
	if (isExtendedLengthPath) return path;
	return path.replace(/\\/g, '/');
}

function identify(path: string) {
  return (path.substring(0, path.lastIndexOf('.')) || path).split('/').join('-')
}