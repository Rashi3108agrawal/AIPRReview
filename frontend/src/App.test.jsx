import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { reviewsAPI } from './services/api'

vi.mock('./services/api', () => ({
  reviewsAPI: {
    getStats: vi.fn(),
    getRecent: vi.fn(),
  },
}))

const review = {
  id: 1,
  prNumber: 42,
  prTitle: 'Fix authentication bug',
  repositoryOwner: 'northstar',
  repositoryName: 'backend',
  status: 'COMPLETED',
  qualityScore: 8.5,
  analysisSummary: 'The session should be invalidated when the user signs out.',
  issues: [{ severity: 'HIGH', title: 'Session token persists', description: 'The token remains valid after logout.', suggestion: 'Revoke the token before returning a successful logout response.', filePath: 'AuthService.java', lineNumber: 84 }],
  createdAt: new Date().toISOString(),
}

describe('App', () => {
  beforeEach(() => {
    reviewsAPI.getStats.mockResolvedValue({
      totalReviews: 1,
      activePRs: 0,
      avgQualityScore: 8.5,
      issuesFound: 1,
      highIssues: 1,
    })
    reviewsAPI.getRecent.mockResolvedValue([review])
  })

  it('loads dashboard data, filters reviews, and opens review details', async () => {
    render(<App />)

    expect(await screen.findByText(/Fix authentication bug/)).toBeInTheDocument()
    fireEvent.change(screen.getByPlaceholderText('Search queue'), { target: { value: 'missing' } })
    expect(screen.getByText('No reviews match your search.')).toBeInTheDocument()
    fireEvent.change(screen.getByPlaceholderText('Search queue'), { target: { value: 'authentication' } })
    fireEvent.click(screen.getByText(/Fix authentication bug/))

    expect(screen.getByText('Review findings')).toBeInTheDocument()
    expect(screen.getByText('Session token persists')).toBeInTheDocument()
    expect(screen.getByText('Review summary')).toBeInTheDocument()
    expect(screen.getByText('Suggested improvement')).toBeInTheDocument()
    expect(screen.getByText('Review timeline')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Close details'))
    fireEvent.click(screen.getByLabelText('Toggle menu'))
    fireEvent.click(screen.getByLabelText('Refresh dashboard'))
    await waitFor(() => expect(reviewsAPI.getStats).toHaveBeenCalledTimes(2))
  })

  it('shows an API error without substituting demo data when the backend is unavailable', async () => {
    reviewsAPI.getStats.mockRejectedValue(new Error('offline'))
    reviewsAPI.getRecent.mockRejectedValue(new Error('offline'))

    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load dashboard data: offline')
    expect(screen.getByText('Backend unavailable')).toBeInTheDocument()
    expect(screen.getByText('No live reviews are available while the backend is disconnected.')).toBeInTheDocument()
    expect(screen.queryByText('247')).not.toBeInTheDocument()
  })
})
