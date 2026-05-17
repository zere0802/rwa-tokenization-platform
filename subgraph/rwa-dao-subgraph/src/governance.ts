import {
  ProposalCreated as ProposalCreatedEvent,
  VoteCast as VoteCastEvent
} from "../generated/Governance/Governance"

import {
  Proposal,
  Vote
} from "../generated/schema"

export function handleProposalCreated(
  event: ProposalCreatedEvent
): void {

  let entity = new Proposal(
    event.params.proposalId.toString()
  )

  entity.proposalId = event.params.proposalId
  entity.proposer = event.params.proposer
  entity.description = event.params.description
  entity.startBlock = event.params.voteStart
  entity.endBlock = event.params.voteEnd

  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp

  entity.save()
}

export function handleVoteCast(
  event: VoteCastEvent
): void {

  let id =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString()

  let entity = new Vote(id)

  entity.voter = event.params.voter
  entity.proposalId = event.params.proposalId
  entity.support = event.params.support
  entity.weight = event.params.weight
  entity.reason = event.params.reason

  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp

  entity.save()
}