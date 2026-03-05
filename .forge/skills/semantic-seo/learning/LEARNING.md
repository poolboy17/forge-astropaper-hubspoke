# Learning Log — SemanticPipe
# File: learning/log.jsonl (one JSON per line, append-only)

## Schema A: Evaluation
```json
{"type":"evaluation","slug":"...","site":"...","date":"YYYY-MM-DD","grade":"C","dimensions":{"entities":3,"temporal":2,"sources":2,"breadth":4,"data":2,"aeo":3,"linking":3,"hedging":1},"total":20,"topActions":["..."],"changed":true,"wordsBefore":1078,"wordsAfter":1450}
```

## Schema B: New Article
```json
{"type":"new-article","slug":"...","site":"...","date":"YYYY-MM-DD","wordCount":1500,"grade":"B","dimensions":{...},"brief":"filename.json"}
```

## Schema C: Batch Fix
```json
{"type":"batch-fix","site":"...","date":"YYYY-MM-DD","fixType":"banned-phrases","articlesFixed":247}
```
