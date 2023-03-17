# output

```
npm run start:token-service

> exercise-2@1.0.0 start:token-service
> node src/token-service

Created NFT with Token ID: 0.0.3843264 

┌─────────────────────────┬────────┬────────┬────────┬──────────┬─────────────────┬───────────┬────────────────────────┬─────────────────────────┬──────────────────────┬─────────┬─────┬──────┬──────────┬────────┐
│         (index)         │ shard  │ realm  │  num   │ aliasKey │ aliasEvmAddress │ _checksum │ _feeCollectorAccountId │ _allCollectorsAreExempt │ _denominatingTokenId │ _amount │ low │ high │ unsigned │ Values │
├─────────────────────────┼────────┼────────┼────────┼──────────┼─────────────────┼───────────┼────────────────────────┼─────────────────────────┼──────────────────────┼─────────┼─────┼──────┼──────────┼────────┤
│ _feeCollectorAccountId  │ [Long] │ [Long] │ [Long] │   null   │      null       │   null    │                        │                         │                      │         │     │      │          │        │
│ _allCollectorsAreExempt │        │        │        │          │                 │           │                        │                         │                      │         │     │      │          │ false  │
│      _fallbackFee       │        │        │        │          │                 │           │          null          │          false          │         null         │ [Long]  │     │      │          │        │
│       _numerator        │        │        │        │          │                 │           │                        │                         │                      │         │  1  │  0   │  false   │        │
│      _denominator       │        │        │        │          │                 │           │                        │                         │                      │         │ 10  │  0   │  false   │        │
└─────────────────────────┴────────┴────────┴────────┴──────────┴─────────────────┴───────────┴────────────────────────┴─────────────────────────┴──────────────────────┴─────────┴─────┴──────┴──────────┴────────┘
Created NFT 0.0.3843264 with serial: 1
Created NFT 0.0.3843264 with serial: 2
Created NFT 0.0.3843264 with serial: 3
Created NFT 0.0.3843264 with serial: 4
Created NFT 0.0.3843264 with serial: 5
account1 NFT Auto-Association: SUCCESS 

- Treasury balance: 5 NFTs of ID:0.0.3843264 and 1277.32626586 ℏ
- account1 balance: undefined NFTs of ID:0.0.3843264 and 2000 ℏ

 NFT transfer Treasury->account1 status: SUCCESS 

- Treasury balance: 4 NFTs of ID:0.0.3843264 and 1277.31037307 ℏ
- account1 balance: 1 NFTs of ID:0.0.3843264 and 2000 ℏ
```
