/**
 * ABI of the Params built-in contract.
 *
 * @link see [params.sol](https://docs.vechain.org/developer-resources/built-in-contracts#params-sol)
 */
const PARAMS_ABI = JSON.stringify([
    {
        constant: false,
        inputs: [
            {
                name: '_key',
                type: 'bytes32'
            },
            {
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'set',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: '_key',
                type: 'bytes32'
            }
        ],
        name: 'get',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'executor',
        outputs: [
            {
                name: '',
                type: 'address'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'key',
                type: 'bytes32'
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'Set',
        type: 'event'
    }
]);

export { PARAMS_ABI };
