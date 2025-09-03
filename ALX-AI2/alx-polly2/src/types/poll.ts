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
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  allowMultipleVotes: boolean
  showResultsImmediately: boolean
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
