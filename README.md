# Cron-Parser-Expression

A cron expression is a string conforming to a pre-defined format that tell a computer program how often a task needs to run.

## Installation

```bash
Steps ->
1. unzip
2. Go to folder path
3. yarn
```

## Execution

Example - 
```bash
yarn start '*/15 2-2 30 2 * user/bin/test'
or
node main '*/15 2-2 30 2 * user/bin/test'
```

## Test
Example - 
```bash
yarn test
```
## Definition

considering the standard cron format with five time fields (minute, hour, day of
month, month, and day of week) plus a command.

## Above Cron parser handles 
'*'	any value 

'-'	range of values

'/'	step values

'[0-9]' exact values

','	value list separator

Also handles combination of range, step and value list separator