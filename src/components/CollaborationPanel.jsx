/**
 * Collaboration Panel Component for Higgsfield
 *
 * Real-time collaboration features with user presence and conflict resolution
 */

export function CollaborationPanel({ className }) {
  const [users, setUsers] = React.useState([
    {
      id: 'user1',
      name: 'You',
      color: '#3b82f6',
      cursor: { x: 100, y: 200 },
      status: 'online',
      permissions: ['read', 'write']
    },
    {
      id: 'user2',
      name: 'Alice',
      color: '#10b981',
      cursor: { x: 300, y: 150 },
      status: 'online',
      permissions: ['read', 'write']
    },
    {
      id: 'user3',
      name: 'Bob',
      color: '#f59e0b',
      cursor: null,
      status: 'away',
      permissions: ['read']
    }
  ]);

  const [activities, setActivities] = React.useState([
    { id: 1, user: 'Alice', action: 'Added clip to Video Track 1', time: '2 min ago' },
    { id: 2, user: 'Bob', action: 'Adjusted color grading', time: '5 min ago' },
    { id: 3, user: 'You', action: 'Split audio clip', time: '8 min ago' }
  ]);

  const [conflicts, setConflicts] = React.useState([
    {
      id: 1,
      description: 'Alice and Bob edited the same clip',
      type: 'clip-edit',
      resolved: false,
      participants: ['Alice', 'Bob']
    }
  ]);

  const [sessionActive, setSessionActive] = React.useState(true);

  const startSession = () => {
    setSessionActive(true);
    // Simulate starting collaboration session
  };

  const resolveConflict = (conflictId) => {
    setConflicts(conflicts.map(conflict =>
      conflict.id === conflictId
        ? { ...conflict, resolved: true }
        : conflict
    ));
  };

  return (
    <div className={`collaboration-panel h-full flex flex-col bg-gray-900 text-white ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">👥 Collaboration</h2>
          <div className="flex items-center gap-2">
            {sessionActive && (
              <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full animate-pulse">
                Live Session
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-1">Real-time multi-user editing</p>
      </div>

      {/* Session Status */}
      <div className="p-4 border-b border-gray-700">
        {!sessionActive ? (
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded transition-colors"
            onClick={startSession}
          >
            🚀 Start Collaboration Session
          </button>
        ) : (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-green-400">Session Active</div>
                <div className="text-xs text-gray-400">3 participants • Started 15 min ago</div>
              </div>
              <button
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                onClick={() => setSessionActive(false)}
              >
                End Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-medium text-white mb-3">
          Active Users ({users.filter(u => u.status === 'online').length})
        </h3>
        <div className="space-y-2">
          {users.map(user => (
            <div key={user.id} className="flex items-center gap-3 p-2 bg-gray-800 rounded">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: user.color }}
              >
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-gray-400">
                  {user.permissions.includes('write') ? 'Editor' : 'Viewer'}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {user.cursor && (
                  <span className="text-xs text-blue-400">🖱️</span>
                )}
                <span className={`text-xs ${
                  user.status === 'online' ? 'text-green-400' :
                  user.status === 'away' ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {user.status === 'online' ? '●' : user.status === 'away' ? '○' : '●'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto p-4 border-b border-gray-700">
        <h3 className="text-sm font-medium text-white mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {activities.map(activity => (
            <div key={activity.id} className="p-3 bg-gray-800 rounded">
              <div className="text-sm text-white">
                <span className="font-medium text-blue-400">{activity.user}</span> {activity.action}
              </div>
              <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Conflicts */}
      {conflicts.filter(c => !c.resolved).length > 0 && (
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white mb-3">
            Conflicts ({conflicts.filter(c => !c.resolved).length})
          </h3>
          <div className="space-y-2">
            {conflicts.filter(c => !c.resolved).map(conflict => (
              <div key={conflict.id} className="p-3 bg-red-900/20 border border-red-700 rounded">
                <div className="text-sm text-white mb-2">{conflict.description}</div>
                <div className="text-xs text-gray-400 mb-3">
                  Participants: {conflict.participants.join(', ')}
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                    onClick={() => resolveConflict(conflict.id)}
                  >
                    Keep Latest
                  </button>
                  <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded">
                    Manual Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collaboration Tools */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-white mb-3">Collaboration Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded text-center">
            💬 Chat
          </button>
          <button className="p-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded text-center">
            🎥 Record Session
          </button>
          <button className="p-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded text-center">
            📊 Analytics
          </button>
          <button className="p-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded text-center">
            🔒 Permissions
          </button>
        </div>
      </div>
    </div>
  );
}