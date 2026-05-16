# GraphQL Queries

## 1. Get All Proposals

```graphql
{
  proposals(first: 10) {
    proposalId
    proposer
    description
    startBlock
    endBlock
  }
}
```

 
## 2. Get All Votes

```graphql
{
  votes(first: 10) {
    voter
    proposalId
    support
    weight
    reason
  }
}
```

 
## 3. Get Proposal By ID

```graphql
{
  proposal(id: "1") {
    proposalId
    description
    proposer
  }
}
```

 
## 4. Get Votes For Proposal

```graphql
{
  votes(where: { proposalId: "1" }) {
    voter
    support
    weight
  }
}
```

 
## 5. Get Recent Governance Activity

```graphql
{
  proposals(orderBy: timestamp, orderDirection: desc) {
    proposalId
    description
  }

  votes(orderBy: timestamp, orderDirection: desc) {
    voter
    proposalId
  }
}
```