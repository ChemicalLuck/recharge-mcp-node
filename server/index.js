import { McpServer, StdioServerTransport } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { Recharge } from "@chemicalluck/recharge-api-node";

const server = new McpServer({ name: "recharge-mcp-node", version: "1.0.0" });
const recharge = new Recharge(process.env.RECHARGE_ACCESS_TOKEN);

const id = z.number().int();
const body = z.record(z.string(), z.unknown());
const query = z.record(z.string(), z.string()).optional();

function makeTool(name, description, schema, callFn) {
  server.registerTool(name, { description, inputSchema: schema }, async (params) => {
    try {
      const result = await callFn(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }] };
    }
  });
}

// ─── V1: Address ────────────────────────────────────────────────────────────

makeTool("v1_address_create", "Create an address for a customer (v1)",
  z.object({ customer_id: id, body }),
  ({ customer_id, body }) => recharge.v1.address.create(customer_id, body));

makeTool("v1_address_get", "Get an address by ID (v1)",
  z.object({ address_id: id }),
  ({ address_id }) => recharge.v1.address.get(address_id));

makeTool("v1_address_update", "Update an address (v1)",
  z.object({ address_id: id, body }),
  ({ address_id, body }) => recharge.v1.address.update(address_id, body));

makeTool("v1_address_delete", "Delete an address (v1)",
  z.object({ address_id: id }),
  ({ address_id }) => recharge.v1.address.delete(address_id));

makeTool("v1_address_list", "List addresses for a customer (v1)",
  z.object({ customer_id: id, query }),
  ({ customer_id, query }) => recharge.v1.address.list(customer_id, query));

