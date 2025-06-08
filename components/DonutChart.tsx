import React from 'react';
import { View, Text as RNText, Dimensions } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
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
  totalCapacity?: number;
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
  totalCapacity = 100,
}) => {
  const radius = size / 2;
  const totalUsage = data.reduce((sum, val) => sum + val, 0);

  const pieData = d3.pie<number>()(data);
  const arcGenerator = d3
    .arc<d3.PieArcDatum<number>>()
    .innerRadius(radius - strokeWidth)
    .outerRadius(radius)
    .cornerRadius(6);

  const labelArcGenerator = d3
    .arc<d3.PieArcDatum<number>>()
    .innerRadius(radius - strokeWidth / 2)
    .outerRadius(radius - strokeWidth / 2); 

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Svg width={size} height={size}>
        <G x={radius} y={radius}>
          {pieData.map((slice, index) => {
            const arcPath = arcGenerator(slice) as string;
            const [labelX, labelY] = labelArcGenerator.centroid(slice);
            const labelText = labels?.[index] || '';

            return (
              <React.Fragment key={index}>
                <Path
                  d={arcPath}
                  fill={colors[index % colors.length] || '#ccc'}
                  onPressIn={() => onSegmentPress?.(index, labelText)}
                />
                <SvgText
                  x={labelX}
                  y={labelY}
                  fill="blue"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {labelText}
                </SvgText>
              </React.Fragment>
            );
          })}
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
          <RNText style={{ fontSize: 22, fontWeight: 'bold', color: 'green' }}>
            {Math.round((totalUsage / totalCapacity) * 100)}%
          </RNText>
          <RNText style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}>
            {totalUsage.toFixed(1)} / {totalCapacity} GB
          </RNText>
        </View>
      )}
    </View>
  );
};

export default DonutChart;