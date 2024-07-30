import { type ThorClient } from '../../../../../../thor-client';
import { FunctionNotImplemented } from '@vechain/sdk-errors';

/**
 * RPC Method net_listening implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const netListening = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw new FunctionNotImplemented(
        'net_listening',
        'Method "net_listening" has not been implemented yet.',
        {
            functionName: 'net_listening',
            thorClient,
            params
        }
    );
};

export { netListening };