makeTool("v1_address_count", "Count addresses (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.address.count(query));

makeTool("v1_address_validate", "Validate an address (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.address.validate(body));

makeTool("v1_address_apply_discount", "Apply a discount to an address (v1)",
  z.object({ address_id: id, body }),
  ({ address_id, body }) => recharge.v1.address.applyDiscount(address_id, body));

// ─── V1: Async Batch ─────────────────────────────────────────────────────────

makeTool("v1_async_batch_create", "Create an async batch (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.asyncBatch.create(body));

makeTool("v1_async_batch_get", "Get an async batch by ID (v1)",
  z.object({ batch_id: id }),
  ({ batch_id }) => recharge.v1.asyncBatch.get(batch_id));

makeTool("v1_async_batch_list", "List async batches (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.asyncBatch.list(query));

makeTool("v1_async_batch_process", "Process an async batch (v1)",
  z.object({ batch_id: id }),
  ({ batch_id }) => recharge.v1.asyncBatch.process(batch_id));

makeTool("v1_async_batch_create_task", "Create a task in an async batch (v1)",
  z.object({ batch_id: id, body }),
  ({ batch_id, body }) => recharge.v1.asyncBatch.createTask(batch_id, body));

makeTool("v1_async_batch_list_tasks", "List tasks in an async batch (v1)",
  z.object({ batch_id: id, query }),
  ({ batch_id, query }) => recharge.v1.asyncBatch.listTasks(batch_id, query));

// ─── V1: Charge ──────────────────────────────────────────────────────────────

makeTool("v1_charge_get", "Get a charge by ID (v1)",
  z.object({ charge_id: id }),
  ({ charge_id }) => recharge.v1.charge.get(charge_id));

makeTool("v1_charge_list", "List charges (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.charge.list(query));

makeTool("v1_charge_count", "Count charges (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.charge.count(query));

makeTool("v1_charge_change_next_charge_date", "Change the next charge date (v1)",
  z.object({ charge_id: id, body }),
  ({ charge_id, body }) => recharge.v1.charge.change_next_charge_date(charge_id, body));

makeTool("v1_charge_skip", "Skip a charge (v1)",
  z.object({ charge_id: id, body: body.optional() }),
  ({ charge_id, body }) => recharge.v1.charge.skip(charge_id, body));

makeTool("v1_charge_unskip", "Unskip a charge (v1)",
  z.object({ charge_id: id, body: body.optional() }),
  ({ charge_id, body }) => recharge.v1.charge.unskip(charge_id, body));

makeTool("v1_charge_refund", "Refund a charge (v1)",
  z.object({ charge_id: id, body: body.optional() }),
  ({ charge_id, body }) => recharge.v1.charge.refund(charge_id, body));

makeTool("v1_charge_process", "Process a charge (v1)",
  z.object({ charge_id: id }),
  ({ charge_id }) => recharge.v1.charge.process(charge_id));

makeTool("v1_charge_capture", "Capture a charge (v1)",
  z.object({ charge_id: id }),
  ({ charge_id }) => recharge.v1.charge.capture(charge_id));

makeTool("v1_charge_apply_discount", "Apply a discount to a charge (v1)",
  z.object({ charge_id: id, body }),
  ({ charge_id, body }) => recharge.v1.charge.apply_discount(charge_id, body));

makeTool("v1_charge_remove_discount", "Remove a discount from a charge (v1)",
  z.object({ charge_id: id }),
  ({ charge_id }) => recharge.v1.charge.remove_discount(charge_id));

// ─── V1: Checkout ────────────────────────────────────────────────────────────

makeTool("v1_checkout_create", "Create a checkout (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.checkout.create(body));

makeTool("v1_checkout_get", "Get a checkout by token (v1)",
  z.object({ token: z.string() }),
  ({ token }) => recharge.v1.checkout.get(token));

makeTool("v1_checkout_update", "Update a checkout (v1)",
  z.object({ token: z.string(), body }),
  ({ token, body }) => recharge.v1.checkout.update(token, body));

makeTool("v1_checkout_get_shipping_rates", "Get shipping rates for a checkout (v1)",
  z.object({ token: z.string() }),
  ({ token }) => recharge.v1.checkout.get_shipping_rates(token));

makeTool("v1_checkout_process", "Process a checkout (v1)",
  z.object({ token: z.string(), body: body.optional() }),
  ({ token, body }) => recharge.v1.checkout.process(token, body));

// ─── V1: Customer ────────────────────────────────────────────────────────────

makeTool("v1_customer_create", "Create a customer (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.customer.create(body));

makeTool("v1_customer_get", "Get a customer by ID (v1)",
  z.object({ customer_id: id }),
  ({ customer_id }) => recharge.v1.customer.get(customer_id));

makeTool("v1_customer_update", "Update a customer (v1)",
  z.object({ customer_id: id, body }),
  ({ customer_id, body }) => recharge.v1.customer.update(customer_id, body));

makeTool("v1_customer_delete", "Delete a customer (v1)",
  z.object({ customer_id: id }),
  ({ customer_id }) => recharge.v1.customer.delete(customer_id));

makeTool("v1_customer_list", "List customers (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.customer.list(query));

makeTool("v1_customer_count", "Count customers (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.customer.count(query));

makeTool("v1_customer_payment_sources", "Get payment sources for a customer (v1)",
  z.object({ customer_id: id }),
  ({ customer_id }) => recharge.v1.customer.payment_sources(customer_id));

// ─── V1: Discount ────────────────────────────────────────────────────────────

makeTool("v1_discount_create", "Create a discount (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.discount.create(body));

makeTool("v1_discount_get", "Get a discount by ID (v1)",
  z.object({ discount_id: id }),
  ({ discount_id }) => recharge.v1.discount.get(discount_id));

makeTool("v1_discount_update", "Update a discount (v1)",
  z.object({ discount_id: id, body }),
  ({ discount_id, body }) => recharge.v1.discount.update(discount_id, body));

makeTool("v1_discount_delete", "Delete a discount (v1)",
  z.object({ discount_id: id }),
  ({ discount_id }) => recharge.v1.discount.delete(discount_id));

makeTool("v1_discount_list", "List discounts (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.discount.list(query));

makeTool("v1_discount_count", "Count discounts (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.discount.count(query));

makeTool("v1_discount_apply_to_address", "Apply a discount to an address (v1)",
  z.object({ address_id: id, body }),
  ({ address_id, body }) => recharge.v1.discount.applyToAddress(address_id, body));

makeTool("v1_discount_apply_to_charge", "Apply a discount to a charge (v1)",
  z.object({ charge_id: id, body }),
  ({ charge_id, body }) => recharge.v1.discount.applyToCharge(charge_id, body));

makeTool("v1_discount_remove", "Remove a discount (v1)",
  z.object({ discount_id: id }),
  ({ discount_id }) => recharge.v1.discount.remove(discount_id));

// ─── V1: Metafield ───────────────────────────────────────────────────────────

makeTool("v1_metafield_create", "Create a metafield (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.metafield.create(body));

makeTool("v1_metafield_get", "Get a metafield by ID (v1)",
  z.object({ metafield_id: id }),
  ({ metafield_id }) => recharge.v1.metafield.get(metafield_id));

makeTool("v1_metafield_update", "Update a metafield (v1)",
  z.object({ metafield_id: id, body }),
  ({ metafield_id, body }) => recharge.v1.metafield.update(metafield_id, body));

makeTool("v1_metafield_delete", "Delete a metafield (v1)",
  z.object({ metafield_id: id }),
  ({ metafield_id }) => recharge.v1.metafield.delete(metafield_id));

makeTool("v1_metafield_list", "List metafields (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.metafield.list(query));

makeTool("v1_metafield_count", "Count metafields (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.metafield.count(query));

// ─── V1: Notification ────────────────────────────────────────────────────────

makeTool("v1_notification_send", "Send a notification (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.notification.send(body));

// ─── V1: Onetime ─────────────────────────────────────────────────────────────

makeTool("v1_onetime_create", "Create a one-time product (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.onetime.create(body));

makeTool("v1_onetime_get", "Get a one-time product by ID (v1)",
  z.object({ onetime_id: id }),
  ({ onetime_id }) => recharge.v1.onetime.get(onetime_id));

makeTool("v1_onetime_update", "Update a one-time product (v1)",
  z.object({ onetime_id: id, body }),
  ({ onetime_id, body }) => recharge.v1.onetime.update(onetime_id, body));

makeTool("v1_onetime_delete", "Delete a one-time product (v1)",
  z.object({ onetime_id: id }),
  ({ onetime_id }) => recharge.v1.onetime.delete(onetime_id));

makeTool("v1_onetime_list", "List one-time products (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.onetime.list(query));

// ─── V1: Order ───────────────────────────────────────────────────────────────

makeTool("v1_order_get", "Get an order by ID (v1)",
  z.object({ order_id: id }),
  ({ order_id }) => recharge.v1.order.get(order_id));

makeTool("v1_order_update", "Update an order (v1)",
  z.object({ order_id: id, body }),
  ({ order_id, body }) => recharge.v1.order.update(order_id, body));

makeTool("v1_order_delete", "Delete an order (v1)",
  z.object({ order_id: id }),
  ({ order_id }) => recharge.v1.order.delete(order_id));

makeTool("v1_order_list", "List orders (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.order.list(query));

makeTool("v1_order_count", "Count orders (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.order.count(query));

makeTool("v1_order_change_date", "Change the date of an order (v1)",
  z.object({ order_id: id, body }),
  ({ order_id, body }) => recharge.v1.order.change_date(order_id, body));

makeTool("v1_order_change_variant", "Change the variant of an order (v1)",
  z.object({ order_id: id, body }),
  ({ order_id, body }) => recharge.v1.order.change_variant(order_id, body));

makeTool("v1_order_clone", "Clone an order (v1)",
  z.object({ order_id: id, body: body.optional() }),
  ({ order_id, body }) => recharge.v1.order.clone(order_id, body));

makeTool("v1_order_delay", "Delay an order (v1)",
  z.object({ order_id: id }),
  ({ order_id }) => recharge.v1.order.delay(order_id));

// ─── V1: Product ─────────────────────────────────────────────────────────────

makeTool("v1_product_create", "Create a product (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.product.create(body));

makeTool("v1_product_get", "Get a product by ID (v1)",
  z.object({ product_id: id }),
  ({ product_id }) => recharge.v1.product.get(product_id));

makeTool("v1_product_update", "Update a product (v1)",
  z.object({ product_id: id, body }),
  ({ product_id, body }) => recharge.v1.product.update(product_id, body));

makeTool("v1_product_delete", "Delete a product (v1)",
  z.object({ product_id: id }),
  ({ product_id }) => recharge.v1.product.delete(product_id));

makeTool("v1_product_list", "List products (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.product.list(query));

makeTool("v1_product_count", "Count products (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.product.count(query));

// ─── V1: Shop ────────────────────────────────────────────────────────────────

makeTool("v1_shop_get", "Get shop information (v1)",
  z.object({}),
  () => recharge.v1.shop.get());

makeTool("v1_shop_shipping_countries", "Get shipping countries for the shop (v1)",
  z.object({}),
  () => recharge.v1.shop.shipping_countries());

// ─── V1: Subscription ────────────────────────────────────────────────────────

makeTool("v1_subscription_create", "Create a subscription (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.subscription.create(body));

makeTool("v1_subscription_get", "Get a subscription by ID (v1)",
  z.object({ subscription_id: id }),
  ({ subscription_id }) => recharge.v1.subscription.get(subscription_id));

makeTool("v1_subscription_update", "Update a subscription (v1)",
  z.object({ subscription_id: id, body }),
  ({ subscription_id, body }) => recharge.v1.subscription.update(subscription_id, body));

makeTool("v1_subscription_delete", "Delete a subscription (v1)",
  z.object({ subscription_id: id }),
  ({ subscription_id }) => recharge.v1.subscription.delete(subscription_id));

makeTool("v1_subscription_list", "List subscriptions (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.subscription.list(query));

makeTool("v1_subscription_count", "Count subscriptions (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.subscription.count(query));

makeTool("v1_subscription_change_next_charge_date", "Change the next charge date for a subscription (v1)",
  z.object({ subscription_id: id, body }),
  ({ subscription_id, body }) => recharge.v1.subscription.changeNextChargeDate(subscription_id, body));

makeTool("v1_subscription_change_address", "Change the address for a subscription (v1)",
  z.object({ subscription_id: id, body }),
  ({ subscription_id, body }) => recharge.v1.subscription.changeAddress(subscription_id, body));

makeTool("v1_subscription_cancel", "Cancel a subscription (v1)",
  z.object({ subscription_id: id, body: body.optional() }),
  ({ subscription_id, body }) => recharge.v1.subscription.cancel(subscription_id, body));

makeTool("v1_subscription_activate", "Activate a subscription (v1)",
  z.object({ subscription_id: id }),
  ({ subscription_id }) => recharge.v1.subscription.activate(subscription_id));

makeTool("v1_subscription_bulk_create", "Bulk create subscriptions (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.subscription.bulkCreate(body));

makeTool("v1_subscription_bulk_update", "Bulk update subscriptions (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.subscription.bulkUpdate(body));

makeTool("v1_subscription_bulk_delete", "Bulk delete subscriptions (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.subscription.bulkDelete(body));

// ─── V1: Token ───────────────────────────────────────────────────────────────

makeTool("v1_token_information", "Get token information (v1)",
  z.object({}),
  () => recharge.v1.token.token_information());

// ─── V1: Webhook ─────────────────────────────────────────────────────────────

makeTool("v1_webhook_create", "Create a webhook (v1)",
  z.object({ body }),
  ({ body }) => recharge.v1.webhook.create(body));

makeTool("v1_webhook_get", "Get a webhook by ID (v1)",
  z.object({ webhook_id: id }),
  ({ webhook_id }) => recharge.v1.webhook.get(webhook_id));

makeTool("v1_webhook_update", "Update a webhook (v1)",
  z.object({ webhook_id: id, body }),
  ({ webhook_id, body }) => recharge.v1.webhook.update(webhook_id, body));

makeTool("v1_webhook_delete", "Delete a webhook (v1)",
  z.object({ webhook_id: id }),
  ({ webhook_id }) => recharge.v1.webhook.delete(webhook_id));

makeTool("v1_webhook_list", "List webhooks (v1)",
  z.object({ query }),
  ({ query }) => recharge.v1.webhook.list(query));

makeTool("v1_webhook_test", "Send a test webhook (v1)",
  z.object({ body: body.optional() }),
  ({ body }) => recharge.v1.webhook.test(body));

// ─── V2: Account ─────────────────────────────────────────────────────────────

makeTool("v2_account_get", "Get an account by ID (v2)",
  z.object({ account_id: id }),
  ({ account_id }) => recharge.v2.account.get(account_id));

makeTool("v2_account_list", "List accounts (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.account.list(query));

// ─── V2: Address ─────────────────────────────────────────────────────────────

makeTool("v2_address_create", "Create an address (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.address.create(body));

makeTool("v2_address_get", "Get an address by ID (v2)",
  z.object({ address_id: id }),
  ({ address_id }) => recharge.v2.address.get(address_id));

makeTool("v2_address_update", "Update an address (v2)",
  z.object({ address_id: id, body }),
  ({ address_id, body }) => recharge.v2.address.update(address_id, body));

makeTool("v2_address_delete", "Delete an address (v2)",
  z.object({ address_id: id }),
  ({ address_id }) => recharge.v2.address.delete(address_id));

makeTool("v2_address_list", "List addresses (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.address.list(query));

makeTool("v2_address_merge", "Merge addresses (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.address.merge(body));

makeTool("v2_address_skip_future_charge", "Skip a future charge for an address (v2)",
  z.object({ address_id: id, body }),
  ({ address_id, body }) => recharge.v2.address.skipFutureCharge(address_id, body));

// ─── V2: Async Batch ─────────────────────────────────────────────────────────

makeTool("v2_async_batch_create", "Create an async batch (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.asyncBatch.create(body));

makeTool("v2_async_batch_get", "Get an async batch by ID (v2)",
  z.object({ batch_id: id }),
  ({ batch_id }) => recharge.v2.asyncBatch.get(batch_id));

makeTool("v2_async_batch_list", "List async batches (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.asyncBatch.list(query));

makeTool("v2_async_batch_process", "Process an async batch (v2)",
  z.object({ batch_id: id }),
  ({ batch_id }) => recharge.v2.asyncBatch.process(batch_id));

makeTool("v2_async_batch_create_task", "Create a task in an async batch (v2)",
  z.object({ batch_id: id, body }),
  ({ batch_id, body }) => recharge.v2.asyncBatch.createTask(batch_id, body));

makeTool("v2_async_batch_list_tasks", "List tasks in an async batch (v2)",
  z.object({ batch_id: id, query }),
  ({ batch_id, query }) => recharge.v2.asyncBatch.listTasks(batch_id, query));

// ─── V2: Bundle Selection ────────────────────────────────────────────────────

makeTool("v2_bundle_selection_create", "Create a bundle selection (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.bundleSelection.create(body));

makeTool("v2_bundle_selection_get", "Get a bundle selection by ID (v2)",
  z.object({ bundle_selection_id: id }),
  ({ bundle_selection_id }) => recharge.v2.bundleSelection.get(bundle_selection_id));

makeTool("v2_bundle_selection_update", "Update a bundle selection (v2)",
  z.object({ bundle_selection_id: id, body }),
  ({ bundle_selection_id, body }) => recharge.v2.bundleSelection.update(bundle_selection_id, body));

makeTool("v2_bundle_selection_delete", "Delete a bundle selection (v2)",
  z.object({ bundle_selection_id: id }),
  ({ bundle_selection_id }) => recharge.v2.bundleSelection.delete(bundle_selection_id));

makeTool("v2_bundle_selection_list", "List bundle selections (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.bundleSelection.list(query));

// ─── V2: Charge ──────────────────────────────────────────────────────────────

makeTool("v2_charge_get", "Get a charge by ID (v2)",
  z.object({ charge_id: id }),
  ({ charge_id }) => recharge.v2.charge.get(charge_id));

makeTool("v2_charge_list", "List charges (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.charge.list(query));

makeTool("v2_charge_apply_discount", "Apply a discount to a charge (v2)",
  z.object({ charge_id: id, body }),
  ({ charge_id, body }) => recharge.v2.charge.applyDiscount(charge_id, body));

makeTool("v2_charge_remove_discount", "Remove a discount from a charge (v2)",
  z.object({ charge_id: id }),
  ({ charge_id }) => recharge.v2.charge.removeDiscount(charge_id));

makeTool("v2_charge_skip", "Skip a charge (v2)",
  z.object({ charge_id: id, body: body.optional() }),
  ({ charge_id, body }) => recharge.v2.charge.skip(charge_id, body));

makeTool("v2_charge_unskip", "Unskip a charge (v2)",
  z.object({ charge_id: id, body: body.optional() }),
  ({ charge_id, body }) => recharge.v2.charge.unskip(charge_id, body));

makeTool("v2_charge_refund", "Refund a charge (v2)",
  z.object({ charge_id: id, body: body.optional() }),
  ({ charge_id, body }) => recharge.v2.charge.refund(charge_id, body));

makeTool("v2_charge_process", "Process a charge (v2)",
  z.object({ charge_id: id }),
  ({ charge_id }) => recharge.v2.charge.process(charge_id));

makeTool("v2_charge_capture", "Capture a charge (v2)",
  z.object({ charge_id: id }),
  ({ charge_id }) => recharge.v2.charge.capture(charge_id));

makeTool("v2_charge_add_free_gift", "Add a free gift to a charge (v2)",
  z.object({ charge_id: id, body }),
  ({ charge_id, body }) => recharge.v2.charge.addFreeGift(charge_id, body));

makeTool("v2_charge_remove_free_gift", "Remove a free gift from a charge (v2)",
  z.object({ charge_id: id, body }),
  ({ charge_id, body }) => recharge.v2.charge.removeFreeGift(charge_id, body));

// ─── V2: Checkout ────────────────────────────────────────────────────────────

makeTool("v2_checkout_create", "Create a checkout (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.checkout.create(body));

makeTool("v2_checkout_get", "Get a checkout by ID (v2)",
  z.object({ checkout_id: z.string() }),
  ({ checkout_id }) => recharge.v2.checkout.get(checkout_id));

makeTool("v2_checkout_update", "Update a checkout (v2)",
  z.object({ checkout_id: z.string(), body }),
  ({ checkout_id, body }) => recharge.v2.checkout.update(checkout_id, body));

makeTool("v2_checkout_get_shipping_rates", "Get shipping rates for a checkout (v2)",
  z.object({ checkout_id: z.string() }),
  ({ checkout_id }) => recharge.v2.checkout.getShippingRates(checkout_id));

makeTool("v2_checkout_process", "Process a checkout (v2)",
  z.object({ checkout_id: z.string(), body: body.optional() }),
  ({ checkout_id, body }) => recharge.v2.checkout.process(checkout_id, body));

// ─── V2: Collection ──────────────────────────────────────────────────────────

makeTool("v2_collection_create", "Create a collection (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.collection.create(body));

makeTool("v2_collection_get", "Get a collection by ID (v2)",
  z.object({ collection_id: id }),
  ({ collection_id }) => recharge.v2.collection.get(collection_id));

makeTool("v2_collection_update", "Update a collection (v2)",
  z.object({ collection_id: id, body }),
  ({ collection_id, body }) => recharge.v2.collection.update(collection_id, body));

makeTool("v2_collection_delete", "Delete a collection (v2)",
  z.object({ collection_id: id }),
  ({ collection_id }) => recharge.v2.collection.delete(collection_id));

makeTool("v2_collection_list", "List collections (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.collection.list(query));

makeTool("v2_collection_list_products", "List products in a collection (v2)",
  z.object({ collection_id: id, query }),
  ({ collection_id, query }) => recharge.v2.collection.listProducts(collection_id, query));

makeTool("v2_collection_add_products", "Add products to a collection (v2)",
  z.object({ collection_id: id, body }),
  ({ collection_id, body }) => recharge.v2.collection.addProducts(collection_id, body));

makeTool("v2_collection_remove_products", "Remove products from a collection (v2)",
  z.object({ collection_id: id, body }),
  ({ collection_id, body }) => recharge.v2.collection.removeProducts(collection_id, body));

// ─── V2: Credit ──────────────────────────────────────────────────────────────

makeTool("v2_credit_create", "Create a credit account (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.credit.create(body));

makeTool("v2_credit_get", "Get a credit account by ID (v2)",
  z.object({ credit_account_id: id }),
  ({ credit_account_id }) => recharge.v2.credit.get(credit_account_id));

makeTool("v2_credit_update", "Update a credit account (v2)",
  z.object({ credit_account_id: id, body }),
  ({ credit_account_id, body }) => recharge.v2.credit.update(credit_account_id, body));

makeTool("v2_credit_list", "List credit accounts (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.credit.list(query));

makeTool("v2_credit_create_adjustment", "Create a credit adjustment (v2)",
  z.object({ credit_account_id: id, body }),
  ({ credit_account_id, body }) => recharge.v2.credit.createAdjustment(credit_account_id, body));

makeTool("v2_credit_list_adjustments", "List adjustments for a credit account (v2)",
  z.object({ credit_account_id: id, query }),
  ({ credit_account_id, query }) => recharge.v2.credit.listAdjustments(credit_account_id, query));

makeTool("v2_credit_list_all_adjustments", "List all credit adjustments (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.credit.listAllAdjustments(query));

// ─── V2: Customer ────────────────────────────────────────────────────────────

makeTool("v2_customer_create", "Create a customer (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.customer.create(body));

makeTool("v2_customer_get", "Get a customer by ID (v2)",
  z.object({ customer_id: id }),
  ({ customer_id }) => recharge.v2.customer.get(customer_id));

makeTool("v2_customer_update", "Update a customer (v2)",
  z.object({ customer_id: id, body }),
  ({ customer_id, body }) => recharge.v2.customer.update(customer_id, body));

makeTool("v2_customer_delete", "Delete a customer (v2)",
  z.object({ customer_id: id }),
  ({ customer_id }) => recharge.v2.customer.delete(customer_id));

makeTool("v2_customer_list", "List customers (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.customer.list(query));

makeTool("v2_customer_delivery_schedule", "Get delivery schedule for a customer (v2)",
  z.object({ customer_id: id }),
  ({ customer_id }) => recharge.v2.customer.deliverySchedule(customer_id));

makeTool("v2_customer_credit_summary", "Get credit summary for a customer (v2)",
  z.object({ customer_id: id }),
  ({ customer_id }) => recharge.v2.customer.creditSummary(customer_id));

// ─── V2: Discount ────────────────────────────────────────────────────────────

makeTool("v2_discount_create", "Create a discount (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.discount.create(body));

makeTool("v2_discount_get", "Get a discount by ID (v2)",
  z.object({ discount_id: id }),
  ({ discount_id }) => recharge.v2.discount.get(discount_id));

makeTool("v2_discount_update", "Update a discount (v2)",
  z.object({ discount_id: id, body }),
  ({ discount_id, body }) => recharge.v2.discount.update(discount_id, body));

makeTool("v2_discount_delete", "Delete a discount (v2)",
  z.object({ discount_id: id }),
  ({ discount_id }) => recharge.v2.discount.delete(discount_id));

makeTool("v2_discount_list", "List discounts (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.discount.list(query));

// ─── V2: Event ───────────────────────────────────────────────────────────────

makeTool("v2_event_list", "List events (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.event.list(query));

// ─── V2: Metafield ───────────────────────────────────────────────────────────

makeTool("v2_metafield_create", "Create a metafield (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.metafield.create(body));

makeTool("v2_metafield_get", "Get a metafield by ID (v2)",
  z.object({ metafield_id: id }),
  ({ metafield_id }) => recharge.v2.metafield.get(metafield_id));

makeTool("v2_metafield_update", "Update a metafield (v2)",
  z.object({ metafield_id: id, body }),
  ({ metafield_id, body }) => recharge.v2.metafield.update(metafield_id, body));

makeTool("v2_metafield_delete", "Delete a metafield (v2)",
  z.object({ metafield_id: id }),
  ({ metafield_id }) => recharge.v2.metafield.delete(metafield_id));

makeTool("v2_metafield_list", "List metafields (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.metafield.list(query));

// ─── V2: Notification ────────────────────────────────────────────────────────

makeTool("v2_notification_send_email", "Send a notification email (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.notification.sendEmail(body));

// ─── V2: Onetime ─────────────────────────────────────────────────────────────

makeTool("v2_onetime_create", "Create a one-time product (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.onetime.create(body));

makeTool("v2_onetime_get", "Get a one-time product by ID (v2)",
  z.object({ onetime_id: id }),
  ({ onetime_id }) => recharge.v2.onetime.get(onetime_id));

makeTool("v2_onetime_update", "Update a one-time product (v2)",
  z.object({ onetime_id: id, body }),
  ({ onetime_id, body }) => recharge.v2.onetime.update(onetime_id, body));

makeTool("v2_onetime_delete", "Delete a one-time product (v2)",
  z.object({ onetime_id: id }),
  ({ onetime_id }) => recharge.v2.onetime.delete(onetime_id));

makeTool("v2_onetime_list", "List one-time products (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.onetime.list(query));

// ─── V2: Order ───────────────────────────────────────────────────────────────

makeTool("v2_order_get", "Get an order by ID (v2)",
  z.object({ order_id: id }),
  ({ order_id }) => recharge.v2.order.get(order_id));

makeTool("v2_order_update", "Update an order (v2)",
  z.object({ order_id: id, body }),
  ({ order_id, body }) => recharge.v2.order.update(order_id, body));

makeTool("v2_order_delete", "Delete an order (v2)",
  z.object({ order_id: id }),
  ({ order_id }) => recharge.v2.order.delete(order_id));

makeTool("v2_order_list", "List orders (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.order.list(query));

makeTool("v2_order_clone", "Clone an order (v2)",
  z.object({ order_id: id, body: body.optional() }),
  ({ order_id, body }) => recharge.v2.order.clone(order_id, body));

makeTool("v2_order_delay", "Delay an order (v2)",
  z.object({ order_id: id, body: body.optional() }),
  ({ order_id, body }) => recharge.v2.order.delay(order_id, body));

// ─── V2: Payment Method ──────────────────────────────────────────────────────

makeTool("v2_payment_method_create", "Create a payment method (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.paymentMethod.create(body));

makeTool("v2_payment_method_get", "Get a payment method by ID (v2)",
  z.object({ payment_method_id: id }),
  ({ payment_method_id }) => recharge.v2.paymentMethod.get(payment_method_id));

makeTool("v2_payment_method_update", "Update a payment method (v2)",
  z.object({ payment_method_id: id, body }),
  ({ payment_method_id, body }) => recharge.v2.paymentMethod.update(payment_method_id, body));

makeTool("v2_payment_method_delete", "Delete a payment method (v2)",
  z.object({ payment_method_id: id }),
  ({ payment_method_id }) => recharge.v2.paymentMethod.delete(payment_method_id));

makeTool("v2_payment_method_list", "List payment methods (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.paymentMethod.list(query));

// ─── V2: Plan ────────────────────────────────────────────────────────────────

makeTool("v2_plan_create", "Create a plan (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.plan.create(body));

makeTool("v2_plan_update", "Update a plan (v2)",
  z.object({ plan_id: id, body }),
  ({ plan_id, body }) => recharge.v2.plan.update(plan_id, body));

makeTool("v2_plan_delete", "Delete a plan (v2)",
  z.object({ plan_id: id }),
  ({ plan_id }) => recharge.v2.plan.delete(plan_id));

makeTool("v2_plan_list", "List plans (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.plan.list(query));

makeTool("v2_plan_bulk_create", "Bulk create plans (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.plan.bulkCreate(body));

makeTool("v2_plan_bulk_update", "Bulk update plans (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.plan.bulkUpdate(body));

makeTool("v2_plan_bulk_delete", "Bulk delete plans (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.plan.bulkDelete(body));

// ─── V2: Product ─────────────────────────────────────────────────────────────

makeTool("v2_product_create", "Create a product (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.product.create(body));

makeTool("v2_product_get", "Get a product by ID (v2)",
  z.object({ product_id: id }),
  ({ product_id }) => recharge.v2.product.get(product_id));

makeTool("v2_product_update", "Update a product (v2)",
  z.object({ product_id: id, body }),
  ({ product_id, body }) => recharge.v2.product.update(product_id, body));

makeTool("v2_product_delete", "Delete a product (v2)",
  z.object({ product_id: id }),
  ({ product_id }) => recharge.v2.product.delete(product_id));

makeTool("v2_product_list", "List products (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.product.list(query));

// ─── V2: Store ───────────────────────────────────────────────────────────────

makeTool("v2_store_get", "Get store information (v2)",
  z.object({}),
  () => recharge.v2.store.get());

// ─── V2: Subscription ────────────────────────────────────────────────────────

makeTool("v2_subscription_create", "Create a subscription (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.subscription.create(body));

makeTool("v2_subscription_get", "Get a subscription by ID (v2)",
  z.object({ subscription_id: id }),
  ({ subscription_id }) => recharge.v2.subscription.get(subscription_id));

makeTool("v2_subscription_update", "Update a subscription (v2)",
  z.object({ subscription_id: id, body }),
  ({ subscription_id, body }) => recharge.v2.subscription.update(subscription_id, body));

makeTool("v2_subscription_delete", "Delete a subscription (v2)",
  z.object({ subscription_id: id }),
  ({ subscription_id }) => recharge.v2.subscription.delete(subscription_id));

makeTool("v2_subscription_list", "List subscriptions (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.subscription.list(query));

makeTool("v2_subscription_set_next_charge_date", "Set the next charge date for a subscription (v2)",
  z.object({ subscription_id: id, body }),
  ({ subscription_id, body }) => recharge.v2.subscription.setNextChargeDate(subscription_id, body));

makeTool("v2_subscription_change_address", "Change the address for a subscription (v2)",
  z.object({ subscription_id: id, body }),
  ({ subscription_id, body }) => recharge.v2.subscription.changeAddress(subscription_id, body));

makeTool("v2_subscription_cancel", "Cancel a subscription (v2)",
  z.object({ subscription_id: id, body: body.optional() }),
  ({ subscription_id, body }) => recharge.v2.subscription.cancel(subscription_id, body));

makeTool("v2_subscription_activate", "Activate a subscription (v2)",
  z.object({ subscription_id: id }),
  ({ subscription_id }) => recharge.v2.subscription.activate(subscription_id));

// ─── V2: Token ───────────────────────────────────────────────────────────────

makeTool("v2_token_get", "Get token information (v2)",
  z.object({}),
  () => recharge.v2.token.get());

// ─── V2: Webhook ─────────────────────────────────────────────────────────────

makeTool("v2_webhook_create", "Create a webhook (v2)",
  z.object({ body }),
  ({ body }) => recharge.v2.webhook.create(body));

makeTool("v2_webhook_get", "Get a webhook by ID (v2)",
  z.object({ webhook_id: id }),
  ({ webhook_id }) => recharge.v2.webhook.get(webhook_id));

makeTool("v2_webhook_update", "Update a webhook (v2)",
  z.object({ webhook_id: id, body }),
  ({ webhook_id, body }) => recharge.v2.webhook.update(webhook_id, body));

makeTool("v2_webhook_delete", "Delete a webhook (v2)",
  z.object({ webhook_id: id }),
  ({ webhook_id }) => recharge.v2.webhook.delete(webhook_id));

makeTool("v2_webhook_list", "List webhooks (v2)",
  z.object({ query }),
  ({ query }) => recharge.v2.webhook.list(query));

makeTool("v2_webhook_test", "Send a test webhook (v2)",
  z.object({ webhook_id: id, body: body.optional() }),
  ({ webhook_id, body }) => recharge.v2.webhook.test(webhook_id, body));

// ─── Start ───────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
