import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DonutChart = () => {
  const data = [
    {
      name: 'Download',
      population: 650,
      color: '#4E6CF0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 14,
    },
    {
      name: 'Upload',
      population: 350,
      color: '#8442E3',
      legendFontColor: '#7F7F7F',
      legendFontSize: 14,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Usage</Text>
      <View style={styles.chartWrapper}>
        <PieChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: () => `#000000`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          hasLegend={false}
          absolute
        />
        <View style={styles.donutCenter}>
          <Text style={styles.centerText}>65%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 20 },
  title: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  chartWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutCenter: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E6CF0',
  },
});

export default DonutChart;
