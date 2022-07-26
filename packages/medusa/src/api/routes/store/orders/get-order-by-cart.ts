import { OrderService } from "../../../../services"
import { ExtendedRequest } from "../../../../types/global"
import { Order } from "../../../../models"

/**
 * @oas [get] /orders/cart/{cart_id}
 * operationId: GetOrdersOrderCartId
 * summary: Retrieves Order by Cart id
 * description: "Retrieves an Order by the id of the Cart that was used to create the Order."
 * parameters:
 *   - (path) cart_id=* {string} The ID of Cart.
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/order"
 */
export default async (req: ExtendedRequest<Order>, res) => {
  const { cart_id } = req.params

  const orderService: OrderService = req.scope.resolve("orderService")
  const order = await orderService.retrieveByCartId(cart_id, req.retrieveConfig)

  res.json({ order })
}
