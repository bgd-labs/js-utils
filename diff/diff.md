```diff
 | Label                   | Offset | Slot | Type                            | Bytes |
 |-------------------------|--------|------|---------------------------------|-------||
 | lastInitializedRevision | 0      | 0    | uint256                         | 32    |
 | initializing            | 0      | 1    | bool                            | 1     |
 | ______gap               | 0      | 2    | uint256[50]                     | 1600  |
 | _addressesProvider      | 0      | 52   | contract IPoolAddressesProvider | 20    |
 | _pool                   | 0      | 53   | contract IPool                  | 20    |
+| _pendingLtv             | 0      | 54   | mapping(address => uint256)     | 32    |
+| _isPendingLtvSet        | 0      | 55   | mapping(address => bool)        | 32    |
```