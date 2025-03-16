// File: screens/Tools/SavingsCalculatorScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import {
  Card,
  Title,
  Text,
  TextInput,
  Button,
  Divider,
  ToggleButton,
  Slider,
  HelperText
} from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SavingsCalculatorScreen = () => {
  const [calculatorMode, setCalculatorMode] = useState('regular');
  const [initialAmount, setInitialAmount] = useState('0');
  const [monthlyContribution, setMonthlyContribution] = useState('100');
  const [targetAmount, setTargetAmount] = useState('1000');
  const [interestRate, setInterestRate] = useState('2');
  const [timeYears, setTimeYears] = useState('5');
  const [timePeriod, setTimePeriod] = useState('years');
  
  // Results
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  
  useEffect(() => {
    calculate();
  }, [
    calculatorMode, 
    initialAmount, 
    monthlyContribution, 
    targetAmount, 
    interestRate, 
    timeYears,
    timePeriod
  ]);
  
  const calculate = () => {
    const initial = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const target = parseFloat(targetAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(timeYears) || 0;
    
    // Convert time to months based on selected period
    const months = timePeriod === 'years' ? years * 12 : years;
    
    if (months <= 0) return;
    
    if (calculatorMode === 'target') {
      // Calculate time needed to reach target amount
      let currentAmount = initial;
      let monthsNeeded = 0;
      const rateMonthly = rate / 100 / 12;
      const monthlyData = [currentAmount];
      
      while (currentAmount < target && monthsNeeded < 600) { // Cap at 50 years
        currentAmount = currentAmount * (1 + rateMonthly) + monthly;
        monthsNeeded++;
        
        if (monthsNeeded % 12 === 0 || monthsNeeded === months) {
          monthlyData.push(currentAmount);
        }
      }
      
      const yearsNeeded = monthsNeeded / 12;
      const totalContributions = initial + (monthly * monthsNeeded);
      const interestEarned = currentAmount - totalContributions;
      
      setResults({
        finalAmount: currentAmount,
        monthsNeeded,
        yearsNeeded,
        totalContributions,
        interestEarned
      });
      
      // Prepare chart data
      const labels = [];
      for (let i = 0; i <= Math.ceil(yearsNeeded); i += Math.max(1, Math.floor(yearsNeeded / 5))) {
        labels.push(`${i}y`);
      }
      
      // Adjust data to match labels
      const data = [initial];
      for (let i = 1; i < labels.length; i++) {
        const yearIndex = parseInt(labels[i]);
        const monthIndex = yearIndex * 12;
        if (monthIndex < monthlyData.length) {
          data.push(monthlyData[monthIndex]);
        } else {
          data.push(currentAmount);
        }
      }
      
      setChartData({
        labels,
        datasets: [{ data }]
      });
      
    } else {
      // Calculate final amount after specified time
      const rateMonthly = rate / 100 / 12;
      let currentAmount = initial;
      const yearlyData = [currentAmount];
      
      for (let i = 1; i <= months; i++) {
        currentAmount = currentAmount * (1 + rateMonthly) + monthly;
        
        if (i % 12 === 0 || i === months) {
          yearlyData.push(currentAmount);
        }
      }
      
      const totalContributions = initial + (monthly * months);
      const interestEarned = currentAmount - totalContributions;
      
      setResults({
        finalAmount: currentAmount,
        monthsNeeded: months,
        yearsNeeded: months / 12,
        totalContributions,
        interestEarned
      });
      
      // Prepare chart data
      const timeInYears = months / 12;
      const labels = [];
      for (let i = 0; i <= timeInYears; i += Math.max(1, Math.floor(timeInYears / 5))) {
        labels.push(`${i}y`);
      }
      
      // Adjust data to match labels
      const data = [];
      for (let i = 0; i < labels.length; i++) {
        const yearIndex = parseInt(labels[i]);
        data.push(yearlyData[yearIndex] || yearlyData[yearlyData.length - 1]);
      }
      
      setChartData({
        labels,
        datasets: [{ data }]
      });
    }
  };
  
  const screenWidth = Dimensions.get('window').width - 32;
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Savings Calculator</Text>
          <Text style={styles.subtitle}>
            Calculate how your savings will grow over time or how long it will take to reach your goal.
          </Text>
        </View>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Calculator Mode</Title>
            <ToggleButton.Row 
              onValueChange={value => value !== null && setCalculatorMode(value)} 
              value={calculatorMode}
              style={styles.toggleRow}
            >
              <ToggleButton 
                icon="calculator" 
                value="regular" 
                style={[
                  styles.toggleButton,
                  calculatorMode === 'regular' ? styles.activeToggle : null
                ]}
              >
                <Text style={calculatorMode === 'regular' ? styles.activeToggleText : styles.toggleText}>
                  Regular Savings
                </Text>
              </ToggleButton>
              <ToggleButton 
                icon="bullseye-arrow" 
                value="target" 
                style={[
                  styles.toggleButton,
                  calculatorMode === 'target' ? styles.activeToggle : null
                ]}
              >
                <Text style={calculatorMode === 'target' ? styles.activeToggleText : styles.toggleText}>
                  Target Amount
                </Text>
              </ToggleButton>
            </ToggleButton.Row>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Savings Details</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Initial Deposit</Text>
              <TextInput
                value={initialAmount}
                onChangeText={setInitialAmount}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                left={<TextInput.Affix text="$" />}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Monthly Contribution</Text>
              <TextInput
                value={monthlyContribution}
                onChangeText={setMonthlyContribution}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                left={<TextInput.Affix text="$" />}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Annual Interest Rate</Text>
              <TextInput
                value={interestRate}
                onChangeText={setInterestRate}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                right={<TextInput.Affix text="%" />}
              />
            </View>
            
            {calculatorMode === 'regular' ? (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Time Period</Text>
                <View style={styles.timeInputRow}>
                  <TextInput
                    value={timeYears}
                    onChangeText={setTimeYears}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.timeInput}
                  />
                  <ToggleButton.Row 
                    onValueChange={value => value !== null && setTimePeriod(value)} 
                    value={timePeriod}
                    style={styles.timePeriodToggle}
                  >
                    <ToggleButton 
                      value="months" 
                      style={[
                        styles.periodButton,
                        timePeriod === 'months' ? styles.activeToggle : null
                      ]}
                    >
                      <Text style={timePeriod === 'months' ? styles.activeToggleText : styles.toggleText}>
                        Months
                      </Text>
                    </ToggleButton>
                    <ToggleButton 
                      value="years" 
                      style={[
                        styles.periodButton,
                        timePeriod === 'years' ? styles.activeToggle : null
                      ]}
                    >
                      <Text style={timePeriod === 'years' ? styles.activeToggleText : styles.toggleText}>
                        Years
                      </Text>
                    </ToggleButton>
                  </ToggleButton.Row>
                </View>
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Target Amount</Text>
                <TextInput
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Affix text="$" />}
                />
              </View>
            )}
          </Card.Content>
        </Card>
        
        {results && (
          <Card style={styles.resultsCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Results</Title>
              <Divider style={styles.divider} />
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Final Amount</Text>
                <Text style={styles.resultValue}>{formatCurrency(results.finalAmount)}</Text>
              </View>
              
              {calculatorMode === 'target' && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Time Needed</Text>
                  <Text style={styles.resultValue}>
                    {results.yearsNeeded.toFixed(1)} years
                    {results.yearsNeeded > 0 ? ` (${Math.ceil(results.monthsNeeded)} months)` : ''}
                  </Text>
                </View>
              )}
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Contributions</Text>
                <Text style={styles.resultValue}>{formatCurrency(results.totalContributions)}</Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Interest Earned</Text>
                <Text style={[styles.resultValue, styles.interestValue]}>
                  {formatCurrency(results.interestEarned)}
                </Text>
              </View>
              
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Growth Projection</Text>
                <LineChart
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        data: chartData.datasets[0].data,
                        color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
                        strokeWidth: 2,
                      }
                    ]
                  }}
                  width={screenWidth}
                  height={220}
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
                    formatYLabel: (value) => formatCurrency(value, 'USD', 'en-US', { 
                      notation: 'compact',
                      maximumFractionDigits: 1
                    }),
                  }}
                  bezier
                  style={styles.chart}
                  fromZero
                />
              </View>
              
              <View style={styles.breakdownContainer}>
                <View style={styles.breakdownItem}>
                  <View style={[styles.breakdownColor, { backgroundColor: '#6200ee' }]} />
                  <Text style={styles.breakdownLabel}>Total</Text>
                </View>
                
                <View style={styles.breakdownItem}>
                  <View style={[styles.breakdownColor, { backgroundColor: '#E0E0E0' }]} />
                  <Text style={styles.breakdownLabel}>Contributions</Text>
                </View>
                
                <View style={styles.breakdownItem}>
                  <View style={[styles.breakdownColor, { backgroundColor: '#4CAF50' }]} />
                  <Text style={styles.breakdownLabel}>Interest</Text>
                </View>
              </View>
              
              <View style={styles.insightContainer}>
                <Icon name="lightbulb-outline" size={20} color="#FF9800" style={styles.insightIcon} />
                <Text style={styles.insightText}>
                  {calculatorMode === 'target' 
                    ? `At your current savings rate, you'll reach your goal of ${formatCurrency(parseFloat(targetAmount))} in approximately ${results.yearsNeeded.toFixed(1)} years.` 
                    : `By saving ${formatCurrency(parseFloat(monthlyContribution))} monthly for ${timeYears} ${timePeriod}, you'll accumulate ${formatCurrency(results.finalAmount)}.`
                  }
                </Text>
              </View>
              
              <Button
                mode="contained"
                onPress={() => {
                  // Save calculation results
                  Alert.alert('Success', 'Calculation saved to your profile');
                }}
                style={styles.saveButton}
                icon="content-save"
              >
                Save Calculation
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#6200ee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  toggleRow: {
    justifyContent: 'center',
    marginTop: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
  },
  toggleText: {
    fontSize: 14,
  },
  activeToggle: {
    backgroundColor: '#EDE7F6',
  },
  activeToggleText: {
    color: '#6200ee',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'white',
  },
  timePeriodToggle: {
    flex: 1,
  },
  periodButton: {
    flex: 1,
  },
  resultsCard: {
    margin: 16,
    marginBottom: 32,
    backgroundColor: '#f8f8f8',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  interestValue: {
    color: '#4CAF50',
  },
  chartContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  breakdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  breakdownColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666',
  },
  insightContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  insightIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  insightText: {
    color: '#FF9800',
    flex: 1,
    lineHeight: 20,
  },
  saveButton: {
    marginTop: 8,
  },
});

export default SavingsCalculatorScreen;
