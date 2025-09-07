import { createPoll, deletePoll, updatePoll, submitVote } from '../actions'
import { createServerSupabaseClient } from '../supabase-server'
import { redirect, revalidatePath } from 'next/navigation'

// Mock the modules
jest.mock('../supabase-server')
jest.mock('next/navigation')
jest.mock('next/cache')

describe('Server Actions', () => {
  let mockSupabase: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Create a fresh mock for each test
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(),
        })),
      })),
    }
    
    ;(createServerSupabaseClient as jest.Mock).mockReturnValue(mockSupabase)
    ;(redirect as jest.Mock).mockImplementation(() => {
      throw new Error('REDIRECT')
    })
    ;(revalidatePath as jest.Mock).mockImplementation(() => {})
  })

  describe('createPoll', () => {
    it('should create a poll successfully', async () => {
      const mockUser = { id: 'user-123' }
      const mockPoll = { id: 'poll-123' }
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      
      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: mockPoll,
        error: null,
      })
      
      mockSupabase.from().insert.mockResolvedValue({
        error: null,
      })

      const formData = new FormData()
      formData.append('title', 'Test Poll')
      formData.append('description', 'Test Description')
      formData.append('options', 'Option 1')
      formData.append('options', 'Option 2')

      await expect(createPoll(formData)).rejects.toThrow('REDIRECT')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('polls')
      expect(mockSupabase.from).toHaveBeenCalledWith('poll_options')
      expect(revalidatePath).toHaveBeenCalledWith('/polls')
      expect(redirect).toHaveBeenCalledWith('/polls?created=1')
    })

    it('should throw error if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const formData = new FormData()
      formData.append('title', 'Test Poll')
      formData.append('options', 'Option 1')
      formData.append('options', 'Option 2')

      await expect(createPoll(formData)).rejects.toThrow('You must be signed in to create a poll')
    })

    it('should throw error if title is missing', async () => {
      const formData = new FormData()
      formData.append('options', 'Option 1')
      formData.append('options', 'Option 2')

      await expect(createPoll(formData)).rejects.toThrow('Title is required')
    })

    it('should throw error if less than 2 options provided', async () => {
      const formData = new FormData()
      formData.append('title', 'Test Poll')
      formData.append('options', 'Option 1')

      await expect(createPoll(formData)).rejects.toThrow('At least two options are required')
    })
  })

  describe('deletePoll', () => {
    it('should delete a poll successfully', async () => {
      const mockUser = { id: 'user-123' }
      const mockPoll = { id: 'poll-123', creator_id: 'user-123' }
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockPoll,
        error: null,
      })
      
      mockSupabase.from().delete().eq.mockResolvedValue({
        error: null,
      })

      const formData = new FormData()
      formData.append('poll_id', 'poll-123')

      await expect(deletePoll(formData)).rejects.toThrow('REDIRECT')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('polls')
      expect(revalidatePath).toHaveBeenCalledWith('/polls')
      expect(redirect).toHaveBeenCalledWith('/polls?deleted=1')
    })

    it('should throw error if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const formData = new FormData()
      formData.append('poll_id', 'poll-123')

      await expect(deletePoll(formData)).rejects.toThrow('Not authenticated')
    })

    it('should throw error if user is not the creator', async () => {
      const mockUser = { id: 'user-123' }
      const mockPoll = { id: 'poll-123', creator_id: 'other-user' }
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockPoll,
        error: null,
      })

      const formData = new FormData()
      formData.append('poll_id', 'poll-123')

      await expect(deletePoll(formData)).rejects.toThrow('Forbidden')
    })
  })

  describe('updatePoll', () => {
    it('should update a poll successfully', async () => {
      const mockUser = { id: 'user-123' }
      const mockPoll = { id: 'poll-123', creator_id: 'user-123' }
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockPoll,
        error: null,
      })
      
      mockSupabase.from().update().eq.mockResolvedValue({
        error: null,
      })

      const formData = new FormData()
      formData.append('poll_id', 'poll-123')
      formData.append('title', 'Updated Title')
      formData.append('description', 'Updated Description')

      await expect(updatePoll(formData)).rejects.toThrow('REDIRECT')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('polls')
      expect(revalidatePath).toHaveBeenCalledWith('/polls')
      expect(redirect).toHaveBeenCalledWith('/polls?updated=1')
    })

    it('should throw error if title is missing', async () => {
      const formData = new FormData()
      formData.append('poll_id', 'poll-123')

      await expect(updatePoll(formData)).rejects.toThrow('Title is required')
    })

    it('should throw error if user is not the creator', async () => {
      const mockUser = { id: 'user-123' }
      const mockPoll = { id: 'poll-123', creator_id: 'other-user' }
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockPoll,
        error: null,
      })

      const formData = new FormData()
      formData.append('poll_id', 'poll-123')
      formData.append('title', 'Updated Title')

      await expect(updatePoll(formData)).rejects.toThrow('Forbidden')
    })
  })

  describe('submitVote', () => {
    it('should submit a vote successfully', async () => {
      const mockUser = { id: 'user-123' }
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      
      mockSupabase.from().insert.mockResolvedValue({
        error: null,
      })

      const formData = new FormData()
      formData.append('poll_id', 'poll-123')
      formData.append('option_id', 'option-123')

      await expect(submitVote(formData)).rejects.toThrow('REDIRECT')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('votes')
      expect(revalidatePath).toHaveBeenCalledWith('/polls/poll-123')
      expect(redirect).toHaveBeenCalledWith('/polls/poll-123?voted=1&votedOption=option-123')
    })

    it('should redirect to login if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const formData = new FormData()
      formData.append('poll_id', 'poll-123')
      formData.append('option_id', 'option-123')

      await expect(submitVote(formData)).rejects.toThrow('REDIRECT')
      expect(redirect).toHaveBeenCalledWith('/auth/login?next=/polls/poll-123')
    })

    it('should throw error if poll_id or option_id is missing', async () => {
      const formData = new FormData()
      formData.append('poll_id', 'poll-123')

      await expect(submitVote(formData)).rejects.toThrow('poll_id and option_id are required')
    })
  })
})
