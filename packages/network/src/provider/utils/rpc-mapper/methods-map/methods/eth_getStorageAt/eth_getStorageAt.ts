import { Hex0x } from '@vechain/sdk-core';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../../thor-client';
import type { BlockQuantityInputRPC } from '../../../types';
import { getCorrectBlockNumberRPCToVeChain } from '../../../../const';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';

/**
 * RPC Method eth_getStorageAt implementation
 *
 * @link [eth_getStorageAt](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_getstorageat)
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: The address to get the storage slot for as a hex string.
 *               * params[1]: The storage position to get as a hex string.
 *               * params[2]: The block number to get the storage slot at as a hex string or "latest".
 *
 * @returns The storage slot of the account at the given address formatted to the RPC standard.
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @throws {ProviderRpcError} - Will throw an error if the retrieval of the storage slot fails.
 */
const ethGetStorageAt = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // Input validation
    if (
        params.length !== 3 ||
        typeof params[0] !== 'string' ||
        typeof params[1] !== 'string' ||
        (typeof params[2] !== 'object' && typeof params[2] !== 'string')
    )
        throw new JSONRPCInvalidParams(
            'eth_getStorageAt',
            -32602,
            `Invalid input params for "eth_getStorageAt" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        const [address, storagePosition, block] = params as [
            string,
            string,
            BlockQuantityInputRPC
        ];

        // Get the account details
        return await thorClient.accounts.getStorageAt(
            address,
            Hex0x.canon(storagePosition, 32),
            {
                revision: getCorrectBlockNumberRPCToVeChain(block)
            }
        );
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_getStorageAt()',
            -32603,
            'Method "eth_getStorageAt" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetStorageAt };
