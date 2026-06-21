/**
 * THE SINGLE SOURCE OF TRUTH for every backend route this frontend may
 * call. Every template literal below is built character-for-character
 * from api_endpoints.txt — nothing here is inferred, guessed, or
 * extrapolated. If a route is not in that file, it does not appear
 * here, and nothing in the app may call it.
 *
 * Each entry is commented with its exact source line (path, Django
 * view, url name) for direct auditability against api_endpoints.txt.
 *
 * Every function returns a PATH ONLY (e.g. "/api/v1/auth/login/").
 * The host is supplied exactly once, in client.ts, from
 * NEXT_PUBLIC_API_URL. This file never knows or cares what the host is.
 */

export const ENDPOINTS = {
  // /api/v1/analytics/posts/<slug:slug>/  apps.analytics.views.PostMetricsView  v1:post-metrics
  postMetrics: (slug: string) => `/api/v1/analytics/posts/${slug}/`,
  // /api/v1/analytics/users/<str:username>/  apps.analytics.views.UserMetricsView  v1:user-metrics
  userMetrics: (username: string) => `/api/v1/analytics/users/${username}/`,

  // /api/v1/audit-logs/  apps.audit_logs.views.AuditLogListView  v1:audit-log-list
  auditLogs: () => `/api/v1/audit-logs/`,
  // /api/v1/audit-logs/logins/  apps.audit_logs.views.LoginAuditLogListView  v1:login-audit-log-list
  loginAuditLogs: () => `/api/v1/audit-logs/logins/`,
  // /api/v1/audit-logs/me/  apps.audit_logs.views.MyAuditLogView  v1:my-audit-log
  myAuditLog: () => `/api/v1/audit-logs/me/`,

  // /api/v1/auth/login/  apps.authentication.views.LoginView  v1:login
  login: () => `/api/v1/auth/login/`,
  // /api/v1/auth/logout-all/  apps.authentication.views.LogoutAllDevicesView  v1:logout-all
  logoutAll: () => `/api/v1/auth/logout-all/`,
  // /api/v1/auth/logout/  apps.authentication.views.LogoutView  v1:logout
  logout: () => `/api/v1/auth/logout/`,
  // /api/v1/auth/password-change/  apps.authentication.views.PasswordChangeView  v1:password-change
  passwordChange: () => `/api/v1/auth/password-change/`,
  // /api/v1/auth/password-reset/  apps.authentication.views.PasswordResetRequestView  v1:password-reset-request
  passwordResetRequest: () => `/api/v1/auth/password-reset/`,
  // /api/v1/auth/password-reset/confirm/  apps.authentication.views.PasswordResetConfirmView  v1:password-reset-confirm
  passwordResetConfirm: () => `/api/v1/auth/password-reset/confirm/`,
  // /api/v1/auth/refresh/  apps.authentication.views.TokenRefreshView  v1:token-refresh
  refresh: () => `/api/v1/auth/refresh/`,
  // /api/v1/auth/register/  apps.authentication.views.RegisterView  v1:register
  register: () => `/api/v1/auth/register/`,

  // /api/v1/crypto/conversations/<uuid:conversation_id>/disappearing/  apps.crypto_messaging.views.DisappearingMessagesView  v1:disappearing-messages
  cryptoDisappearing: (conversationId: string) =>
    `/api/v1/crypto/conversations/${conversationId}/disappearing/`,
  // /api/v1/crypto/conversations/<uuid:conversation_id>/messages/  apps.crypto_messaging.views.EncryptedMessageListCreateView  v1:encrypted-messages
  cryptoMessages: (conversationId: string) =>
    `/api/v1/crypto/conversations/${conversationId}/messages/`,
  // /api/v1/crypto/conversations/<uuid:conversation_id>/pinned/  apps.crypto_messaging.views.PinnedMessagesListView  v1:pinned-messages
  cryptoPinned: (conversationId: string) =>
    `/api/v1/crypto/conversations/${conversationId}/pinned/`,
  // /api/v1/crypto/conversations/<uuid:conversation_id>/typing/  apps.crypto_messaging.views.TypingIndicatorView  v1:typing-indicator
  cryptoTyping: (conversationId: string) =>
    `/api/v1/crypto/conversations/${conversationId}/typing/`,
  // /api/v1/crypto/devices/  apps.crypto_messaging.views.DeviceListCreateView  v1:device-list-create
  cryptoDevices: () => `/api/v1/crypto/devices/`,
  // /api/v1/crypto/devices/<str:device_id>/one-time-prekeys/  apps.crypto_messaging.views.UploadOneTimePreKeysView  v1:upload-otpk
  cryptoUploadOneTimePreKeys: (deviceId: string) =>
    `/api/v1/crypto/devices/${deviceId}/one-time-prekeys/`,
  // /api/v1/crypto/devices/<str:device_id>/one-time-prekeys/count/  apps.crypto_messaging.views.OneTimePreKeyCountView  v1:otpk-count
  cryptoOneTimePreKeyCount: (deviceId: string) =>
    `/api/v1/crypto/devices/${deviceId}/one-time-prekeys/count/`,
  // /api/v1/crypto/devices/<str:device_id>/revoke/  apps.crypto_messaging.views.RevokeDeviceView  v1:revoke-device
  cryptoRevokeDevice: (deviceId: string) => `/api/v1/crypto/devices/${deviceId}/revoke/`,
  // /api/v1/crypto/devices/<str:device_id>/signed-prekey/  apps.crypto_messaging.views.RotateSignedPreKeyView  v1:rotate-signed-prekey
  cryptoRotateSignedPreKey: (deviceId: string) =>
    `/api/v1/crypto/devices/${deviceId}/signed-prekey/`,
  // /api/v1/crypto/identity-key/  apps.crypto_messaging.views.RegisterIdentityKeyView  v1:register-identity-key
  cryptoIdentityKey: () => `/api/v1/crypto/identity-key/`,
  // /api/v1/crypto/key-bundle/<str:username>/  apps.crypto_messaging.views.KeyBundleView  v1:key-bundle
  cryptoKeyBundle: (username: string) => `/api/v1/crypto/key-bundle/${username}/`,
  // /api/v1/crypto/messages/<uuid:message_id>/  apps.crypto_messaging.views.EncryptedMessageDetailView  v1:encrypted-message-detail
  cryptoMessageDetail: (messageId: string) => `/api/v1/crypto/messages/${messageId}/`,
  // /api/v1/crypto/messages/<uuid:message_id>/delivered/  apps.crypto_messaging.views.MarkDeliveredView  v1:mark-delivered
  cryptoMarkDelivered: (messageId: string) => `/api/v1/crypto/messages/${messageId}/delivered/`,
  // /api/v1/crypto/messages/<uuid:message_id>/forward/  apps.crypto_messaging.views.ForwardMessageView  v1:forward-message
  cryptoForwardMessage: (messageId: string) => `/api/v1/crypto/messages/${messageId}/forward/`,
  // /api/v1/crypto/messages/<uuid:message_id>/pin/  apps.crypto_messaging.views.PinMessageView  v1:pin-message
  cryptoPinMessage: (messageId: string) => `/api/v1/crypto/messages/${messageId}/pin/`,
  // /api/v1/crypto/messages/<uuid:message_id>/react/  apps.crypto_messaging.views.ReactToMessageView  v1:react-to-message
  cryptoReactToMessage: (messageId: string) => `/api/v1/crypto/messages/${messageId}/react/`,
  // /api/v1/crypto/messages/<uuid:message_id>/read/  apps.crypto_messaging.views.MarkReadView  v1:mark-read-encrypted
  cryptoMarkRead: (messageId: string) => `/api/v1/crypto/messages/${messageId}/read/`,
  // /api/v1/crypto/presence/<str:username>/  apps.crypto_messaging.views.UserPresenceView  v1:user-presence
  cryptoUserPresence: (username: string) => `/api/v1/crypto/presence/${username}/`,
  // /api/v1/crypto/presence/heartbeat/  apps.crypto_messaging.views.PresenceHeartbeatView  v1:presence-heartbeat
  cryptoPresenceHeartbeat: () => `/api/v1/crypto/presence/heartbeat/`,

  // /api/v1/engagement/comments/<uuid:comment_id>/  apps.engagement.views.CommentDetailView  v1:comment-detail
  commentDetail: (commentId: string) => `/api/v1/engagement/comments/${commentId}/`,
  // /api/v1/engagement/comments/<uuid:comment_id>/replies/  apps.engagement.views.ReplyListCreateView  v1:reply-list-create
  replies: (commentId: string) => `/api/v1/engagement/comments/${commentId}/replies/`,
  // /api/v1/engagement/posts/<slug:slug>/comments/  apps.engagement.views.CommentListCreateView  v1:comment-list-create
  comments: (slug: string) => `/api/v1/engagement/posts/${slug}/comments/`,
  // /api/v1/engagement/posts/<slug:slug>/like/  apps.engagement.views.LikeToggleView  v1:like-toggle
  likeToggle: (slug: string) => `/api/v1/engagement/posts/${slug}/like/`,
  // /api/v1/engagement/posts/<slug:slug>/save/  apps.engagement.views.SaveToggleView  v1:save-toggle
  saveToggle: (slug: string) => `/api/v1/engagement/posts/${slug}/save/`,
  // /api/v1/engagement/posts/<slug:slug>/share/  apps.engagement.views.ShareRecordView  v1:share-record
  shareRecord: (slug: string) => `/api/v1/engagement/posts/${slug}/share/`,
  // /api/v1/engagement/replies/<uuid:reply_id>/  apps.engagement.views.ReplyDetailView  v1:reply-detail
  replyDetail: (replyId: string) => `/api/v1/engagement/replies/${replyId}/`,
  // /api/v1/engagement/saved/  apps.engagement.views.SavedPostsListView  v1:saved-posts-list
  savedPosts: () => `/api/v1/engagement/saved/`,

  // /api/v1/feed/explore/  apps.feed.views.ExploreFeedView  v1:explore-feed
  feedExplore: () => `/api/v1/feed/explore/`,
  // /api/v1/feed/home/  apps.feed.views.HomeFeedView  v1:home-feed
  feedHome: () => `/api/v1/feed/home/`,
  // /api/v1/feed/profile/<str:username>/  apps.feed.views.ProfileFeedView  v1:profile-feed
  feedProfile: (username: string) => `/api/v1/feed/profile/${username}/`,
  // /api/v1/feed/reels/  apps.feed.views.ReelsFeedView  v1:reels-feed
  feedReels: () => `/api/v1/feed/reels/`,
  // /api/v1/feed/watch/  apps.feed.views.WatchFeedView  v1:watch-feed
  feedWatch: () => `/api/v1/feed/watch/`,
  // /api/v1/feed/watch/<slug:slug>/related/  apps.feed.views.RelatedVideosView  v1:related-videos
  feedRelatedVideos: (slug: string) => `/api/v1/feed/watch/${slug}/related/`,

  // /api/v1/follows/block/  apps.follows.views.BlockView  v1:block
  followsBlock: () => `/api/v1/follows/block/`,
  // /api/v1/follows/blocked/  apps.follows.views.BlockedUsersListView  v1:blocked-users-list
  followsBlockedList: () => `/api/v1/follows/blocked/`,
  // /api/v1/follows/follow/  apps.follows.views.FollowView  v1:follow
  follow: () => `/api/v1/follows/follow/`,
  // /api/v1/follows/followers/<str:username>/  apps.follows.views.FollowersListView  v1:followers-list
  followers: (username: string) => `/api/v1/follows/followers/${username}/`,
  // /api/v1/follows/following/<str:username>/  apps.follows.views.FollowingListView  v1:following-list
  following: (username: string) => `/api/v1/follows/following/${username}/`,
  // /api/v1/follows/mute/  apps.follows.views.MuteView  v1:mute
  followsMute: () => `/api/v1/follows/mute/`,
  // /api/v1/follows/muted/  apps.follows.views.MutedUsersListView  v1:muted-users-list
  followsMutedList: () => `/api/v1/follows/muted/`,
  // /api/v1/follows/requests/<uuid:request_id>/accept/  apps.follows.views.AcceptFollowRequestView  v1:accept-follow-request
  acceptFollowRequest: (requestId: string) => `/api/v1/follows/requests/${requestId}/accept/`,
  // /api/v1/follows/requests/<uuid:request_id>/reject/  apps.follows.views.RejectFollowRequestView  v1:reject-follow-request
  rejectFollowRequest: (requestId: string) => `/api/v1/follows/requests/${requestId}/reject/`,
  // /api/v1/follows/requests/pending/  apps.follows.views.PendingFollowRequestsView  v1:pending-follow-requests
  pendingFollowRequests: () => `/api/v1/follows/requests/pending/`,
  // /api/v1/follows/unblock/  apps.follows.views.UnblockView  v1:unblock
  followsUnblock: () => `/api/v1/follows/unblock/`,
  // /api/v1/follows/unfollow/  apps.follows.views.UnfollowView  v1:unfollow
  unfollow: () => `/api/v1/follows/unfollow/`,
  // /api/v1/follows/unmute/  apps.follows.views.UnmuteView  v1:unmute
  followsUnmute: () => `/api/v1/follows/unmute/`,

  // /api/v1/hashtags/<str:name>/  apps.hashtags.views.HashtagDetailView  v1:hashtag-detail
  hashtagDetail: (name: string) => `/api/v1/hashtags/${name}/`,
  // /api/v1/hashtags/<str:name>/posts/  apps.hashtags.views.HashtagPostsView  v1:hashtag-posts
  hashtagPosts: (name: string) => `/api/v1/hashtags/${name}/posts/`,
  // /api/v1/hashtags/trending/  apps.hashtags.views.TrendingHashtagsView  v1:trending-hashtags
  trendingHashtags: () => `/api/v1/hashtags/trending/`,

  // /api/v1/health/  apps.core.views.HealthCheckView  v1:health-check
  health: () => `/api/v1/health/`,

  // /api/v1/messaging/conversations/  apps.messaging.views.ConversationListView  v1:conversation-list
  conversations: () => `/api/v1/messaging/conversations/`,
  // /api/v1/messaging/conversations/<uuid:conversation_id>/  apps.messaging.views.ConversationDetailView  v1:conversation-detail
  conversationDetail: (conversationId: string) =>
    `/api/v1/messaging/conversations/${conversationId}/`,
  // /api/v1/messaging/conversations/<uuid:conversation_id>/leave/  apps.messaging.views.LeaveConversationView  v1:leave-conversation
  leaveConversation: (conversationId: string) =>
    `/api/v1/messaging/conversations/${conversationId}/leave/`,
  // /api/v1/messaging/conversations/<uuid:conversation_id>/messages/  apps.messaging.views.ConversationMessagesView  v1:conversation-messages
  conversationMessages: (conversationId: string) =>
    `/api/v1/messaging/conversations/${conversationId}/messages/`,
  // /api/v1/messaging/conversations/<uuid:conversation_id>/read/  apps.messaging.views.MarkConversationReadView  v1:mark-conversation-read
  markConversationRead: (conversationId: string) =>
    `/api/v1/messaging/conversations/${conversationId}/read/`,
  // /api/v1/messaging/conversations/direct/  apps.messaging.views.StartDirectConversationView  v1:start-direct-conversation
  startDirectConversation: () => `/api/v1/messaging/conversations/direct/`,
  // /api/v1/messaging/conversations/group/  apps.messaging.views.StartGroupConversationView  v1:start-group-conversation
  startGroupConversation: () => `/api/v1/messaging/conversations/group/`,
  // /api/v1/messaging/messages/<uuid:message_id>/  apps.messaging.views.DeleteMessageView  v1:delete-message
  deleteMessage: (messageId: string) => `/api/v1/messaging/messages/${messageId}/`,
  // /api/v1/messaging/messages/<uuid:message_id>/read/  apps.messaging.views.MarkMessageReadView  v1:mark-message-read
  markMessageRead: (messageId: string) => `/api/v1/messaging/messages/${messageId}/read/`,
  // /api/v1/messaging/unread-count/  apps.messaging.views.UnreadMessageCountView  v1:messaging-unread-count
  messagingUnreadCount: () => `/api/v1/messaging/unread-count/`,

  // /api/v1/moderation/banned-words/  apps.moderation.views.BannedWordListCreateView  v1:banned-words-list-create
  bannedWords: () => `/api/v1/moderation/banned-words/`,
  // /api/v1/moderation/comments/<uuid:comment_id>/moderate/  apps.moderation.views.ModerateCommentView  v1:moderate-comment
  moderateComment: (commentId: string) => `/api/v1/moderation/comments/${commentId}/moderate/`,
  // /api/v1/moderation/posts/<slug:slug>/moderate/  apps.moderation.views.ModeratePostView  v1:moderate-post
  moderatePost: (slug: string) => `/api/v1/moderation/posts/${slug}/moderate/`,
  // /api/v1/moderation/strikes/<uuid:strike_id>/revoke/  apps.moderation.views.RevokeStrikeView  v1:revoke-strike
  revokeStrike: (strikeId: string) => `/api/v1/moderation/strikes/${strikeId}/revoke/`,
  // /api/v1/moderation/users/<str:username>/reinstate/  apps.moderation.views.ReinstateAccountView  v1:reinstate-account
  reinstateAccount: (username: string) => `/api/v1/moderation/users/${username}/reinstate/`,
  // /api/v1/moderation/users/<str:username>/strike/  apps.moderation.views.IssueStrikeView  v1:issue-strike
  issueStrike: (username: string) => `/api/v1/moderation/users/${username}/strike/`,
  // /api/v1/moderation/users/<str:username>/strikes/  apps.moderation.views.UserStrikesListView  v1:user-strikes-list
  userStrikes: (username: string) => `/api/v1/moderation/users/${username}/strikes/`,
  // /api/v1/moderation/users/<str:username>/suspend/  apps.moderation.views.SuspendAccountView  v1:suspend-account
  suspendAccount: (username: string) => `/api/v1/moderation/users/${username}/suspend/`,

  // /api/v1/notifications/  apps.notifications.views.NotificationListView  v1:notification-list
  notifications: () => `/api/v1/notifications/`,
  // /api/v1/notifications/<uuid:notification_id>/read/  apps.notifications.views.MarkNotificationReadView  v1:notification-mark-read
  notificationMarkRead: (notificationId: string) =>
    `/api/v1/notifications/${notificationId}/read/`,
  // /api/v1/notifications/preferences/  apps.notifications.views.NotificationPreferenceView  v1:notification-preferences
  notificationPreferences: () => `/api/v1/notifications/preferences/`,
  // /api/v1/notifications/read-all/  apps.notifications.views.MarkAllReadView  v1:notification-mark-all-read
  notificationMarkAllRead: () => `/api/v1/notifications/read-all/`,
  // /api/v1/notifications/unread-count/  apps.notifications.views.UnreadCountView  v1:notification-unread-count
  notificationUnreadCount: () => `/api/v1/notifications/unread-count/`,

  // /api/v1/permissions/permissions/  apps.permissions.views.PermissionListCreateView  v1:permission-list-create
  permissionsList: () => `/api/v1/permissions/permissions/`,
  // /api/v1/permissions/roles/  apps.permissions.views.RoleListCreateView  v1:role-list-create
  rolesList: () => `/api/v1/permissions/roles/`,
  // /api/v1/permissions/roles/<slug:role_slug>/grant/  apps.permissions.views.RoleGrantPermissionView  v1:role-grant-permission
  roleGrantPermission: (roleSlug: string) => `/api/v1/permissions/roles/${roleSlug}/grant/`,
  // /api/v1/permissions/users/<uuid:user_id>/roles/  apps.permissions.views.UserRoleListAssignView  v1:user-role-list-assign
  userRoles: (userId: string) => `/api/v1/permissions/users/${userId}/roles/`,
  // /api/v1/permissions/users/<uuid:user_id>/roles/<slug:role_slug>/  apps.permissions.views.UserRoleRevokeView  v1:user-role-revoke
  userRoleRevoke: (userId: string, roleSlug: string) =>
    `/api/v1/permissions/users/${userId}/roles/${roleSlug}/`,

  // /api/v1/posts/  apps.posts.views.PostCreateView  v1:post-create
  createPost: () => `/api/v1/posts/`,
  // /api/v1/posts/<slug:slug>/  apps.posts.views.PostDetailView  v1:post-detail
  postDetail: (slug: string) => `/api/v1/posts/${slug}/`,
  // /api/v1/posts/<slug:slug>/live/end/  apps.posts.views.LiveEndView  v1:live-end
  liveEnd: (slug: string) => `/api/v1/posts/${slug}/live/end/`,
  // /api/v1/posts/<slug:slug>/live/start/  apps.posts.views.LiveStartView  v1:live-start
  liveStart: (slug: string) => `/api/v1/posts/${slug}/live/start/`,
  // /api/v1/posts/<slug:slug>/view/  apps.posts.views.PostRecordViewView  v1:post-record-view
  postRecordView: (slug: string) => `/api/v1/posts/${slug}/view/`,
  // /api/v1/posts/<slug:slug>/watch/start/  apps.posts.views.WatchStartView  v1:watch-start
  watchStart: (slug: string) => `/api/v1/posts/${slug}/watch/start/`,
  // /api/v1/posts/user/<str:username>/  apps.posts.views.UserPostsListView  v1:user-posts-list
  userPosts: (username: string) => `/api/v1/posts/user/${username}/`,
  // /api/v1/posts/watch/complete/  apps.posts.views.WatchCompleteView  v1:watch-complete
  watchComplete: () => `/api/v1/posts/watch/complete/`,
  // /api/v1/posts/watch/progress/  apps.posts.views.WatchProgressView  v1:watch-progress
  watchProgress: () => `/api/v1/posts/watch/progress/`,

  // /api/v1/reports/admin/comments/  apps.reports.views.AdminCommentReportListView  v1:admin-comment-reports
  adminCommentReports: () => `/api/v1/reports/admin/comments/`,
  // /api/v1/reports/admin/comments/<uuid:report_id>/review/  apps.reports.views.AdminCommentReportReviewView  v1:admin-comment-report-review
  adminCommentReportReview: (reportId: string) =>
    `/api/v1/reports/admin/comments/${reportId}/review/`,
  // /api/v1/reports/admin/posts/  apps.reports.views.AdminPostReportListView  v1:admin-post-reports
  adminPostReports: () => `/api/v1/reports/admin/posts/`,
  // /api/v1/reports/admin/posts/<uuid:report_id>/review/  apps.reports.views.AdminPostReportReviewView  v1:admin-post-report-review
  adminPostReportReview: (reportId: string) => `/api/v1/reports/admin/posts/${reportId}/review/`,
  // /api/v1/reports/admin/users/  apps.reports.views.AdminUserReportListView  v1:admin-user-reports
  adminUserReports: () => `/api/v1/reports/admin/users/`,
  // /api/v1/reports/admin/users/<uuid:report_id>/review/  apps.reports.views.AdminUserReportReviewView  v1:admin-user-report-review
  adminUserReportReview: (reportId: string) => `/api/v1/reports/admin/users/${reportId}/review/`,
  // /api/v1/reports/comments/<uuid:comment_id>/  apps.reports.views.FileCommentReportView  v1:file-comment-report
  fileCommentReport: (commentId: string) => `/api/v1/reports/comments/${commentId}/`,
  // /api/v1/reports/posts/<slug:slug>/  apps.reports.views.FilePostReportView  v1:file-post-report
  filePostReport: (slug: string) => `/api/v1/reports/posts/${slug}/`,
  // /api/v1/reports/users/<str:username>/  apps.reports.views.FileUserReportView  v1:file-user-report
  fileUserReport: (username: string) => `/api/v1/reports/users/${username}/`,

  // /api/v1/search/  apps.search.views.CombinedSearchView  v1:search-combined
  searchCombined: () => `/api/v1/search/`,
  // /api/v1/search/hashtags/  apps.search.views.SearchHashtagsView  v1:search-hashtags
  searchHashtags: () => `/api/v1/search/hashtags/`,
  // /api/v1/search/posts/  apps.search.views.SearchPostsView  v1:search-posts
  searchPosts: () => `/api/v1/search/posts/`,
  // /api/v1/search/users/  apps.search.views.SearchUsersView  v1:search-users
  searchUsers: () => `/api/v1/search/users/`,

  // /api/v1/sessions/  apps.sessions.views.MySessionsListView  v1:my-sessions
  mySessions: () => `/api/v1/sessions/`,
  // /api/v1/sessions/<uuid:session_id>/  apps.sessions.views.SessionRevokeView  v1:session-revoke
  sessionRevoke: (sessionId: string) => `/api/v1/sessions/${sessionId}/`,
  // /api/v1/sessions/all/  apps.sessions.views.RevokeAllSessionsView  v1:revoke-all-sessions
  revokeAllSessions: () => `/api/v1/sessions/all/`,

  // /api/v1/stories/  apps.stories.views.StoryCreateView  v1:story-create
  createStory: () => `/api/v1/stories/`,
  // /api/v1/stories/<uuid:story_id>/  apps.stories.views.StoryDeleteView  v1:story-delete
  storyDelete: (storyId: string) => `/api/v1/stories/${storyId}/`,
  // /api/v1/stories/<uuid:story_id>/view/  apps.stories.views.StoryRecordViewView  v1:story-record-view
  storyRecordView: (storyId: string) => `/api/v1/stories/${storyId}/view/`,
  // /api/v1/stories/<uuid:story_id>/viewers/  apps.stories.views.StoryViewersListView  v1:story-viewers-list
  storyViewers: (storyId: string) => `/api/v1/stories/${storyId}/viewers/`,
  // /api/v1/stories/feed/  apps.stories.views.StoryFeedView  v1:story-feed
  storyFeed: () => `/api/v1/stories/feed/`,
  // /api/v1/stories/user/<str:username>/  apps.stories.views.UserStoriesView  v1:user-stories
  userStories: (username: string) => `/api/v1/stories/user/${username}/`,

  // /api/v1/users/<str:username>/  apps.users.views.PublicProfileView  v1:public-profile
  publicProfile: (username: string) => `/api/v1/users/${username}/`,
  // /api/v1/users/me/  apps.users.views.MyProfileView  v1:my-profile
  myProfile: () => `/api/v1/users/me/`,
  // /api/v1/users/me/devices/  apps.users.views.MyDevicesView  v1:my-devices
  myDevices: () => `/api/v1/users/me/devices/`,
  // /api/v1/users/me/devices/<uuid:device_id>/  apps.users.views.DeviceDeleteView  v1:device-delete
  deviceDelete: (deviceId: string) => `/api/v1/users/me/devices/${deviceId}/`,
  // /api/v1/users/me/subdomain/  apps.users.views.SubdomainRequestView  v1:subdomain-request
  subdomainRequest: () => `/api/v1/users/me/subdomain/`,
  // /api/v1/users/me/username/  apps.users.views.UsernameChangeView  v1:username-change
  usernameChange: () => `/api/v1/users/me/username/`,
  // /api/v1/users/me/username/eligibility/  apps.users.views.UsernameEligibilityView  v1:username-eligibility
  usernameEligibility: () => `/api/v1/users/me/username/eligibility/`,
  // /api/v1/users/subdomain-requests/<uuid:request_id>/review/  apps.users.views.SubdomainRequestReviewView  v1:subdomain-request-review
  subdomainRequestReview: (requestId: string) =>
    `/api/v1/users/subdomain-requests/${requestId}/review/`,
} as const;

/** Query-string parameter keys used across list/feed endpoints. */
export const QUERY_PARAMS = {
  cursor: "cursor",
  pageSize: "page_size",
  page: "page",
  q: "q",
  limit: "limit",
  hashtag: "hashtag",
  startDate: "start_date",
  endDate: "end_date",
} as const;