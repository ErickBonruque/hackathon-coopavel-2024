import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';

import ReactApexChart from 'react-apexcharts';

const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

const IncomeAreaChart = ({ slot, nh3, co2 }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories:
          slot === 'month'
            ? ['07/02', '08/02', '09/02', '10/02', '11/02', '12/02', '13/02', '14/02', '15/02']
            : ['07/02', '08/02', '09/02', '10/02', '11/02', '12/02', '13/02', '14/02', '15/02'],
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary
            ]
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'month' ? 11 : 7
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      }
    }));
  }, [primary, secondary, line, theme, slot]);

  const [series, setSeries] = useState([
    {
      name: 'NH3',
      data: nh3
    },
    {
      name: 'CO2',
      data: co2
    }
  ]);

  useEffect(() => {
    setSeries([
      {
        name: 'NH3',
        data: slot === 'month' ? nh3 : nh3
      },
      {
        name: 'CO2',
        data: slot === 'month' ? co2 : co2
      }
    ]);
  }, [slot]);

  return <ReactApexChart key="C" options={options} series={series} type="area" height={450} />;
};

IncomeAreaChart.propTypes = {
  slot: PropTypes.string
};

export default IncomeAreaChart;
