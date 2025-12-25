import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import {
  transformForecastData,
  transformRFMData,
  transformDiscountsData,
  calculateMetricsFromForecast
} from '../utils/dataTransformers';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [forecastData, setForecastData] = useState(null);
  const [rfmData, setRfmData] = useState(null);
  const [discountsData, setDiscountsData] = useState(null);
  const [runAllData, setRunAllData] = useState(null);

  const [loading, setLoading] = useState({
    forecast: false,
    rfm: false,
    discounts: false,
    runAll: false,
  });

  const [error, setError] = useState({
    forecast: null,
    rfm: null,
    discounts: null,
    runAll: null,
  });

  /* ================= FETCH FUNCTIONS ================= */

  const fetchForecast = useCallback(async () => {
    setLoading(prev => ({ ...prev, forecast: true }));
    setError(prev => ({ ...prev, forecast: null }));
    try {
      const data = await apiService.getForecast();
      setForecastData(data);
      return data;
    } catch (err) {
      setError(prev => ({
        ...prev,
        forecast: 'Failed to fetch forecast data'
      }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, forecast: false }));
    }
  }, []);

  const fetchRFM = useCallback(async () => {
    setLoading(prev => ({ ...prev, rfm: true }));
    setError(prev => ({ ...prev, rfm: null }));
    try {
      const data = await apiService.getRFM();
      setRfmData(data);
      return data;
    } catch {
      setError(prev => ({
        ...prev,
        rfm: 'Failed to fetch RFM data'
      }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, rfm: false }));
    }
  }, []);

  const fetchDiscounts = useCallback(async () => {
    setLoading(prev => ({ ...prev, discounts: true }));
    setError(prev => ({ ...prev, discounts: null }));
    try {
      const data = await apiService.getDiscounts();
      setDiscountsData(data);
      return data;
    } catch {
      setError(prev => ({
        ...prev,
        discounts: 'Failed to fetch discounts data'
      }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, discounts: false }));
    }
  }, []);

  const fetchRunAll = useCallback(async () => {
    setLoading(prev => ({ ...prev, runAll: true }));
    setError(prev => ({ ...prev, runAll: null }));
    try {
      const data = await apiService.runAll();
      setRunAllData(data);
      return data;
    } catch (err) {
      setError(prev => ({
        ...prev,
        runAll: 'Backend is waking up (cold start). Please retry.'
      }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, runAll: false }));
    }
  }, []);

  /* ================= TRANSFORMED DATA ================= */

  const getTransformedForecast = useCallback(() => {
    const forecast = runAllData?.forecast || forecastData?.forecast;
    return forecast ? transformForecastData(forecast) : [];
  }, [forecastData, runAllData]);

  const getTransformedSegments = useCallback(() => {
    const rfm = runAllData?.rfm || rfmData;
    return rfm ? transformRFMData(rfm) : [];
  }, [rfmData, runAllData]);

  const getTransformedOffers = useCallback(() => {
    const discounts = runAllData?.discounts || discountsData;
    const rfm = runAllData?.rfm || rfmData;
    return discounts ? transformDiscountsData(discounts, rfm) : [];
  },


