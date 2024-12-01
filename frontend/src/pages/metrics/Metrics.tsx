import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';
import styles from './Metrics.module.css';
import { ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler);

interface MetricsProps {
  selectedTimeFrame: string;
}

const Metrics: React.FC<MetricsProps> = ({ selectedTimeFrame }) => {
  const [metricsData, setMetricsData] = useState({
    offerLettersSent: [],
    candidatesProcessed: [],
    yourScore: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = "echoi"; // Use actual username from context or auth state
        const response = await fetch(`/metrics?username=${encodeURIComponent(username)}&timeFrame=${encodeURIComponent(selectedTimeFrame)}`);
        if (!response.ok) {
          console.error(`Server error when fetching metrics: ${response.status} ${response.statusText}`);
          return;
        }
        const data = await response.json();
        setMetricsData({
          offerLettersSent: data.offerLettersSent || [],
          candidatesProcessed: data.candidatesProcessed || [],
          yourScore: data.score || []
        });
      } catch (error) {
        console.error(`Fetch error: ${error}`);
      }
    };

    fetchData();
  }, [selectedTimeFrame]);

  interface MetricData {
    timeStamp: string;
    value: number;
  }

  const filterDataByTimeFrame = (data: MetricData[], timeFrame: string): MetricData[] => {
    const now = new Date();
    let startDate: Date;

    switch (timeFrame) {
      case 'Past Week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'Past Month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'Past 3 Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'Past 6 Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const filteredData = data.filter(d => {
      const dateParts = d.timeStamp.split('-');
      const date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
      return date >= startDate;
    });
    return filteredData;
  };

  const calculateChange = (data: MetricData[], timeFrame: string) => {
    const filteredData = filterDataByTimeFrame(data, timeFrame);
    if (!filteredData || filteredData.length < 2) return { percentChange: 0, valueChange: 0 };
    const initialValue = filteredData[0].value;
    const finalValue = filteredData[filteredData.length - 1].value;
    const valueChange = finalValue - initialValue;
    const percentChange = ((valueChange / initialValue) * 100).toFixed(1);
    return { percentChange, valueChange };
  };

  const renderMetric = (metricName: string, data: MetricData[]) => {
    const filteredData = filterDataByTimeFrame(data, selectedTimeFrame);
    const { percentChange, valueChange } = calculateChange(data, selectedTimeFrame);
    const isPositiveChange = valueChange >= 0;
    const color = isPositiveChange ? 'green' : 'red';
    const backgroundColor = isPositiveChange ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'; // Slightly brighter color under the line
  
    const chartData = {
      labels: filteredData.map(d => d.timeStamp),
      datasets: [
        {
          label: '', // No label in the legend
          data: filteredData.map(d => d.value),
          borderColor: color, // Color of the line
          backgroundColor: backgroundColor, // Slightly brighter color under the line
          pointRadius: 0, // Remove dots
          fill: true, // Ensure the area under the line is filled
          tension: 0, // Remove smoothing from the line
        }
      ],
    };
    
    const options: ChartOptions<'line'> = {
      plugins: {
      legend: {
        display: false, // Remove the legend
      },
      },
      scales: {
      x: {
        type: 'time',
        time: {
        unit: 'day',
        },
        grid: {
        display: false, // Hide grid lines
        },
      },
      y: {
        beginAtZero: true,
        grid: {
        display: false, // Hide grid lines
        },
      },
      },
    };
    return (
      <div className={styles.metric}>
        <div className={styles.metricHeader}>
          <p><span style={{ color }}>{isPositiveChange ? '▲' : '▼'}</span> {metricName} </p>
          <p className={styles.metricChange} style={{ color }}>{percentChange}% ({valueChange})</p>
          <p className={styles.metricValue}>{data[data.length - 1]?.value}</p>
        </div>
        <Line data={chartData} options={options} />
      </div>
    );
  };


  return (
    <section className={styles.metrics}>
      {renderMetric('Offer Letters Sent', metricsData.offerLettersSent)}
      {renderMetric('Candidates Processed', metricsData.candidatesProcessed)}
      {renderMetric('Your Score', metricsData.yourScore)}
      <div className={styles.aiInsights}>
        <h3>AI Insights</h3>
        <ul>
          <li>Try adding more key skills to insights chart</li>
          <li>Utilize copilot to ask questions about resume data</li>
        </ul>
      </div>
    </section>
  );
};

export default Metrics;