import {
    type TransactionsExpandedBlockDetail,
    type TransactionDetailNoRaw,
    type BlockDetail,
    type TransactionReceipt,
    type SendTransactionResult
} from '@vechain/vechain-sdk-network';
import {
    type SendRawTransactionResultRPC,
    type TransactionReceiptLogsRPC,
    type TransactionReceiptRPC,
    type TransactionRPC
} from './types';
import { ZERO_BUFFER } from '@vechain/vechain-sdk-core';
import {
    getNumberOfLogsAheadOfTransactionIntoBlockExpanded,
    getTransactionIndexIntoBlock
} from '../../helpers';
import { blocksFormatter } from '../blocks';
import { Hex } from '../../../../../core/src/utils/hex/Hex';

/**
 * Output formatter for Transaction details.
 *
 * @param tx - The Transaction details to be formatted.
 * @param blockHash - The hash of the block where the transaction is in.
 * @param blockNumber - The number of the block where the transaction is in.
 * @param chainId - The chain ID of the network.
 * @param txIndex - The index of the transaction in the block.
 *
 * @returns The RPC standard formatted transaction.
 */
const _formatTransactionToRPC = (
    tx: TransactionDetailNoRaw | TransactionsExpandedBlockDetail,
    blockHash: string,
    blockNumber: number,
    chainId: string,
    txIndex: number
): TransactionRPC => {
    return {
        // Supported fields
        blockHash,
        blockNumber: Hex.of0x(blockNumber),
        from: tx.origin,
        gas: Hex.of0x(tx.gas),
        chainId,
        hash: tx.id,
        nonce: tx.nonce as string,
        transactionIndex: Hex.of0x(txIndex),

        /**
         * `input`, `to`, `value` are being referred to the first clause.
         * Vechain supports multiple clauses in one transaction, thus the actual data should be obtained by looking into each clause.
         * Due to the single clause limitation of Ethereum, we assume the first clause is the clause from which we obtain the data.
         */
        input: tx.clauses[0].data,
        to: tx.clauses[0].to,
        value: Hex.of0x(tx.clauses[0].value),

        // Unsupported fields
        gasPrice: '0x',
        type: '0x',
        v: '0x',
        r: '0x',
        s: '0x',
        accessList: [],
        maxFeePerGas: '0x',
        maxPriorityFeePerGas: '0x',
        yParity: '0x'
    };
};

/**
 * Output formatter for Transaction details.
 * It converts the Transaction details into the RPC standard.
 *
 * @param tx - The Transaction details to be formatted.
 * @param chainId - The chain ID of the network.
 * @param txIndex - The index of the transaction in the block.
 *
 * @returns The RPC standard formatted transaction.
 */
const formatToRPCStandard = (
    tx: TransactionDetailNoRaw,
    chainId: string,
    txIndex: number
): TransactionRPC => {
    return _formatTransactionToRPC(
        tx,
        tx.meta.blockID,
        tx.meta.blockNumber,
        chainId,
        txIndex
    );
};

/**
 * Output formatter for Transaction details from expanded block.
 * It converts the Transaction details into the RPC standard.
 *
 * @param tx - The Transaction details to be formatted.
 * @param block - The block details to be formatted.
 * @param chainId - The chain ID of the network.
 * @param txIndex - The index of the transaction in the block.
 *
 * @returns The RPC standard formatted transaction.
 */
const formatExpandedBlockToRPCStandard = (
    tx: TransactionsExpandedBlockDetail,
    block: BlockDetail,
    txIndex: number,
    chainId: string
): TransactionRPC => {
    return _formatTransactionToRPC(
        tx,
        block.id,
        block.number,
        chainId,
        txIndex
    );
};

/**
 * Output formatter for Transaction Receipt details.
 * It converts the Transaction Receipt details, Transaction details and block into the RPC standard.
 *
 * @param transactionHash - The hash of the transaction to be formatted.
 * @param receipt - The Transaction Receipt to be formatted.
 * @param transaction - The Transaction details to be formatted.
 * @param blockContainsTransaction - The block contains the transaction to be formatted.
 * @param chainId - The chain ID of the network.
 */
function formatTransactionReceiptToRPCStandard(
    transactionHash: string,
    receipt: TransactionReceipt,
    transaction: TransactionDetailNoRaw,
    blockContainsTransaction: BlockDetail,
    chainId: string
): TransactionReceiptRPC {
    // Get transaction index
    const transactionIndex = getTransactionIndexIntoBlock(
        blocksFormatter.formatToRPCStandard(blockContainsTransaction, chainId),
        transactionHash
    );

    // Format transaction receipt logs
    const logIndexOffset = getNumberOfLogsAheadOfTransactionIntoBlockExpanded(
        blockContainsTransaction,
        transactionHash,
        chainId
    );
    const n = receipt.outputs.length > 0 ? receipt.outputs[0].events.length : 0;
    const filledLogIndexes = new Array<number>(n)
        .fill(logIndexOffset)
        .map((_, i) => i + logIndexOffset);

    const logIndexes: string[] = filledLogIndexes.map((i) => Hex.of0x(i));

    const logs: TransactionReceiptLogsRPC[] =
        receipt.outputs.length > 0 && receipt.outputs[0].events.length > 0
            ? receipt.outputs[0].events.map((event, index) => {
                  return {
                      blockHash: receipt.meta.blockID,
                      blockNumber: Hex.of0x(receipt.meta.blockNumber),
                      transactionHash: receipt.meta.txID as string,
                      address: event.address,
                      topics: event.topics.map((topic) => topic),
                      data: event.data,

                      removed: false,

                      transactionIndex: Hex.of0x(transactionIndex),
                      logIndex: logIndexes[index]
                  };
              })
            : [];

    return {
        blockHash: receipt.meta.blockID,
        blockNumber: Hex.of0x(receipt.meta.blockNumber),
        contractAddress:
            receipt.outputs.length > 0
                ? receipt.outputs[0].contractAddress
                : null,
        from: transaction.origin,
        gasUsed: Hex.of0x(receipt.gasUsed),
        logs,
        status: receipt.reverted ? '0x0' : '0x1',
        to: transaction.clauses[0].to,
        transactionHash: receipt.meta.txID as string,
        transactionIndex: Hex.of0x(transactionIndex),

        // Incompatible fields
        logsBloom: `0x${ZERO_BUFFER(256).toString('hex')}`,
        cumulativeGasUsed: '0x0',
        effectiveGasPrice: '0x0',
        type: '0x0'
    };
}

/**
 * Output formatter for Send Raw Transaction result.
 * It converts the SendTransactionResult into the RPC standard.
 *
 * @param transaction - The transaction result to be formatted.
 */
const formatSendRawTransactionToRPCStandard = (
    transaction: SendTransactionResult
): SendRawTransactionResultRPC => {
    return {
        result: transaction.id
    } satisfies SendRawTransactionResultRPC;
};

export {
    formatToRPCStandard,
    formatExpandedBlockToRPCStandard,
    formatTransactionReceiptToRPCStandard,
    formatSendRawTransactionToRPCStandard
};
