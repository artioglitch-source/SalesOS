import type {ModuleManifest} from './types';
import {helloModule} from '@/../modules/hello/manifest';

const manifests: ModuleManifest[] = [helloModule];

export function getModuleManifests(): ModuleManifest[] {
  return manifests;
}
