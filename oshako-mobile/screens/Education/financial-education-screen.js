// File: screens/Education/FinancialEducationScreen.js (continued)
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Content</Text>
              <Button 
                mode="text" 
                compact
                onPress={() => handleCategorySelect('All')}
                labelStyle={styles.viewAllLabel}
              >
                View All
              </Button>
            </View>
            
            <FlatList
              data={featuredContent}
              renderItem={renderFeaturedItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>
        )}
        
        {/* Quick Courses Section */}
        <View style={styles.quickCoursesSection}>
          <Text style={styles.sectionTitle}>Quick Courses</Text>
          
          <View style={styles.courseCards}>
            <TouchableOpacity 
              style={styles.courseCard}
              onPress={() => navigation.navigate('CourseCatalog', { category: 'Basics' })}
            >
              <View style={[styles.courseIcon, { backgroundColor: '#E1F5FE' }]}>
                <Icon name="cash" size={24} color="#0288D1" />
              </View>
              <Text style={styles.courseTitle}>Savings Basics</Text>
              <Text style={styles.courseLessons}>5 lessons</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.courseCard}
              onPress={() => navigation.navigate('CourseCatalog', { category: 'Budgeting' })}
            >
              <View style={[styles.courseIcon, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="calculator-variant" size={24} color="#388E3C" />
              </View>
              <Text style={styles.courseTitle}>Budgeting 101</Text>
              <Text style={styles.courseLessons}>7 lessons</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.courseCard}
              onPress={() => navigation.navigate('CourseCatalog', { category: 'Investing' })}
            >
              <View style={[styles.courseIcon, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="chart-line" size={24} color="#F57C00" />
              </View>
              <Text style={styles.courseTitle}>Intro to Investing</Text>
              <Text style={styles.courseLessons}>6 lessons</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Latest Articles Section */}
        <View style={styles.articlesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Articles</Text>
            <Button 
              mode="text" 
              compact
              onPress={() => navigation.navigate('ArticlesList')}
              labelStyle={styles.viewAllLabel}
            >
              View All
            </Button>
          </View>
          
          {filteredContent.length > 0 ? (
            filteredContent.map((item, index) => renderContentItem({ item, index }))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Icon name="magnify-close" size={64} color="#9E9E9E" />
              <Text style={styles.emptyStateTitle}>No results found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or category filter to find what you're looking for.
              </Text>
              <Button 
                mode="contained" 
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setFilteredContent(content);
                }}
                style={styles.resetButton}
              >
                Reset Filters
              </Button>
            </View>
          )}
        </View>
        
        {/* Financial Dictionary Card */}
        <Card style={styles.dictionaryCard}>
          <Card.Content>
            <View style={styles.dictionaryContent}>
              <View>
                <Text style={styles.dictionaryTitle}>Financial Dictionary</Text>
                <Text style={styles.dictionaryDescription}>
                  Learn financial terms and concepts in simple language
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => navigation.navigate('FinancialDictionary')}
                  style={styles.dictionaryButton}
                >
                  Open Dictionary
                </Button>
              </View>
              <Icon name="book-open-variant" size={80} color="#6200ee" style={styles.dictionaryIcon} />
            </View>
          </Card.Content>
        </Card>
        
        {/* Financial Tools Section */}
        <View style={styles.toolsSection}>
          <Text style={styles.sectionTitle}>Financial Tools</Text>
          
          <View style={styles.toolsGrid}>
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigation.navigate('SavingsCalculator')}
            >
              <Icon name="calculator" size={32} color="#6200ee" />
              <Text style={styles.toolTitle}>Savings Calculator</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigation.navigate('BudgetPlanner')}
            >
              <Icon name="chart-pie" size={32} color="#6200ee" />
              <Text style={styles.toolTitle}>Budget Planner</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigation.navigate('DebtPayoffCalculator')}
            >
              <Icon name="credit-card-minus" size={32} color="#6200ee" />
              <Text style={styles.toolTitle}>Debt Payoff Calculator</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigation.navigate('FinancialGoalPlanner')}
            >
              <Icon name="bullseye-arrow" size={32} color="#6200ee" />
              <Text style={styles.toolTitle}>Goal Planner</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  featuredSection: {
    marginTop: 16,
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllLabel: {
    fontSize: 14,
    color: '#6200ee',
  },
  featuredList: {
    paddingHorizontal: 16,
  },
  featuredItem: {
    width: 280,
    marginRight: 16,
  },
  featuredCard: {
    height: 160,
    elevation: 3,
  },
  featuredImage: {
    height: 160,
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  featuredTypeChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 8,
    alignSelf: 'flex-start',
    height: 24,
  },
  featuredTypeText: {
    color: 'white',
    fontSize: 12,
  },
  featuredTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickCoursesSection: {
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  courseCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  courseCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  courseLessons: {
    fontSize: 12,
    color: '#757575',
  },
  articlesSection: {
    marginBottom: 16,
  },
  contentCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  contentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contentType: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    marginRight: 8,
  },
  contentDuration: {
    fontSize: 12,
    color: '#757575',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  contentDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  contentTags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    marginRight: 8,
    height: 24,
  },
  tagText: {
    fontSize: 12,
  },
  extraTags: {
    fontSize: 12,
    color: '#757575',
  },
  contentDate: {
    fontSize: 12,
    color: '#757575',
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 32,
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#757575',
    marginBottom: 16,
  },
  resetButton: {
    marginTop: 8,
  },
  dictionaryCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#EDE7F6',
  },
  dictionaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dictionaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dictionaryDescription: {
    fontSize: 14,
    marginBottom: 16,
    maxWidth: '70%',
  },
  dictionaryButton: {
    alignSelf: 'flex-start',
  },
  dictionaryIcon: {
    opacity: 0.6,
  },
  toolsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  toolCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 16,
    height: 120,
  },
  toolTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FinancialEducationScreen;
