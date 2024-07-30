import { type ThorClient } from '../../../../../../thor-client';
import { FunctionNotImplemented } from '@vechain/sdk-errors';

/**
 * RPC Method engine_newPayloadV2 implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const engineNewPayloadV2 = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw new FunctionNotImplemented(
        'engine_newPayloadV2',
        'Method "engine_newPayloadV2" has not been implemented yet.',
        {
            functionName: 'engine_newPayloadV2',
            thorClient,
            params
        }
    );
};

export { engineNewPayloadV2 };
