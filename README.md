<div align="center">
    <p align="center">
      <img src="./image/logoImage/twitter_header_photo_2.png" alt="Three Rang Logo" />
    </p>
</div>

<div align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white)
![Nodejs](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)
![Web3js](https://img.shields.io/badge/Web3.js-F16822?style=flat-square&logo=Web3.js&logoColor=white)
![Mongodb](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=flat-square&logo=Solidity&logoColor=white)

</div>

# BTS

**Blockchain nfTicket Service**

---

## Content

- [0. Overview](#overview)
- [1. Quick start](#quick-start)
- [2. Preview](#preview)
- [3. Future Roadmap](#future-roadmap)
- [4. References](#references)

---

## Overview

- A blockchain based platform for concert ticket booking between trustless parties.
- This will help to eliminate the current issue with the fake tickets and uncontrolled resale price for the tickets in black market.
- The platform is build on public Ethereum blockchain network where ERC721 tokens represent concert tickets.

- Features

  - Ticket is NFT(Non fungible token) based ERC721.
  - All transaction is conducted by Smart Contract.
  - A wallet is authorized by blockchain.
  - All transaction is stored on blockchain.

- Architecture
  ![image](https://user-images.githubusercontent.com/48934522/193894308-089e98b4-c033-49bd-990a-c72583fd172e.png)

---

## Quick start

### 1. Clone & Install Packages

```bash
git clone https://github.com/ThreeRang/BTS.git
npm install
cd ./client
npm install
```

### 2. Prerequirement

- antd dependency

  ```bash
  # client/node_modules/antd-v3/es/tree/DirectoryTree.js
  rc-tree/es/util => rc-tree-v3/es/util
  # client/node_modules/antd-v3/es/tree/util.js
  rc-tree/es/util" => rc-tree-v3/es/util
  ```

- Smart contract

  ```bash
    cd truffle
    truffle migrate --reset
  ```

  - Move `MintTicketToken.json` and `PurchaseTicketToken.json` to `/client/src/contracts` directory.
  - Create `/client/src/smartContractConfig.js` file, and write **contract address**.

- IPFS Desktop
  - IPFS Desktop must be installed.

### 3. Run

```bash
npm run dev
```

---

## Preview

### Demo

<https://drive.google.com/file/d/1BrO0DOcbtY_XX3pCH2fC7Ny7SAvolGqc/view?usp=sharing>

---

## Future roadmap

---

## References

### Team Members

- [![title](https://img.shields.io/badge/DEVLOPER-Song-123456)](https://github.com/songjaesong)
- [![title](https://img.shields.io/badge/DEVLOPER-Kwon-123456)](https://github.com/2ternal)
- [![title](https://img.shields.io/badge/DEVLOPER-Park-123456)](https://github.com/https://github.com/koreandrum97)

### Commit rule & Code convention

<https://github.com/ThreeRang/BTS/wiki/Convention>

### Structure

```bash
|-- client // Frontend
    |-- src
        |-- components
|-- server // Backend
    |-- middleware // Authroization
    |-- models // DB schemas
    |-- routes // Router
|-- truffle // Blockchain
    |-- contracts // smart contract(solidity files)
```
