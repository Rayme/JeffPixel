import { EncodeOptions } from '../shared/meta';
import type WorkerBridge from 'client/lazy-app/worker-bridge';

export async function encode(
  signal: AbortSignal,
  workerBridge: WorkerBridge,
  imageData: ImageData,
  options: EncodeOptions,
) {
  return workerBridge.oxipngEncode(signal, imageData, options);
}
