# BTS
## mean : Blockchain nfTicket Service

## Commit rule & Code convention
<a>https://github.com/ThreeRang/BTS/wiki/Convention</a>

## Required Settings
### Install
- node -v : 16.13.0
- python --version : <= 3.9 (for gyp module)
- visual studio 2015 or 2017 : Desktop development with C++ (for gyp module) 

### Need to change
- `client/node_modules/antd-v3/es/tree/DirectoryTree.js`
  - "rc-tree/es/util" => "rc-tree-v3/es/util"
- `client/node_modules/antd-v3/es/tree/util.js`
  - "rc-tree/es/util" => "rc-tree-v3/es/util"
- Do first!

```bash
cd truffle
truffle migrate --reset
```
  - Then, move `MintTicketToken.json` and `PurchaseTicketToken.json` to `src` directory.
  - Create `src/smartContractConfig.js` file, and write __contract address__ and __privateKey__.
