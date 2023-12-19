#!/usr/bin/env node

import { Command } from "commander";
import { createSVGWithConfig } from "./util";

const program = new Command()
  .name("svg2ts")
  .description(
    "This library collects .svg icons from the folder you specify into a single index.ts file, so you can use your .svg icons in the project without loading time."
  )
  .version("4.0.0")
  .option(
    "-c, --config-dir <value>",
    "Specify a directory for the config file (svg2ts.config.{.js,.ts})",
    process.cwd()
  );

program.parse(); 

createSVGWithConfig(program.opts().configDir);