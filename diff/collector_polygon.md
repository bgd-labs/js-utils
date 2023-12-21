```diff
 | Label                   | Offset | Slot | Type                                         | Bytes |
 |-------------------------|--------|------|----------------------------------------------|-------||
 | lastInitializedRevision | 0      | 0    | uint256                                      | 32    |
-| initializing            | 0      | 1    | bool                                         | 1     |
+| ______gap               | 0      | 1    | uint256[50]                                  | 1600  |
-| ______gap               | 0      | 2    | uint256[50]                                  | 1600  |
+| _status                 | 0      | 51   | uint256                                      | 32    |
 | _fundsAdmin             | 0      | 52   | address                                      | 20    |
+| _nextStreamId           | 0      | 53   | uint256                                      | 32    |
+| _streams                | 0      | 54   | mapping(uint256 => struct ICollector.Stream) | 32    |
```