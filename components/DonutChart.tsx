import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import * as d3 from 'd3-shape';

interface DonutChartProps {
  data: number[];
  colors: string[];
  labels?: string[];
  onSegmentPress?: (index: number, label?: string) => void;
  size?: number;
  strokeWidth?: number;
  showCenterLabel?: boolean;
  centerLabelColor?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  colors,
  labels,
  onSegmentPress,
  size = Dimensions.get('window').width * 0.6,
  strokeWidth = 30,
  showCenterLabel = true,
  centerLabelColor = '#4E6CF0',
}) => {
  const radius = size / 2;
  const total = data.reduce((sum, val) => sum + val, 0);

const pieData = d3.pie<number>()(data);
  const arcGenerator = d3
    .arc<d3.PieArcDatum<number>>()
    .innerRadius(radius - strokeWidth)
    .outerRadius(radius)
    .cornerRadius(6);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Svg width={size} height={size}>
        <G x={radius} y={radius}>
          {pieData.map((slice: d3.PieArcDatum<number>, index: number) => (
            <Path
              key={index}
              d={arcGenerator(slice) as string}
              fill={colors[index] || '#ccc'}
              onPressIn={() => onSegmentPress?.(index, labels?.[index])}
            />
          ))}
        </G>
      </Svg>

      {showCenterLabel && (
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            alignItems: 'center',
            transform: [{ translateY: -10 }],
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: centerLabelColor }}>
            {Math.round((data[0] / total) * 100)}%
          </Text>
        </View>
      )}
    </View>
  );
};

export default DonutChart;
