// Keep in sync with Permissions.cs

export enum Permissions {
  // General permissions
  EditFinding = 30,
  LinkFinding = 40,
  AddTag = 50,
  DeleteTag = 60,
  DeleteFinding = 70,
  DownloadReport = 80,
  DeleteReport = 90,
  GenerateReport = 100,
  AttachReport = 110,
  ImportFindings = 120,
  GiveFeedback = 130,
  ValidateDataQuality = 140,
  DeleteDeepZoomLinks = 310,

  // admin.routes
  AdminNavigation = 150,
  AnnouncementsNavigation = 160,
  FeedbackNavigation = 170,
  UserManagementNavigation = 180,
  TagNavigation = 190,
  LogNavitagion = 200,
  DeletedItemsNavigation = 210,

  // dashboard.routes
  DashboardNavigation = 230,

  // managerview.routes
  ManagerViewNavigation = 240,
  TimelineNavigation = 250,

  // preview.routes
  ImagePreviewNavigation = 260,
  CompareFindingsNavigation = 270,
  DeepZoomLinkPreviewNavigation = 280,
  CompareDeepZoomLinkNavigation = 300,
}
