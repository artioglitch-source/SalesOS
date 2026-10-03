import type {ModuleManifest} from './types';
import {moduleCatalog} from '@/../modules/catalog';

export function getModuleManifests():ModuleManifest[]{return moduleCatalog;}
