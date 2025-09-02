import { Poll } from "@/types/poll"

interface PollResultsProps {
  poll: Poll
}

export default function PollResults({ poll }: PollResultsProps) {
  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <div className="text-3xl font-bold text-blue-600">{poll.totalVotes}</div>
        <div className="text-sm text-gray-600">Total Votes</div>
      </div>

      <div className="space-y-3">
        {poll.options.map((option) => (
          <div key={option.id} className="relative">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium relative z-10">{option.text}</span>
              <div className="text-right relative z-10">
                <div className="font-semibold">{option.votes} votes</div>
                <div className="text-sm text-gray-600">{option.percentage.toFixed(1)}%</div>
              </div>
            </div>
            <div 
              className="absolute top-0 left-0 h-full bg-blue-100 rounded-lg transition-all duration-300"
              style={{ width: `${option.percentage}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
