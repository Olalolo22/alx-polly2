import { createPoll } from '../actions'
import { createServerSupabaseClient } from '../supabase-server'
import { redirect, revalidatePath } from 'next/navigation'

// Mock the modules
jest.mock('../supabase-server')
jest.mock('next/navigation')
jest.mock('next/cache')

describe('createPoll Server Action', () => {
  let mockSupabase: any

  beforeEach(() => {
    jest.clearAllMocks()
    
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
      })),
    }
    
    ;(createServerSupabaseClient as jest.Mock).mockReturnValue(mockSupabase)
    ;(redirect as jest.Mock).mockImplementation(() => {
      throw new Error('REDIRECT')
    })
    ;(revalidatePath as jest.Mock).mockImplementation(() => {})
  })

  describe('Unit Tests', () => {
    describe('Happy Path', () => {
      it('should create a poll with all required fields successfully', async () => {
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
        formData.append('title', 'What is your favorite color?')
        formData.append('description', 'Choose your preferred color')
        formData.append('options', 'Red')
        formData.append('options', 'Blue')
        formData.append('options', 'Green')

        await expect(createPoll(formData)).rejects.toThrow('REDIRECT')
        
        // Verify poll creation
        expect(mockSupabase.from).toHaveBeenCalledWith('polls')
        expect(mockSupabase.from().insert).toHaveBeenCalledWith({
          title: 'What is your favorite color?',
          description: 'Choose your preferred color',
          is_public: true,
          creator_id: 'user-123'
        })
        
        // Verify options creation
        expect(mockSupabase.from).toHaveBeenCalledWith('poll_options')
        expect(mockSupabase.from().insert).toHaveBeenCalledWith([
          { poll_id: 'poll-123', option_text: 'Red', position: 0 },
          { poll_id: 'poll-123', option_text: 'Blue', position: 1 },
          { poll_id: 'poll-123', option_text: 'Green', position: 2 }
        ])
        
        // Verify cache invalidation and redirect
        expect(revalidatePath).toHaveBeenCalledWith('/polls')
        expect(redirect).toHaveBeenCalledWith('/polls?created=1')
      })

      it('should create a poll with minimal required fields', async () => {
        const mockUser = { id: 'user-456' }
        const mockPoll = { id: 'poll-456' }
        
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
        formData.append('title', 'Simple Question')
        formData.append('options', 'Yes')
        formData.append('options', 'No')

        await expect(createPoll(formData)).rejects.toThrow('REDIRECT')
        
        expect(mockSupabase.from().insert).toHaveBeenCalledWith({
          title: 'Simple Question',
          description: '',
          is_public: true,
          creator_id: 'user-456'
        })
      })
    })

    describe('Edge Cases', () => {
      it('should handle poll with is_public set to false', async () => {
        const mockUser = { id: 'user-789' }
        const mockPoll = { id: 'poll-789' }
        
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
        formData.append('title', 'Private Poll')
        formData.append('is_public', 'off')
        formData.append('options', 'Option 1')
        formData.append('options', 'Option 2')

        await expect(createPoll(formData)).rejects.toThrow('REDIRECT')
        
        expect(mockSupabase.from().insert).toHaveBeenCalledWith({
          title: 'Private Poll',
          description: '',
          is_public: false,
          creator_id: 'user-789'
        })
      })

      it('should filter out empty options', async () => {
        const mockUser = { id: 'user-filter' }
        const mockPoll = { id: 'poll-filter' }
        
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
        formData.append('title', 'Filter Test')
        formData.append('options', 'Valid Option 1')
        formData.append('options', '')
        formData.append('options', '   ')
        formData.append('options', 'Valid Option 2')

        await expect(createPoll(formData)).rejects.toThrow('REDIRECT')
        
        expect(mockSupabase.from().insert).toHaveBeenCalledWith([
          { poll_id: 'poll-filter', option_text: 'Valid Option 1', position: 0 },
          { poll_id: 'poll-filter', option_text: 'Valid Option 2', position: 1 }
        ])
      })

      it('should trim whitespace from title and description', async () => {
        const mockUser = { id: 'user-trim' }
        const mockPoll = { id: 'poll-trim' }
        
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
        formData.append('title', '  Trimmed Title  ')
        formData.append('description', '  Trimmed Description  ')
        formData.append('options', 'Option 1')
        formData.append('options', 'Option 2')

        await expect(createPoll(formData)).rejects.toThrow('REDIRECT')
        
        expect(mockSupabase.from().insert).toHaveBeenCalledWith({
          title: 'Trimmed Title',
          description: 'Trimmed Description',
          is_public: true,
          creator_id: 'user-trim'
        })
      })
    })

    describe('Failure Cases', () => {
      it('should throw error when user is not authenticated', async () => {
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

      it('should throw error when title is missing', async () => {
        const formData = new FormData()
        formData.append('options', 'Option 1')
        formData.append('options', 'Option 2')

        await expect(createPoll(formData)).rejects.toThrow('Title is required')
      })

      it('should throw error when title is empty after trimming', async () => {
        const formData = new FormData()
        formData.append('title', '   ')
        formData.append('options', 'Option 1')
        formData.append('options', 'Option 2')

        await expect(createPoll(formData)).rejects.toThrow('Title is required')
      })

      it('should throw error when less than 2 valid options provided', async () => {
        const formData = new FormData()
        formData.append('title', 'Test Poll')
        formData.append('options', 'Option 1')

        await expect(createPoll(formData)).rejects.toThrow('At least two options are required')
      })

      it('should throw error when all options are empty after filtering', async () => {
        const formData = new FormData()
        formData.append('title', 'Test Poll')
        formData.append('options', '')
        formData.append('options', '   ')

        await expect(createPoll(formData)).rejects.toThrow('At least two options are required')
      })

      it('should throw error when poll creation fails', async () => {
        const mockUser = { id: 'user-error' }
        
        mockSupabase.auth.getUser.mockResolvedValue({
          data: { user: mockUser },
          error: null,
        })
        
        mockSupabase.from().insert().select().single.mockResolvedValue({
          data: null,
          error: new Error('Database error'),
        })

        const formData = new FormData()
        formData.append('title', 'Test Poll')
        formData.append('options', 'Option 1')
        formData.append('options', 'Option 2')

        await expect(createPoll(formData)).rejects.toThrow('Database error')
      })

      it('should throw error when options creation fails', async () => {
        const mockUser = { id: 'user-error' }
        const mockPoll = { id: 'poll-error' }
        
        mockSupabase.auth.getUser.mockResolvedValue({
          data: { user: mockUser },
          error: null,
        })
        
        mockSupabase.from().insert().select().single.mockResolvedValue({
          data: mockPoll,
          error: null,
        })
        
        mockSupabase.from().insert.mockResolvedValue({
          error: new Error('Options creation failed'),
        })

        const formData = new FormData()
        formData.append('title', 'Test Poll')
        formData.append('options', 'Option 1')
        formData.append('options', 'Option 2')

        await expect(createPoll(formData)).rejects.toThrow('Options creation failed')
      })
    })
  })

  describe('Integration Test', () => {
    it('should handle complete poll creation flow with real-world data', async () => {
      const mockUser = { id: 'user-integration' }
      const mockPoll = { id: 'poll-integration' }
      
      // Mock authentication
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      
      // Mock poll creation
      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: mockPoll,
        error: null,
      })
      
      // Mock options creation
      mockSupabase.from().insert.mockResolvedValue({
        error: null,
      })

      // Simulate form submission with realistic data
      const formData = new FormData()
      formData.append('title', 'What is the best programming language for web development in 2024?')
      formData.append('description', 'Please consider factors like performance, ecosystem, learning curve, and job market demand.')
      formData.append('is_public', 'on')
      formData.append('options', 'JavaScript/TypeScript')
      formData.append('options', 'Python')
      formData.append('options', 'Rust')
      formData.append('options', 'Go')
      formData.append('options', 'Java')
      formData.append('options', 'C#')

      await expect(createPoll(formData)).rejects.toThrow('REDIRECT')
      
      // Verify the complete flow
      expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1)
      
      // Verify poll creation with all fields
      expect(mockSupabase.from).toHaveBeenCalledWith('polls')
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        title: 'What is the best programming language for web development in 2024?',
        description: 'Please consider factors like performance, ecosystem, learning curve, and job market demand.',
        is_public: true,
        creator_id: 'user-integration'
      })
      
      // Verify options creation with correct positioning
      expect(mockSupabase.from).toHaveBeenCalledWith('poll_options')
      expect(mockSupabase.from().insert).toHaveBeenCalledWith([
        { poll_id: 'poll-integration', option_text: 'JavaScript/TypeScript', position: 0 },
        { poll_id: 'poll-integration', option_text: 'Python', position: 1 },
        { poll_id: 'poll-integration', option_text: 'Rust', position: 2 },
        { poll_id: 'poll-integration', option_text: 'Go', position: 3 },
        { poll_id: 'poll-integration', option_text: 'Java', position: 4 },
        { poll_id: 'poll-integration', option_text: 'C#', position: 5 }
      ])
      
      // Verify cache invalidation and redirect
      expect(revalidatePath).toHaveBeenCalledWith('/polls')
      expect(redirect).toHaveBeenCalledWith('/polls?created=1')
    })
  })
})
