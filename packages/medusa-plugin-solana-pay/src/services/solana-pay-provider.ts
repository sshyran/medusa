import {
  Cluster,
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
} from "@solana/web3.js"
import {
  encodeURL,
  createQR,
  findReference,
  validateTransfer,
} from "@solana/pay"
import BigNumber from "bignumber.js"

import { PaymentService } from "medusa-interfaces"
import { Cart, RegionService, TotalsService } from "@medusajs/medusa"

type SolanaPayProviderOptions = {}

type DIParams = { totalsService: TotalsService; regionService: RegionService }

class SolanaPayProvider extends PaymentService {
  private connection: any

  static identifier = "solana-pay"
  static USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

  private regionService_: RegionService
  private totalsService_: TotalsService
  private options_: SolanaPayProviderOptions

  constructor(
    { totalsService, regionService }: DIParams,
    options: SolanaPayProviderOptions
  ) {
    super()

    this.options_ = options

    // TODO: read network config from the env
    this.connection = new Connection(clusterApiUrl("devnet"), "finalized")

    this.regionService_ = regionService

    this.totalsService_ = totalsService
  }

  /**
   * Create Solana payment request link.
   * @param cart
   * @returns Promise<object> - promise which resolves to an object containing a Solana payment link.
   */
  async createPayment(cart: Cart): Promise<object> {
    // TODO: read merchant's wallet address from the env
    const recipient = new PublicKey(
      "F3SLm4LXUJ2TogyDomr1MtYYXp717VWWJQNaY8Brs6cL"
    )

    // TODO: calculate amount

    const { region_id } = cart
    const { currency_code } = await this.regionService_.retrieve(region_id)

    if (currency_code !== "usd") {
      // TODO: throw error
    }

    const amount = await this.totalsService_.getTotal(cart)

    // create unique reference for this session which will alter be used to find transaction on the chain
    const reference = new Keypair().publicKey

    const usdcToken = new PublicKey(SolanaPayProvider.USDC_MINT_ADDRESS)

    const url = encodeURL({
      amount: new BigNumber(amount),
      recipient,
      reference,
    })

    return { amount, recipient, reference, url, splToken: usdcToken }
  }

  /*
   * Find the payment on the blockchain using reference.
   */
  async retrievePayment(data: object): Promise<any> {
    const { amount, reference } = data

    try {
      const sigInfo = await findReference(this.connection, reference, {
        finality: "finalized",
      })

      await validateTransfer(this.connection, sigInfo.signature, {
        recipient: this.options.address,
        amount,
      })

      return
    } catch (e) {}
  }

  async getStatus(data: object): Promise<string> {
    return (await retrievePayment(data)) ? "authorized" : "pending"
  }

  async authorizePayment(session, context = {}) {
    const stat = await this.getStatus(session.data)
    try {
      return { data: session.data, status: stat }
    } catch (error) {
      throw error
    }
  }

  /*
   * Blockchain...
   */
  async deletePayment(): Promise<void> {
    return
  }

  // updatePayment(cart) {
  //   throw Error("updatePayment must be overridden by the child class")
  // }
  //
  // getStatus() {
  //   throw Error("getStatus must be overridden by the child class")
  // }
  //
  // authorizePayment() {
  //   throw Error("authorizePayment must be overridden by the child class")
  // }
  //
  // capturePayment() {
  //   throw Error("capturePayment must be overridden by the child class")
  // }
  //
  // refundPayment() {
  //   throw Error("refundPayment must be overridden by the child class")
  // }
  //
  // deletePayment() {
  //   throw Error("deletePayment must be overridden by the child class")
  // }
}

export default SolanaPayProvider
