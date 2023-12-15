import { glob } from "glob";
import { optimize } from "svgo";
import { join, basename } from "path";
import camelCase from "lodash.camelcase";
import { cosmiconfigSync } from "cosmiconfig";
import { SVGConfig } from "./config.interface";
import { outputFileSync, readFileSync } from "fs-extra";
import { NewLineKind, NodeFlags, ScriptKind, ScriptTarget, Statement, SyntaxKind, VariableStatement, createPrinter, createSourceFile, factory } from "typescript";

export function createSVG(configs: SVGConfig[]) {
 
  for(const config of configs) {

    if(!config.target) throw new Error('Please specify a target folder!');
    if(!config.output) throw new Error('Please specify a output folder!'); 

    const files = glob.sync(join(config.target, '**/*.svg'));

    if(!files || !files.length) throw new Error('No .svg file was found in the folder you specified.')
  
    const statements: Statement[] = [];
  
    for(const file of files) {
  
      const identifier = getIdentifierName(file, config); 

      const { data } = optimize(readFileSync(file, { encoding: 'utf8' }), {...config.svgo}); 
  
      statements.push(createVariableStatement(identifier, data));
  
    }
  
    const content = getPrinter().printFile(factory.updateSourceFile(getSourceFile(), statements));
  
    outputFileSync(join(config.output, 'index.ts'), content, { encoding: 'utf8' });

  }

}

export function createSVGWithConfig(dir: string = process.cwd()) {
 
  const search = cosmiconfigSync("svg2ts").search(dir);

  const config: SVGConfig[] | null = search?.config;

  if (!config) throw new Error('Please create a config file in your root directory with "svg2ts.config.{.js,.cjs,.ts}"');

  createSVG(config);

}

export function getIdentifierName(path: string, config: SVGConfig) {
  const identifier = config.prefix
    ? `${config.prefix}-${path.replace(config.target, "").split("/").join("-")}`
    : `${path.replace(config.target, "").split("/").join("-")}`;
  return camelCase(basename(identifier, ".svg"));
}

export function getPrinter() {
  return createPrinter({ newLine: NewLineKind.LineFeed });
}

export function getSourceFile(name = 'index.ts') {
  return createSourceFile(name, '', ScriptTarget.Latest, false, ScriptKind.TS)
}

export function createVariableStatement(identifier: string, content: string): VariableStatement { 
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