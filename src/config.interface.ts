import { Config } from 'svgo';

export interface SVGConfig {
  target: string;
  output: string;
  svgo: Config;
  prefix?: string;
  preview?: string;
}

export interface SVGPreview {
  identifier: string;
  data: string;
}