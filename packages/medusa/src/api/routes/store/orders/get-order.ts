import { OrderService } from "../../../../services"
import { ExtendedRequest } from "../../../../types/global"
import { Order } from "../../../../models"

/**
 * @oas [get] /orders/{id}
 * operationId: GetOrdersOrder
 * summary: Retrieves an Order
 * description: "Retrieves an Order"
 * parameters:
 *   - (path) id=* {string} The id of the Order.
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
  const { id } = req.params

  const orderService: OrderService = req.scope.resolve("orderService")
  const order = await orderService.retrieve(id, req.retrieveConfig)

  res.json({ order })
}
