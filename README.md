# BTS
## mean : Blockchain nfTicket Service

## Commit rule & Code convention
<a>https://github.com/ThreeRang/BTS/wiki/Convention</a>

## Required Settings
- node -v : 16.13.0
- Need to change
  - 'client/node_modules/antd-v3/es/tree/DirectoryTree.js'
    - "rc-tree/es/util" => "rc-tree-v3/es/util"
  - 'client/node_modules/antd-v3/es/tree/util.js'
    - "rc-tree/es/util" => "rc-tree-v3/es/util"
- Do first!

```bash
cd truffle
truffle migrate --reset
```
  - Then, move MintTicketToken.json and PurchaseTicketToken.json to src directory.
  - Update src/smartContractConfig.js file's contract address and privateKey.
