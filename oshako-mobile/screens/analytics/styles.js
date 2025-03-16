import { StyleSheet } from 'react-native';
import theme from '../../config/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    paddingTop: 48,
    paddingBottom: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexWrap: 'wrap'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    minWidth: 80
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666'
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '500'
  },
  tabContent: {
    padding: 16
  },
  card: {
    marginBottom: 16,
    borderRadius: 8
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8
  },
  timeRangeSelector: {
    position: 'relative'
  },
  timeRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  timeRangeText: {
    fontSize: 14,
    marginRight: 4,
    color: '#666'
  },
  timeMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    width: 150
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  kpiIcon: {
    marginRight: 8
  },
  kpiTitle: {
    fontSize: 14,
    color: '#666'
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4
  },
  kpiTrend: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  kpiTrendValue: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
    marginRight: 4
  },
  kpiTrendPeriod: {
    fontSize: 12,
    color: '#666'
  },
  chart: {
    marginVertical: 16,
    borderRadius: 8
  },
  segmentTabs: {
    flexDirection: 'row',
    marginBottom: 16
  },
  segmentTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeSegmentTab: {
    borderBottomColor: theme.colors.primary
  },
  segmentText: {
    fontSize: 14,
    color: '#666'
  },
  activeSegmentText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500'
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500'
  },
  performanceMetrics: {
    marginBottom: 16
  },
  performanceMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  metricLabel: {
    fontSize: 14
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metricTrendValue: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2
  },
  performanceChartContainer: {
    marginTop: 16
  },
  performanceChartTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  distributionContainer: {
    alignItems: 'center',
    marginVertical: 16
  },
  distributionStats: {
    marginTop: 8
  },
  distributionStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  distributionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2
  },
  distributionColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  distributionLabel: {
    fontSize: 14
  },
  distributionValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right'
  },
  distributionPercentage: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
    flex: 1,
    textAlign: 'right'
  },
  memberMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  memberMetric: {
    width: '32%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  memberMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  memberMetricIcon: {
    marginRight: 8
  },
  memberMetricTitle: {
    fontSize: 12,
    color: '#666'
  },
  memberMetricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4
  },
  memberMetricPercent: {
    fontSize: 12,
    color: '#666'
  },
  memberDivider: {
    marginVertical: 16
  },
  activityChartContainer: {
    marginVertical: 16
  },
  activityChartTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  searchBar: {
    marginBottom: 16,
    elevation: 0,
    backgroundColor: '#f5f5f5'
  },
  consistencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  consistencyValue: {
    marginRight: 4
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  healthScoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  healthScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  healthScoreLabel: {
    fontSize: 12,
    color: '#666'
  },
  healthRating: {
    flex: 1
  },
  healthRatingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  healthRatingDescription: {
    fontSize: 14,
    color: '#666'
  },
  healthCategories: {
    marginTop: 8
  },
  healthCategory: {
    marginBottom: 12
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  categoryIcon: {
    marginRight: 8
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '500'
  },
  categoryScore: {
    fontSize: 14,
    fontWeight: '500'
  },
  categoryProgressBar: {
    height: 6,
    borderRadius: 3
  },
  riskFactors: {
    marginTop: 8
  },
  riskFactor: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  riskFactorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  riskFactorTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  riskIcon: {
    marginRight: 8
  },
  riskTitle: {
    fontSize: 14,
    fontWeight: '500'
  },
  riskChip: {
    height: 24
  },
  riskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  riskRecommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 8,
    borderRadius: 4
  },
  recommendationIcon: {
    marginRight: 8,
    marginTop: 2
  },
  recommendationText: {
    fontSize: 14,
    color: '#2196F3',
    flex: 1
  },
  predictionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  predictionChartContainer: {
    marginVertical: 16
  },
  predictionInsights: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  insightIcon: {
    marginRight: 8,
    marginTop: 2
  },
  insightText: {
    fontSize: 14,
    flex: 1
  },
  reportsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  scheduledReportsList: {
    marginTop: 8
  },
  scheduledReport: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  reportTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  reportDetails: {
    flex: 1
  },
  reportName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  reportFrequency: {
    fontSize: 12,
    color: '#666'
  },
  reportActions: {
    flexDirection: 'row'
  },
  emptyReports: {
    alignItems: 'center',
    padding: 24
  },
  emptyReportsTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8
  },
  emptyReportsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  emptyReportsButton: {
    marginTop: 8
  },
  customReportsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  exportOptions: {
    alignItems: 'center',
    marginBottom: 16
  },
  exportDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 16
  },
  reportTypeOptions: {
    alignItems: 'center',
    marginBottom: 8
  },
  reportTypeButton: {
    marginHorizontal: 4
  },
  selectedReportType: {
    marginTop: 8,
    fontSize: 14,
    color: '#666'
  },
  frequencyOptions: {
    alignItems: 'center',
    marginBottom: 8
  },
  frequencyButton: {
    marginHorizontal: 4
  },
  selectedFrequency: {
    marginTop: 8,
    fontSize: 14,
    color: '#666'
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 8
  },
  dateIcon: {
    marginRight: 8
  },
  dateText: {
    fontSize: 16
  }
});

export default styles;