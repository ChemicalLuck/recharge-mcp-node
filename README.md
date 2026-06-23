# Recharge MCP Server

An MCP (Model Context Protocol) server for the [Recharge](https://rechargepayments.com/) subscription commerce API. Exposes both v1 and v2 Recharge endpoints as MCP tools, so Claude Desktop (or any MCP client) can manage addresses, customers, subscriptions, charges, discounts, and more directly from chat.

Built on [`@chemicalluck/recharge-api-node`](https://www.npmjs.com/package/@chemicalluck/recharge-api-node).

## Installation

### As a Claude Desktop Extension

This repo ships as a packaged `.mcpb` bundle:

1. Download `recharge-mcp-node.mcpb` from this repo.
2. In Claude Desktop, go to **Settings → Extensions → Install from file**.
3. Provide your Recharge API access token when prompted.

### Manual / Development

```bash
git clone https://github.com/ChemicalLuck/recharge-mcp-node.git
cd recharge-mcp-node
npm install
```

Set your access token as an environment variable:

```bash
export RECHARGE_ACCESS_TOKEN=your_token_here
```

Run the server directly:

```bash
node server/index.js
```

Or add it to your MCP client config, e.g. Claude Desktop's `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "recharge": {
      "command": "node",
      "args": ["/path/to/recharge-mcp-node/server/index.js"],
      "env": {
        "RECHARGE_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Resources Available

Tools are namespaced by API version, e.g. `v1_address_get`, `v2_subscription_list`. Each resource generally supports create, get, update, delete, list, and count operations where the underlying Recharge API supports them.

### v1

- Address
- Async Batch
- Charge
- Checkout
- Customer
- Discount
- Metafield
- Notification
- Onetime
- Order
- Product
- Shop
- Subscription
- Token
- Webhook

### v2

- Account
- Address
- Async Batch
- Bundle Selection
- Charge
- Checkout
- Collection
- Credit
- Customer
- Discount
- Event
- Metafield
- Notification
- Onetime
- Order
- Payment Method
- Plan
- Product
- Store
- Subscription
- Token
- Webhook

For full parameter details, see the [official Recharge API docs](https://developer.rechargepayments.com/).

## Building

The `.mcpb` bundle is produced with:

```bash
npm run build
```

## License

MIT
