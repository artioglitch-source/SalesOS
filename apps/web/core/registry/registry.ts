import type {ModuleManifest} from './types';
import {generatedModuleCatalog} from './generated';

export function getModuleManifests():ModuleManifest[]{return generatedModuleCatalog;}
