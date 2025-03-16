// File: components/GroupSavings/ContributionChart.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { formatCurrency } from '../../utils/formatters';

const ContributionChart = ({ data, currency = 'USD' }) => {
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No contribution data available</Text>
      </View>
    );
  }

  // Use the most recent 6 months of data, or all if less than 6
  const chartData = data.slice(-6);
  
  // Extract labels (months) and amounts
  const labels = chartData.map(item => item.month);
  const amounts = chartData.map(item => item.amount);
  
  // Calculate some statistics
  const totalAmount = amounts.reduce((sum, current) => sum + current, 0);
  const avgAmount = totalAmount / amounts.length;
  const maxAmount = Math.max(...amounts);
  
  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: amounts,
              color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get('window').width - 40}
        height={180}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#6200ee',
          },
          propsForLabels: {
            fontSize: 10,
          },
          formatYLabel: (value) => formatCurrency(value, currency, 'en-US', { 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
          }),
        }}
        bezier
        style={styles.chart}
        fromZero
        withInnerLines={false}
        withOuterLines
        withVerticalLabels
        withHorizontalLabels
        yAxisInterval={1}
      />
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>{formatCurrency(avgAmount, currency)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Highest</Text>
          <Text style={styles.statValue}>{formatCurrency(maxAmount, currency)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{formatCurrency(totalAmount, currency)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  emptyContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#757575',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ContributionChart;
