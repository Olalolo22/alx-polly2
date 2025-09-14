export interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

export interface Poll {
  id: string
  title: string
  description: string
  options: PollOption[]
  totalVotes: number
  createdAt: string
  author: string
  isActive: boolean
  allowMultipleVotes?: boolean
  showResultsImmediately?: boolean
  expirationDate?: string
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  allowMultipleVotes: boolean
  showResultsImmediately: boolean
  expirationDate?: string
}

export interface VoteData {
  pollId: string
  optionIds: string[]
}

export interface EditPollForm {
  id: string
  title: string
  description?: string
  creator_id: string
}

export interface PollFromDB {
  id: string
  title: string
  description: string | null
  creator_id: string
  created_at: string
}

export interface PollWithVotes extends PollFromDB {
  totalVotes: number
  isOwner: boolean
}